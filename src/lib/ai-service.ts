import Anthropic from '@anthropic-ai/sdk';
import { Agent, Topic, Opinion } from './database';
import {
  generateAnalysisPrompt,
  generateSummaryPrompt,
  storeAnalysis,
  storeSummary,
  getAllAgents,
} from './agents';
import { getTopicWithOpinions } from './orchestrator';

// Initialize Anthropic client - requires ANTHROPIC_API_KEY env var
const anthropic = new Anthropic();

export interface AnalysisResult {
  agent: Agent;
  analysis: string;
  stance: string;
  keyPoints: string[];
}

export interface SummaryResult {
  proPoints: string[];
  conPoints: string[];
  neutralContext: string;
}

// Generate analysis from a single agent using Claude
export async function generateAgentAnalysis(
  agent: Agent,
  topic: Topic,
  opinions: Opinion[]
): Promise<AnalysisResult> {
  const prompt = generateAnalysisPrompt(agent, topic, opinions);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt + '\n\nAt the end of your analysis, add a line "STANCE:" followed by a 2-4 word summary of your position, and "KEY_POINTS:" followed by a JSON array of 3-5 key points.',
      },
    ],
  });

  const fullText = response.content[0].type === 'text' ? response.content[0].text : '';

  // Parse stance and key points from response
  const stanceMatch = fullText.match(/STANCE:\s*(.+?)(?:\n|KEY_POINTS:|$)/i);
  const keyPointsMatch = fullText.match(/KEY_POINTS:\s*(\[[\s\S]*?\])/i);

  const stance = stanceMatch ? stanceMatch[1].trim() : 'Analysis provided';
  let keyPoints: string[] = [];

  if (keyPointsMatch) {
    try {
      keyPoints = JSON.parse(keyPointsMatch[1]);
    } catch {
      keyPoints = [];
    }
  }

  // Remove the STANCE and KEY_POINTS lines from the main analysis
  const analysis = fullText
    .replace(/STANCE:\s*.+?(?:\n|$)/i, '')
    .replace(/KEY_POINTS:\s*\[[\s\S]*?\]/i, '')
    .trim();

  return { agent, analysis, stance, keyPoints };
}

// Generate pro/con summary using Claude
export async function generateTopicSummary(
  topic: Topic,
  opinions: Opinion[]
): Promise<SummaryResult> {
  const prompt = generateSummaryPrompt(topic, opinions);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      proPoints: ['Unable to parse pro points'],
      conPoints: ['Unable to parse con points'],
      neutralContext: 'Summary generation encountered an issue.',
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      proPoints: parsed.pro_points || [],
      conPoints: parsed.con_points || [],
      neutralContext: parsed.neutral_context || '',
    };
  } catch {
    return {
      proPoints: ['Unable to parse pro points'],
      conPoints: ['Unable to parse con points'],
      neutralContext: 'Summary generation encountered an issue.',
    };
  }
}

// Run full analysis pipeline for a topic with real LLM calls
export async function runAnalysisPipeline(topicId: string): Promise<{
  analyses: AnalysisResult[];
  summary: SummaryResult;
}> {
  const topicData = getTopicWithOpinions(topicId);
  if (!topicData) {
    throw new Error(`Topic ${topicId} not found`);
  }

  const { topic, opinions } = topicData;
  const agents = getAllAgents();

  // Generate analyses from all agents in parallel
  const analysisPromises = agents.map(agent =>
    generateAgentAnalysis(agent, topic, opinions)
  );

  const analyses = await Promise.all(analysisPromises);

  // Store analyses in database
  for (const result of analyses) {
    storeAnalysis(
      topicId,
      result.agent.id,
      result.analysis,
      result.stance,
      result.keyPoints
    );
  }

  // Generate and store summary
  const summary = await generateTopicSummary(topic, opinions);
  storeSummary(topicId, summary.proPoints, summary.conPoints, summary.neutralContext);

  return { analyses, summary };
}

// Check if API key is configured
export function isAIConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
