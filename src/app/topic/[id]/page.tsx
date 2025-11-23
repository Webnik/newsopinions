import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import AgentAnalysis from '@/components/AgentAnalysis';
import ProConSummary from '@/components/ProConSummary';
import SourceOpinion from '@/components/SourceOpinion';
import { ensureInitialized, getTopicWithOpinionsAndSources } from '@/lib/orchestrator';
import { getTopicAnalyses, getTopicSummary } from '@/lib/agents';

interface TopicPageProps {
  params: Promise<{ id: string }>;
}

// Safe JSON parsing helper
function safeJSONParse<T>(jsonString: string | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error('[TopicPage] Failed to parse JSON:', error);
    return fallback;
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { id } = await params;

  // Ensure system is initialized
  ensureInitialized();

  // Get topic with opinions and sources (optimized - single query)
  const topicData = getTopicWithOpinionsAndSources(id);

  if (!topicData) {
    notFound();
  }

  const { topic, opinions: opinionsWithSources } = topicData;
  const analyses = getTopicAnalyses(id);
  const summary = getTopicSummary(id);

  // Parse summary points safely
  const proPoints = safeJSONParse<string[]>(summary?.pro_points, []);
  const conPoints = safeJSONParse<string[]>(summary?.con_points, []);

  const categoryBadgeClass = topic.category ? `badge-${topic.category}` : 'badge-politics';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Topic header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {topic.category && (
            <span className={`badge ${categoryBadgeClass}`}>
              {topic.category}
            </span>
          )}
          <span className="font-sans text-sm text-[var(--color-text-muted)]">
            {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
          </span>
        </div>
        <h1 className="font-headline text-3xl md:text-4xl mb-4">{topic.title}</h1>
        {topic.summary && (
          <p className="font-sans text-lg text-[var(--color-text-muted)]">
            {topic.summary}
          </p>
        )}
      </header>

      {/* Pro/Con Summary */}
      {summary && (
        <section className="mb-12">
          <h2 className="font-headline text-2xl mb-6">At a Glance</h2>
          <ProConSummary
            proPoints={proPoints}
            conPoints={conPoints}
            neutralContext={summary.neutral_context || undefined}
          />
        </section>
      )}

      {/* AI Agent Analyses */}
      {analyses.length > 0 && (
        <section className="mb-12">
          <h2 className="font-headline text-2xl mb-6">AI Agent Perspectives</h2>
          <p className="font-sans text-sm text-[var(--color-text-muted)] mb-6">
            Our AI agents analyze this topic from different viewpoints, each with their own biases and analytical styles.
          </p>
          <div className="space-y-4">
            {analyses.map(analysis => {
              const keyPoints = safeJSONParse<string[]>(analysis.key_points, []);
              return (
                <AgentAnalysis
                  key={analysis.id}
                  agentName={analysis.agent.name}
                  agentBias={analysis.agent.bias}
                  agentColorClass={analysis.agent.color_class || 'agent-centrist'}
                  analysis={analysis.analysis}
                  stance={analysis.stance || undefined}
                  keyPoints={keyPoints}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Request Analysis Button */}
      {analyses.length === 0 && (
        <section className="mb-12">
          <div className="bg-[var(--color-cream-light)] border border-[var(--color-border)] rounded-lg p-8 text-center">
            <h3 className="font-headline text-xl mb-2">No analyses yet</h3>
            <p className="font-sans text-sm text-[var(--color-text-muted)] mb-4">
              AI agent analyses for this topic have not been generated yet.
            </p>
            <p className="font-sans text-xs text-[var(--color-text-muted)]">
              Run: <code className="bg-[var(--color-cream)] px-2 py-1 rounded">curl -X POST http://localhost:3000/api/analyze -H &quot;Content-Type: application/json&quot; -d &apos;&#123;&quot;topicId&quot;:&quot;{id}&quot;&#125;&apos;</code>
            </p>
          </div>
        </section>
      )}

      {/* Source Opinions */}
      {opinionsWithSources.length > 0 && (
        <section className="mb-12">
          <h2 className="font-headline text-2xl mb-6">Original Opinions</h2>
          <p className="font-sans text-sm text-[var(--color-text-muted)] mb-6">
            These are the original opinion pieces that our AI agents analyzed.
          </p>
          <div className="space-y-4">
            {opinionsWithSources.map(opinion => (
              <SourceOpinion
                key={opinion.id}
                title={opinion.title}
                author={opinion.author || undefined}
                sourceName={opinion.sourceName}
                excerpt={opinion.excerpt || undefined}
                url={opinion.url}
                publishedAt={opinion.published_at || undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* Back to home */}
      <div className="border-t border-[var(--color-border)] pt-8">
        <Link
          href="/"
          className="font-sans text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          ← Back to all debates
        </Link>
      </div>
    </div>
  );
}
