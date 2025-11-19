import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'newsopinions.db');
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  -- Sources table for opinion sources
  CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    feed_url TEXT,
    bias TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Raw opinions crawled from sources
  CREATE TABLE IF NOT EXISTS opinions (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    title TEXT NOT NULL,
    author TEXT,
    url TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    published_at DATETIME,
    crawled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    category TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(id)
  );

  -- Topics identified by the orchestrator
  CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_featured INTEGER DEFAULT 0
  );

  -- Link opinions to topics
  CREATE TABLE IF NOT EXISTS topic_opinions (
    topic_id TEXT NOT NULL,
    opinion_id TEXT NOT NULL,
    relevance_score REAL,
    PRIMARY KEY (topic_id, opinion_id),
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (opinion_id) REFERENCES opinions(id)
  );

  -- AI Agent personas
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    persona TEXT NOT NULL,
    bias TEXT NOT NULL,
    style TEXT NOT NULL,
    color_class TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Agent analyses of topics
  CREATE TABLE IF NOT EXISTS agent_analyses (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    analysis TEXT NOT NULL,
    stance TEXT,
    key_points TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );

  -- Pro/Con summaries for topics
  CREATE TABLE IF NOT EXISTS summaries (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL UNIQUE,
    pro_points TEXT NOT NULL,
    con_points TEXT NOT NULL,
    neutral_context TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_opinions_source ON opinions(source_id);
  CREATE INDEX IF NOT EXISTS idx_opinions_category ON opinions(category);
  CREATE INDEX IF NOT EXISTS idx_topics_featured ON topics(is_featured);
  CREATE INDEX IF NOT EXISTS idx_agent_analyses_topic ON agent_analyses(topic_id);
`);

export default db;

// Type definitions
export interface Source {
  id: string;
  name: string;
  url: string;
  feed_url?: string;
  bias?: string;
  category?: string;
  created_at: string;
}

export interface Opinion {
  id: string;
  source_id: string;
  title: string;
  author?: string;
  url: string;
  content: string;
  excerpt?: string;
  published_at?: string;
  crawled_at: string;
  category?: string;
}

export interface Topic {
  id: string;
  title: string;
  summary?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  is_featured: number;
}

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  persona: string;
  bias: string;
  style: string;
  color_class?: string;
  created_at: string;
}

export interface AgentAnalysis {
  id: string;
  topic_id: string;
  agent_id: string;
  analysis: string;
  stance?: string;
  key_points?: string;
  created_at: string;
}

export interface Summary {
  id: string;
  topic_id: string;
  pro_points: string;
  con_points: string;
  neutral_context?: string;
  created_at: string;
}
