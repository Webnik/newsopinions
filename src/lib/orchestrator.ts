import { v4 as uuidv4 } from 'uuid';
import db, { Topic, Opinion, Agent } from './database';
import {
  getAllAgents,
  generateAnalysisPrompt,
  storeAnalysis,
  generateSummaryPrompt,
  storeSummary,
  initializeAgents
} from './agents';
import { getRecentOpinions, initializeSources } from './crawler';

// Track initialization state
let isInitialized = false;

// Initialize the system (idempotent - safe to call multiple times)
export function initializeSystem(): void {
  if (isInitialized) {
    return;
  }

  try {
    initializeSources();
    initializeAgents();
    isInitialized = true;
  } catch (error) {
    console.error('[Orchestrator] Failed to initialize system:', error);
    // Don't set isInitialized = true on failure, so we can retry next time
  }
}

// Lazy initialization - call this before any operation that needs the system
export function ensureInitialized(): void {
  if (!isInitialized) {
    initializeSystem();
  }
}

// Identify topics from opinions using clustering/similarity
export function identifyTopics(opinions: Opinion[]): Topic[] {
  // Group opinions by similar themes (simplified version)
  const topicGroups: Map<string, Opinion[]> = new Map();

  for (const opinion of opinions) {
    // Use category and keyword extraction for grouping
    const key = opinion.category || 'general';
    if (!topicGroups.has(key)) {
      topicGroups.set(key, []);
    }
    topicGroups.get(key)!.push(opinion);
  }

  const topics: Topic[] = [];

  for (const [category, groupOpinions] of topicGroups) {
    if (groupOpinions.length >= 2) {
      // Create a topic from this group
      const topic = createTopicFromOpinions(groupOpinions, category);
      topics.push(topic);
    }
  }

  return topics;
}

// Create a topic from a group of related opinions
function createTopicFromOpinions(opinions: Opinion[], category: string): Topic {
  const id = uuidv4();

  // Generate topic title from most common keywords
  const titles = opinions.map(o => o.title);
  const commonWords = findCommonTheme(titles);
  const title = commonWords || `${category.charAt(0).toUpperCase() + category.slice(1)} Debate`;

  // Generate summary
  const summary = `A collection of ${opinions.length} opinions on ${category} topics, featuring perspectives from various sources.`;

  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO topics (id, title, summary, category, created_at, updated_at, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, summary, category, now, now, opinions.length >= 3 ? 1 : 0);

  // Link opinions to topic
  const linkStmt = db.prepare(`
    INSERT OR REPLACE INTO topic_opinions (topic_id, opinion_id, relevance_score)
    VALUES (?, ?, ?)
  `);

  for (const opinion of opinions) {
    linkStmt.run(id, opinion.id, 1.0);
  }

  return db.prepare('SELECT * FROM topics WHERE id = ?').get(id) as Topic;
}

// Find common theme from titles
function findCommonTheme(titles: string[]): string {
  const wordCounts: Map<string, number> = new Map();
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can']);

  for (const title of titles) {
    const words = title.toLowerCase().split(/\s+/).filter(w =>
      w.length > 3 && !stopWords.has(w) && !/^\d+$/.test(w)
    );

    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  // Get top keywords
  const sorted = [...wordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

  return sorted.length > 0 ? sorted.join(', ') : '';
}

// Get topic by ID with related opinions
export function getTopicWithOpinions(topicId: string): { topic: Topic; opinions: Opinion[] } | null {
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(topicId) as Topic | undefined;
  if (!topic) return null;

  const opinions = db.prepare(`
    SELECT o.* FROM opinions o
    JOIN topic_opinions to_link ON o.id = to_link.opinion_id
    WHERE to_link.topic_id = ?
    ORDER BY to_link.relevance_score DESC
  `).all(topicId) as Opinion[];

  return { topic, opinions };
}

// Get topic with opinions including source names (optimized - no N+1)
export function getTopicWithOpinionsAndSources(topicId: string): {
  topic: Topic;
  opinions: (Opinion & { sourceName: string })[]
} | null {
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(topicId) as Topic | undefined;
  if (!topic) return null;

  const opinions = db.prepare(`
    SELECT o.*, s.name as sourceName
    FROM opinions o
    JOIN topic_opinions to_link ON o.id = to_link.opinion_id
    JOIN sources s ON o.source_id = s.id
    WHERE to_link.topic_id = ?
    ORDER BY to_link.relevance_score DESC
  `).all(topicId) as (Opinion & { sourceName: string })[];

  return { topic, opinions };
}

// Get all topics
export function getAllTopics(): Topic[] {
  return db.prepare('SELECT * FROM topics ORDER BY updated_at DESC').all() as Topic[];
}

// Get all topics with counts (optimized - no N+1)
export function getAllTopicsWithCounts(): (Topic & { opinionsCount: number; analysesCount: number })[] {
  const topics = getAllTopics();

  // Get all opinion counts in one query
  const opinionCounts = db.prepare(`
    SELECT topic_id, COUNT(*) as count
    FROM topic_opinions
    GROUP BY topic_id
  `).all() as { topic_id: string; count: number }[];

  // Get all analysis counts in one query
  const analysisCounts = db.prepare(`
    SELECT topic_id, COUNT(*) as count
    FROM agent_analyses
    GROUP BY topic_id
  `).all() as { topic_id: string; count: number }[];

  // Create lookup maps
  const opinionCountMap = new Map(opinionCounts.map(c => [c.topic_id, c.count]));
  const analysisCountMap = new Map(analysisCounts.map(c => [c.topic_id, c.count]));

  // Merge data
  return topics.map(topic => ({
    ...topic,
    opinionsCount: opinionCountMap.get(topic.id) || 0,
    analysesCount: analysisCountMap.get(topic.id) || 0,
  }));
}

// Get featured topics
export function getFeaturedTopics(): Topic[] {
  return db.prepare('SELECT * FROM topics WHERE is_featured = 1 ORDER BY updated_at DESC').all() as Topic[];
}

// Get topics by category
export function getTopicsByCategory(category: string): Topic[] {
  return db.prepare('SELECT * FROM topics WHERE category = ? ORDER BY updated_at DESC').all(category) as Topic[];
}

// Get topics by category with counts (optimized - no N+1)
export function getTopicsByCategoryWithCounts(category: string): (Topic & { opinionsCount: number; analysesCount: number })[] {
  const topics = getTopicsByCategory(category);

  if (topics.length === 0) {
    return [];
  }

  const topicIds = topics.map(t => t.id);
  const placeholders = topicIds.map(() => '?').join(',');

  // Get opinion counts for these topics
  const opinionCounts = db.prepare(`
    SELECT topic_id, COUNT(*) as count
    FROM topic_opinions
    WHERE topic_id IN (${placeholders})
    GROUP BY topic_id
  `).all(...topicIds) as { topic_id: string; count: number }[];

  // Get analysis counts for these topics
  const analysisCounts = db.prepare(`
    SELECT topic_id, COUNT(*) as count
    FROM agent_analyses
    WHERE topic_id IN (${placeholders})
    GROUP BY topic_id
  `).all(...topicIds) as { topic_id: string; count: number }[];

  // Create lookup maps
  const opinionCountMap = new Map(opinionCounts.map(c => [c.topic_id, c.count]));
  const analysisCountMap = new Map(analysisCounts.map(c => [c.topic_id, c.count]));

  // Merge data
  return topics.map(topic => ({
    ...topic,
    opinionsCount: opinionCountMap.get(topic.id) || 0,
    analysesCount: analysisCountMap.get(topic.id) || 0,
  }));
}

// Select agents for a topic based on relevance
export function selectAgentsForTopic(topic: Topic): Agent[] {
  const agents = getAllAgents();

  // For now, return all agents. In production, could select based on topic category
  // or use AI to determine which perspectives are most relevant
  return agents;
}

// Orchestrate full analysis pipeline for a topic
export interface AnalysisPipelineResult {
  topic: Topic;
  opinions: Opinion[];
  agentPrompts: { agent: Agent; prompt: string }[];
  summaryPrompt: string;
}

export function prepareAnalysisPipeline(topicId: string): AnalysisPipelineResult | null {
  const topicData = getTopicWithOpinions(topicId);
  if (!topicData) return null;

  const { topic, opinions } = topicData;
  const agents = selectAgentsForTopic(topic);

  const agentPrompts = agents.map(agent => ({
    agent,
    prompt: generateAnalysisPrompt(agent, topic, opinions)
  }));

  const summaryPrompt = generateSummaryPrompt(topic, opinions);

  return {
    topic,
    opinions,
    agentPrompts,
    summaryPrompt
  };
}

// Process all recent opinions and create topics
export function processNewOpinions(): Topic[] {
  const opinions = getRecentOpinions(50);
  return identifyTopics(opinions);
}

// Get opinions for a topic
export function getTopicOpinions(topicId: string): Opinion[] {
  return db.prepare(`
    SELECT o.* FROM opinions o
    JOIN topic_opinions to_link ON o.id = to_link.opinion_id
    WHERE to_link.topic_id = ?
    ORDER BY o.published_at DESC
  `).all(topicId) as Opinion[];
}

// Update topic
export function updateTopic(topicId: string, updates: Partial<Topic>): Topic | null {
  const existing = db.prepare('SELECT * FROM topics WHERE id = ?').get(topicId) as Topic | undefined;
  if (!existing) return null;

  const newTitle = updates.title || existing.title;
  const newSummary = updates.summary || existing.summary;
  const newCategory = updates.category || existing.category;
  const newIsFeatured = updates.is_featured !== undefined ? updates.is_featured : existing.is_featured;

  db.prepare(`
    UPDATE topics
    SET title = ?, summary = ?, category = ?, is_featured = ?, updated_at = ?
    WHERE id = ?
  `).run(newTitle, newSummary, newCategory, newIsFeatured, new Date().toISOString(), topicId);

  return db.prepare('SELECT * FROM topics WHERE id = ?').get(topicId) as Topic;
}

// Delete topic
export function deleteTopic(topicId: string): boolean {
  db.prepare('DELETE FROM topic_opinions WHERE topic_id = ?').run(topicId);
  db.prepare('DELETE FROM agent_analyses WHERE topic_id = ?').run(topicId);
  db.prepare('DELETE FROM summaries WHERE topic_id = ?').run(topicId);
  const result = db.prepare('DELETE FROM topics WHERE id = ?').run(topicId);
  return result.changes > 0;
}
