import { NextRequest, NextResponse } from 'next/server';
import { prepareAnalysisPipeline } from '@/lib/orchestrator';
import { storeAnalysis, storeSummary, getAllAgents } from '@/lib/agents';

// This endpoint prepares analysis prompts for AI agents
// In production, these would be sent to an LLM API (e.g., Anthropic Claude)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const topicId = searchParams.get('topicId');

  if (!topicId) {
    return NextResponse.json(
      { success: false, error: 'topicId is required' },
      { status: 400 }
    );
  }

  try {
    const pipeline = prepareAnalysisPipeline(topicId);

    if (!pipeline) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    // In a production system, you would:
    // 1. Send each agentPrompt to an LLM API
    // 2. Parse the responses
    // 3. Store the analyses

    // For demo purposes, we'll generate placeholder analyses
    const agents = getAllAgents();

    // Generate demo analyses for each agent
    for (const agent of agents) {
      const demoAnalysis = generateDemoAnalysis(agent.name, agent.bias, pipeline.topic.title);
      const demoStance = getDemoStance(agent.bias);
      const demoKeyPoints = getDemoKeyPoints(agent.bias);

      storeAnalysis(
        topicId,
        agent.id,
        demoAnalysis,
        demoStance,
        demoKeyPoints
      );
    }

    // Generate demo summary
    storeSummary(
      topicId,
      [
        "Point in favor of one perspective on this topic",
        "Another supporting argument from proponents",
        "Evidence cited by those who support this view",
        "Potential benefits highlighted by advocates",
      ],
      [
        "Point against or expressing concerns about this topic",
        "Counterargument from skeptics or opponents",
        "Risks or downsides identified by critics",
        "Alternative approaches suggested by detractors",
      ],
      `This topic has generated significant debate across the political spectrum, with valid points on multiple sides.`
    );

    return NextResponse.json({
      success: true,
      message: 'Analysis generated successfully',
      data: {
        topic: pipeline.topic,
        analysesCount: agents.length,
        agentPrompts: pipeline.agentPrompts.map(ap => ({
          agent: ap.agent.name,
          promptLength: ap.prompt.length,
        })),
      },
      redirect: `/topic/${topicId}`,
    });
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate analysis' },
      { status: 500 }
    );
  }
}

// Demo analysis generator
function generateDemoAnalysis(agentName: string, bias: string, topicTitle: string): string {
  const templates: Record<string, string> = {
    conservative: `As ${agentName}, I approach "${topicTitle}" with respect for tradition and free market principles. While acknowledging legitimate concerns, I believe excessive intervention would create more problems than it solves. Historical precedent shows that organic solutions emerging from civil society and market forces tend to be more effective and sustainable than top-down mandates. We should be cautious about unintended consequences and trust in the wisdom of established institutions while remaining open to gradual, evidence-based reforms.`,
    progressive: `Analyzing "${topicTitle}" as ${agentName}, I see both urgent challenges and opportunities for positive change. The status quo is not serving everyone equally, and targeted interventions are needed to address systemic issues. Data shows that proactive policies can create more equitable outcomes while also driving innovation. We must center the voices of those most affected and build coalitions for transformative change. Incremental approaches have proven insufficient—bold action is required.`,
    libertarian: `On "${topicTitle}", my perspective as ${agentName} is that both conventional sides miss the fundamental issue: concentrations of power, whether governmental or corporate. The solution lies not in choosing between regulation and deregulation, but in decentralizing power and expanding individual choice. Market mechanisms, properly functioning, can address externalities while preserving freedom. Voluntary cooperation and innovation solve problems more efficiently than coercion from any direction.`,
    centrist: `Examining "${topicTitle}" as ${agentName}, I find merit in arguments across the spectrum while noting overstatements on all sides. The evidence suggests a nuanced approach that combines targeted interventions with respect for market dynamics. Compromise is not weakness—it's how democracies function. We need to lower the temperature of this debate, acknowledge uncertainty, and pursue adaptive policies that can be adjusted based on evidence. Both ideological rigidity and false equivalence should be avoided.`,
    'techno-optimist': `From my vantage as ${agentName}, "${topicTitle}" is ultimately a challenge that human ingenuity will solve. While policy debates continue, exponential technological progress is already creating new possibilities. We should focus on accelerating beneficial innovation rather than fighting over how to divide a fixed pie. The future will be shaped by those who build, not just those who regulate. Optimism grounded in technological trends suggests the best days are ahead.`,
    skeptical: `Analyzing "${topicTitle}" as ${agentName}, I'm struck by the confident assertions on all sides despite fundamental uncertainties. Proponents and opponents alike make predictions based on limited data and questionable models. We should be honest about what we don't know and resist the temptation of false certainty. Epistemic humility, empirical testing, and willingness to update beliefs based on evidence should guide our approach. Beware of anyone who claims to have all the answers.`,
  };

  return templates[bias] || templates.centrist;
}

function getDemoStance(bias: string): string {
  const stances: Record<string, string> = {
    conservative: "Cautiously skeptical",
    progressive: "Supportive with conditions",
    libertarian: "Alternative approach needed",
    centrist: "Balanced perspective",
    'techno-optimist': "Optimistic about solutions",
    skeptical: "Uncertain, needs more evidence",
  };
  return stances[bias] || "Nuanced view";
}

function getDemoKeyPoints(bias: string): string[] {
  const points: Record<string, string[]> = {
    conservative: [
      "Free market solutions often more effective",
      "Beware unintended consequences",
      "Respect for established institutions",
      "Gradual reform over radical change",
    ],
    progressive: [
      "Systemic issues require systemic solutions",
      "Center marginalized voices",
      "Data supports proactive intervention",
      "Incremental approaches insufficient",
    ],
    libertarian: [
      "Decentralization over central control",
      "Individual choice is paramount",
      "Both government and corporate power concerning",
      "Voluntary cooperation preferred",
    ],
    centrist: [
      "Valid points on multiple sides",
      "Evidence-based policy needed",
      "Compromise enables progress",
      "Avoid ideological rigidity",
    ],
    'techno-optimist': [
      "Technology will create solutions",
      "Focus on innovation, not just regulation",
      "Exponential progress changes equations",
      "Optimism grounded in trends",
    ],
    skeptical: [
      "Uncertainty on all sides",
      "Confident predictions often wrong",
      "Epistemic humility needed",
      "Update beliefs based on evidence",
    ],
  };
  return points[bias] || points.centrist;
}
