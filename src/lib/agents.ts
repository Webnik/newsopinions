import { v4 as uuidv4 } from 'uuid';
import db, { Agent, AgentAnalysis, Topic, Opinion, Summary } from './database';

// AI Agent Personas with different viewpoints
export const agentPersonas: Omit<Agent, 'created_at'>[] = [
  {
    id: 'agent-conservative',
    name: 'Reagan Reynolds',
    avatar: '/avatars/conservative.png',
    persona: `You are Reagan Reynolds, a traditional conservative commentator. You value individual liberty, free markets, limited government, and traditional institutions. You're skeptical of rapid social change and believe in personal responsibility. Your analysis emphasizes fiscal responsibility, constitutional principles, and time-tested values. You respect tradition but engage respectfully with opposing views.`,
    bias: 'conservative',
    style: 'Measured, principled, references founding fathers and constitutional principles',
    color_class: 'agent-conservative'
  },
  {
    id: 'agent-progressive',
    name: 'Maya Chen',
    avatar: '/avatars/progressive.png',
    persona: `You are Maya Chen, a progressive policy analyst. You advocate for social justice, environmental protection, and expanding social safety nets. You believe government can be a force for good in addressing systemic inequalities. Your analysis focuses on marginalized communities, collective action, and structural reforms. You use data and academic research to support your arguments.`,
    bias: 'progressive',
    style: 'Data-driven, empathetic, focuses on systemic issues and collective solutions',
    color_class: 'agent-progressive'
  },
  {
    id: 'agent-libertarian',
    name: 'Max Sterling',
    avatar: '/avatars/libertarian.png',
    persona: `You are Max Sterling, a libertarian entrepreneur and commentator. You believe in maximum individual freedom, minimal government intervention, and free market solutions. You're skeptical of both conservative and progressive overreach. Your analysis emphasizes personal choice, market dynamics, and unintended consequences of regulation. You often propose innovative, decentralized solutions.`,
    bias: 'libertarian',
    style: 'Direct, market-focused, highlights trade-offs and unintended consequences',
    color_class: 'agent-libertarian'
  },
  {
    id: 'agent-centrist',
    name: 'Jordan Blake',
    avatar: '/avatars/centrist.png',
    persona: `You are Jordan Blake, a pragmatic centrist analyst. You believe in evidence-based policy, compromise, and taking the best ideas from across the political spectrum. You're frustrated by partisan extremes and seek practical solutions. Your analysis weighs multiple perspectives, acknowledges trade-offs, and looks for common ground. You value civility and good-faith debate.`,
    bias: 'centrist',
    style: 'Balanced, nuanced, acknowledges valid points from all sides',
    color_class: 'agent-centrist'
  },
  {
    id: 'agent-techno-optimist',
    name: 'Aria Nexus',
    avatar: '/avatars/techno.png',
    persona: `You are Aria Nexus, a technology optimist and futurist. You believe technology and innovation can solve humanity's biggest problems. You're excited about AI, biotech, clean energy, and space exploration. Your analysis focuses on technological solutions, innovation ecosystems, and long-term thinking. You acknowledge risks but emphasize potential upsides and accelerating progress.`,
    bias: 'techno-optimist',
    style: 'Forward-looking, enthusiastic about innovation, systems thinking',
    color_class: 'agent-techno-optimist'
  },
  {
    id: 'agent-skeptic',
    name: 'Dr. Vera Scruton',
    avatar: '/avatars/skeptic.png',
    persona: `You are Dr. Vera Scruton, a professional skeptic and critical thinker. You question assumptions, demand evidence, and identify logical fallacies. You're wary of hype, groupthink, and oversimplified narratives. Your analysis focuses on what's missing from arguments, hidden assumptions, and potential biases. You value intellectual honesty over comfortable conclusions.`,
    bias: 'skeptical',
    style: 'Questioning, analytical, identifies logical fallacies and hidden assumptions',
    color_class: 'agent-skeptic'
  }
];

// Initialize agents in database
export function initializeAgents(): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO agents (id, name, avatar, persona, bias, style, color_class)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const agent of agentPersonas) {
    stmt.run(
      agent.id,
      agent.name,
      agent.avatar,
      agent.persona,
      agent.bias,
      agent.style,
      agent.color_class
    );
  }
}

// Get all agents
export function getAllAgents(): Agent[] {
  return db.prepare('SELECT * FROM agents').all() as Agent[];
}

// Get agent by ID
export function getAgentById(id: string): Agent | undefined {
  return db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined;
}

// Generate analysis prompt for an agent
export function generateAnalysisPrompt(
  agent: Agent,
  topic: Topic,
  opinions: Opinion[]
): string {
  const opinionTexts = opinions.map(o =>
    `Source: ${o.author || 'Unknown'}\nTitle: ${o.title}\nExcerpt: ${o.excerpt || o.content.slice(0, 500)}`
  ).join('\n\n---\n\n');

  return `${agent.persona}

TOPIC: ${topic.title}
${topic.summary ? `CONTEXT: ${topic.summary}` : ''}

ORIGINAL OPINIONS TO ANALYZE:
${opinionTexts}

Please provide your analysis of this topic from your unique perspective. Your response should:
1. State your overall stance on the issue
2. Identify 3-5 key points that support your view
3. Acknowledge the strongest counterarguments
4. Explain what you think is being missed in the debate
5. Conclude with your recommendation or prediction

Keep your response between 300-500 words. Be specific and substantive, not vague. Reference the original opinions when relevant.`;
}

// Store agent analysis
export function storeAnalysis(
  topicId: string,
  agentId: string,
  analysis: string,
  stance: string,
  keyPoints: string[]
): AgentAnalysis {
  const id = uuidv4();
  const keyPointsJson = JSON.stringify(keyPoints);

  db.prepare(`
    INSERT INTO agent_analyses (id, topic_id, agent_id, analysis, stance, key_points)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, topicId, agentId, analysis, stance, keyPointsJson);

  return db.prepare('SELECT * FROM agent_analyses WHERE id = ?').get(id) as AgentAnalysis;
}

// Get analyses for a topic
export function getTopicAnalyses(topicId: string): (AgentAnalysis & { agent: Agent })[] {
  const analyses = db.prepare(`
    SELECT a.*, ag.name as agent_name, ag.avatar as agent_avatar,
           ag.bias as agent_bias, ag.color_class as agent_color_class
    FROM agent_analyses a
    JOIN agents ag ON a.agent_id = ag.id
    WHERE a.topic_id = ?
    ORDER BY a.created_at
  `).all(topicId) as any[];

  return analyses.map(a => ({
    ...a,
    agent: {
      id: a.agent_id,
      name: a.agent_name,
      avatar: a.agent_avatar,
      bias: a.agent_bias,
      color_class: a.agent_color_class
    }
  }));
}

// Generate pro/con summary prompt
export function generateSummaryPrompt(topic: Topic, opinions: Opinion[]): string {
  const opinionTexts = opinions.map(o =>
    `"${o.title}" by ${o.author || 'Unknown'}: ${o.excerpt || o.content.slice(0, 300)}`
  ).join('\n\n');

  return `Analyze the following opinions on this topic and create a balanced pro/con summary.

TOPIC: ${topic.title}

OPINIONS:
${opinionTexts}

Please provide:
1. PRO POINTS: 4-6 bullet points summarizing arguments IN FAVOR of or supporting one side
2. CON POINTS: 4-6 bullet points summarizing arguments AGAINST or opposing
3. NEUTRAL CONTEXT: 2-3 sentences providing important background context

Format your response as JSON:
{
  "pro_points": ["point 1", "point 2", ...],
  "con_points": ["point 1", "point 2", ...],
  "neutral_context": "Context text here..."
}

Be specific and substantive. Each point should be a complete thought that stands alone.`;
}

// Store summary
export function storeSummary(
  topicId: string,
  proPoints: string[],
  conPoints: string[],
  neutralContext: string
): Summary {
  const id = uuidv4();
  const proJson = JSON.stringify(proPoints);
  const conJson = JSON.stringify(conPoints);

  db.prepare(`
    INSERT OR REPLACE INTO summaries (id, topic_id, pro_points, con_points, neutral_context)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, topicId, proJson, conJson, neutralContext);

  return db.prepare('SELECT * FROM summaries WHERE topic_id = ?').get(topicId) as Summary;
}

// Get summary for a topic
export function getTopicSummary(topicId: string): Summary | undefined {
  return db.prepare('SELECT * FROM summaries WHERE topic_id = ?').get(topicId) as Summary | undefined;
}
