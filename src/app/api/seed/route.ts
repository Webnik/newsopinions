import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/database';
import { initializeSystem } from '@/lib/orchestrator';
import { initializeAgents, storeSummary, storeAnalysis } from '@/lib/agents';
import { initializeSources } from '@/lib/crawler';

// Sample opinions for demonstration
const sampleOpinions = [
  // AI Policy topic
  {
    title: "AI Regulation Must Come Now Before It's Too Late",
    author: "Dr. Sarah Chen",
    content: "The rapid advancement of artificial intelligence poses unprecedented risks to society. Without immediate regulatory intervention, we risk creating systems that could destabilize economies, spread misinformation at scale, and concentrate power in the hands of a few tech giants. The EU's AI Act provides a template that other nations should follow.",
    category: "tech",
    source: "tech-progressive",
  },
  {
    title: "Let Innovation Flourish: Against Premature AI Regulation",
    author: "Michael Torres",
    content: "Calls for heavy-handed AI regulation threaten to stifle one of the most transformative technologies in human history. The same arguments were made about the internet, and excessive regulation would have prevented countless innovations. Market forces and industry self-regulation can address concerns while allowing innovation to flourish.",
    category: "tech",
    source: "tech-libertarian",
  },
  {
    title: "A Balanced Approach to AI Governance",
    author: "Prof. James Wright",
    content: "Neither extreme regulation nor laissez-faire approaches serve the public interest. We need targeted interventions for high-risk applications like healthcare and criminal justice, while allowing experimentation in lower-risk domains. International coordination is essential to prevent regulatory arbitrage.",
    category: "tech",
    source: "tech-centrist",
  },
  // Climate policy topic
  {
    title: "Green New Deal: Our Last Best Hope",
    author: "Rep. Alexandria Torres",
    content: "The climate crisis demands immediate, transformative action. Incremental approaches have failed for decades. A Green New Deal that combines environmental protection with economic justice is not just good policy—it's essential for survival. The costs of inaction far exceed the investments required.",
    category: "politics",
    source: "climate-progressive",
  },
  {
    title: "Market Solutions for Climate Change",
    author: "Dr. Robert Hansen",
    content: "Government mandates and regulations are not the answer to climate change. Carbon pricing and tax incentives can harness market forces to drive innovation and reduce emissions more efficiently than top-down regulations. The private sector is already developing solutions that government programs cannot match.",
    category: "politics",
    source: "climate-conservative",
  },
  {
    title: "Technology Will Solve Climate Change",
    author: "Erica Nexus",
    content: "While policy debates rage on, technological innovation is the real solution to climate change. Solar, wind, and battery technologies are improving exponentially. Nuclear fusion is on the horizon. Direct air capture is scaling. The future will be powered by innovation, not legislation.",
    category: "politics",
    source: "climate-techno",
  },
  // Economic inequality topic
  {
    title: "Time for a Wealth Tax",
    author: "Sen. Elizabeth Warren",
    content: "Extreme wealth concentration threatens democracy itself. A modest wealth tax on the ultra-rich—just 2 cents on every dollar above $50 million—would raise trillions for investments in education, healthcare, and infrastructure while reducing dangerous inequality.",
    category: "business",
    source: "econ-progressive",
  },
  {
    title: "Wealth Taxes Don't Work",
    author: "Prof. Gregory Mankiw",
    content: "European countries that tried wealth taxes mostly abandoned them because they drove capital flight, were difficult to administer, and raised less revenue than expected. Instead of punishing success, we should focus on expanding opportunity through education and removing barriers to entrepreneurship.",
    category: "business",
    source: "econ-conservative",
  },
];

// Create topics from opinions
const sampleTopics = [
  {
    id: uuidv4(),
    title: "The AI Regulation Debate",
    summary: "Should governments regulate artificial intelligence now, or let innovation proceed with minimal intervention?",
    category: "tech",
    is_featured: 1,
    opinions: [0, 1, 2], // indexes into sampleOpinions
  },
  {
    id: uuidv4(),
    title: "Climate Policy Approaches",
    summary: "What's the best approach to addressing climate change: aggressive government action, market solutions, or technological innovation?",
    category: "politics",
    is_featured: 1,
    opinions: [3, 4, 5],
  },
  {
    id: uuidv4(),
    title: "Wealth Inequality and Tax Policy",
    summary: "Should the ultra-wealthy face higher taxes to reduce inequality, or do such policies backfire?",
    category: "business",
    is_featured: 0,
    opinions: [6, 7],
  },
];

// Sample agent analyses
const sampleAnalyses = [
  {
    agent_id: 'agent-conservative',
    analysis: "While I understand concerns about AI risks, heavy-handed regulation at this early stage would be a grave mistake. History shows that premature regulation stifles innovation and hands advantages to less scrupulous competitors abroad. Instead, we should trust market forces and industry self-governance to address concerns. The EU's approach is characteristically bureaucratic and will leave European companies struggling to compete with American and Chinese innovators. Let's not repeat the mistakes of over-regulation that have hampered other industries.",
    stance: "Against heavy regulation",
    key_points: ["Market self-regulation is more effective", "Premature regulation stifles innovation", "International competitiveness at risk", "Trust industry to address concerns"],
  },
  {
    agent_id: 'agent-progressive',
    analysis: "The evidence is clear: without regulatory guardrails, AI systems are already causing harm through biased algorithms, privacy violations, and labor displacement. We cannot wait for the market to self-correct—that approach has failed repeatedly. The EU's AI Act is a good start, but we need stronger protections, especially for vulnerable communities who bear the brunt of algorithmic harms. Corporate profits should not come before human welfare and democratic values.",
    stance: "For strong regulation",
    key_points: ["AI systems already causing harm", "Market self-correction has failed", "Vulnerable communities need protection", "Democratic values at stake"],
  },
  {
    agent_id: 'agent-libertarian',
    analysis: "Both sides miss the point. Heavy regulation will create compliance moats that benefit big tech incumbents while crushing startups. But unregulated AI development by massive corporations is equally concerning—it concentrates power without accountability. The solution is decentralization: open-source models, user data ownership, and competitive markets. Let individuals choose their own AI systems rather than having governments or corporations decide for them.",
    stance: "For decentralized approach",
    key_points: ["Regulation benefits incumbents", "Power concentration is the real risk", "Decentralization is the answer", "Individual choice over central control"],
  },
  {
    agent_id: 'agent-centrist',
    analysis: "This debate is too polarized. We need targeted, risk-based regulation—not blanket rules. High-stakes applications like healthcare diagnosis and criminal sentencing deserve scrutiny, while lower-risk uses can proceed with lighter oversight. International coordination is essential to avoid a race to the bottom. Both innovation and safety matter; finding the balance requires ongoing dialogue between technologists, policymakers, and civil society.",
    stance: "For balanced approach",
    key_points: ["Risk-based regulation needed", "Not all AI applications equal", "International coordination essential", "Ongoing dialogue required"],
  },
  {
    agent_id: 'agent-techno-optimist',
    analysis: "AI is the most transformative technology since the printing press. Yes, there are risks, but the potential benefits—curing diseases, solving climate change, expanding human knowledge—are immense. Over-regulation would slow this progress catastrophically. Let's focus on accelerating beneficial AI development while addressing specific harms as they emerge. The future belongs to those who embrace progress, not those who fear it.",
    stance: "For innovation-first approach",
    key_points: ["Transformative potential is immense", "Regulation slows critical progress", "Address specific harms, not general risks", "Embrace progress over fear"],
  },
  {
    agent_id: 'agent-skeptic',
    analysis: "Both pro- and anti-regulation arguments rest on shaky foundations. Proponents of regulation assume we can predict AI risks accurately enough to regulate them—dubious given the technology's novelty. Anti-regulation advocates assume market incentives align with public good—historically questionable. We're all speculating about a technology we barely understand. Epistemic humility and adaptive governance that can evolve with the technology seem wiser than confident prescriptions in either direction.",
    stance: "Skeptical of all confident claims",
    key_points: ["Risk predictions are unreliable", "Market alignment with public good questionable", "Epistemic humility needed", "Adaptive governance over fixed rules"],
  },
];

// Sample pro/con summaries
const sampleSummaries = [
  {
    pro_points: [
      "Prevents potential catastrophic harms before they occur",
      "Protects vulnerable populations from algorithmic discrimination",
      "Ensures democratic oversight of powerful technologies",
      "Creates clear rules that responsible companies can follow",
      "Builds public trust necessary for AI adoption",
    ],
    con_points: [
      "Stifles innovation and economic growth",
      "Benefits large incumbents over startups",
      "May push development to less regulated jurisdictions",
      "Difficult to regulate rapidly evolving technology",
      "Could prevent beneficial AI applications from reaching market",
    ],
    neutral_context: "AI regulation debates intensified in 2023-2024 as large language models demonstrated both impressive capabilities and concerning risks. The EU passed the AI Act, while the US pursued voluntary commitments from major companies. China implemented its own regulations focused on different priorities.",
  },
];

export async function GET() {
  try {
    // Initialize system
    initializeSystem();

    // Create sample sources
    const sources = [
      { id: 'tech-progressive', name: 'Tech Policy Institute', bias: 'progressive', category: 'tech' },
      { id: 'tech-libertarian', name: 'Innovation Freedom Foundation', bias: 'libertarian', category: 'tech' },
      { id: 'tech-centrist', name: 'Balanced Tech Review', bias: 'centrist', category: 'tech' },
      { id: 'climate-progressive', name: 'Climate Action Now', bias: 'progressive', category: 'politics' },
      { id: 'climate-conservative', name: 'Free Market Environment', bias: 'conservative', category: 'politics' },
      { id: 'climate-techno', name: 'TechnoClimate', bias: 'techno-optimist', category: 'tech' },
      { id: 'econ-progressive', name: 'Economic Justice Review', bias: 'progressive', category: 'business' },
      { id: 'econ-conservative', name: 'Free Enterprise Institute', bias: 'conservative', category: 'business' },
    ];

    const sourceStmt = db.prepare(`
      INSERT OR REPLACE INTO sources (id, name, url, bias, category)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const source of sources) {
      sourceStmt.run(source.id, source.name, `https://example.com/${source.id}`, source.bias, source.category);
    }

    // Create opinions
    const opinionIds: string[] = [];
    const opinionStmt = db.prepare(`
      INSERT OR REPLACE INTO opinions (id, source_id, title, author, url, content, excerpt, category, crawled_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const opinion of sampleOpinions) {
      const id = uuidv4();
      opinionIds.push(id);
      opinionStmt.run(
        id,
        opinion.source,
        opinion.title,
        opinion.author,
        `https://example.com/opinions/${id}`,
        opinion.content,
        opinion.content.slice(0, 200),
        opinion.category,
        new Date().toISOString()
      );
    }

    // Create topics and link opinions
    const topicStmt = db.prepare(`
      INSERT OR REPLACE INTO topics (id, title, summary, category, is_featured, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const linkStmt = db.prepare(`
      INSERT OR REPLACE INTO topic_opinions (topic_id, opinion_id, relevance_score)
      VALUES (?, ?, ?)
    `);

    const now = new Date().toISOString();
    const topicIds: string[] = [];

    for (const topic of sampleTopics) {
      topicStmt.run(topic.id, topic.title, topic.summary, topic.category, topic.is_featured, now, now);
      topicIds.push(topic.id);

      for (const opinionIndex of topic.opinions) {
        linkStmt.run(topic.id, opinionIds[opinionIndex], 1.0);
      }
    }

    // Add analyses for first topic
    for (const analysis of sampleAnalyses) {
      storeAnalysis(
        topicIds[0],
        analysis.agent_id,
        analysis.analysis,
        analysis.stance,
        analysis.key_points
      );
    }

    // Add summary for first topic
    const summary = sampleSummaries[0];
    storeSummary(
      topicIds[0],
      summary.pro_points,
      summary.con_points,
      summary.neutral_context
    );

    return NextResponse.json({
      success: true,
      message: 'Sample data seeded successfully',
      data: {
        sources: sources.length,
        opinions: sampleOpinions.length,
        topics: sampleTopics.length,
        analyses: sampleAnalyses.length,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}
