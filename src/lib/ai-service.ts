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

  try {
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

    if (!fullText) {
      console.error(`[AI Service] Empty response for agent ${agent.id} on topic ${topic.id}`);
      return {
        agent,
        analysis: 'Failed to generate analysis due to empty AI response.',
        stance: 'Error',
        keyPoints: [],
      };
    }

    // Parse stance and key points from response
    const stanceMatch = fullText.match(/STANCE:\s*(.+?)(?:\n|KEY_POINTS:|$)/i);
    const keyPointsMatch = fullText.match(/KEY_POINTS:\s*(\[[\s\S]*?\])/i);

    const stance = stanceMatch ? stanceMatch[1].trim() : 'Analysis provided';
    let keyPoints: string[] = [];

    if (keyPointsMatch) {
      try {
        keyPoints = JSON.parse(keyPointsMatch[1]);
        if (!Array.isArray(keyPoints)) {
          console.warn(`[AI Service] KEY_POINTS is not an array for agent ${agent.id}, using empty array`);
          keyPoints = [];
        }
      } catch (error) {
        console.error(`[AI Service] Failed to parse KEY_POINTS JSON for agent ${agent.id}:`, error);
        keyPoints = [];
      }
    } else {
      console.warn(`[AI Service] No KEY_POINTS found in response for agent ${agent.id}`);
    }

    // Remove the STANCE and KEY_POINTS lines from the main analysis
    const analysis = fullText
      .replace(/STANCE:\s*.+?(?:\n|$)/i, '')
      .replace(/KEY_POINTS:\s*\[[\s\S]*?\]/i, '')
      .trim();

    return { agent, analysis, stance, keyPoints };
  } catch (error) {
    console.error(`[AI Service] Error generating analysis for agent ${agent.id} on topic ${topic.id}:`, error);
    return {
      agent,
      analysis: `Failed to generate analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
      stance: 'Error',
      keyPoints: [],
    };
  }
}

// Generate pro/con summary using Claude
export async function generateTopicSummary(
  topic: Topic,
  opinions: Opinion[]
): Promise<SummaryResult> {
  const prompt = generateSummaryPrompt(topic, opinions);

  try {
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

    if (!text) {
      console.error(`[AI Service] Empty response for summary on topic ${topic.id}`);
      return {
        proPoints: ['Failed to generate summary due to empty AI response'],
        conPoints: ['Failed to generate summary due to empty AI response'],
        neutralContext: 'Summary generation encountered an issue.',
      };
    }

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`[AI Service] No JSON found in summary response for topic ${topic.id}. Response: ${text.substring(0, 200)}`);
      return {
        proPoints: ['Unable to parse pro points from AI response'],
        conPoints: ['Unable to parse con points from AI response'],
        neutralContext: 'Summary generation encountered a parsing issue.',
      };
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.pro_points || !Array.isArray(parsed.pro_points)) {
        console.warn(`[AI Service] Missing or invalid pro_points in summary for topic ${topic.id}`);
      }
      if (!parsed.con_points || !Array.isArray(parsed.con_points)) {
        console.warn(`[AI Service] Missing or invalid con_points in summary for topic ${topic.id}`);
      }

      return {
        proPoints: Array.isArray(parsed.pro_points) ? parsed.pro_points : [],
        conPoints: Array.isArray(parsed.con_points) ? parsed.con_points : [],
        neutralContext: typeof parsed.neutral_context === 'string' ? parsed.neutral_context : '',
      };
    } catch (error) {
      console.error(`[AI Service] Failed to parse JSON in summary for topic ${topic.id}:`, error);
      console.error(`[AI Service] Raw JSON string: ${jsonMatch[0].substring(0, 500)}`);
      return {
        proPoints: ['Unable to parse pro points from AI response'],
        conPoints: ['Unable to parse con points from AI response'],
        neutralContext: 'Summary generation encountered a JSON parsing issue.',
      };
    }
  } catch (error) {
    console.error(`[AI Service] Error generating summary for topic ${topic.id}:`, error);
    return {
      proPoints: [`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`],
      conPoints: [`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`],
      neutralContext: 'Summary generation encountered an error.',
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
