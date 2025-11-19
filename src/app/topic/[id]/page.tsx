import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import AgentAnalysis from '@/components/AgentAnalysis';
import ProConSummary from '@/components/ProConSummary';
import SourceOpinion from '@/components/SourceOpinion';
import { getTopicWithOpinions } from '@/lib/orchestrator';
import { getTopicAnalyses, getTopicSummary } from '@/lib/agents';
import db from '@/lib/database';

interface TopicPageProps {
  params: Promise<{ id: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { id } = await params;
  const topicData = getTopicWithOpinions(id);

  if (!topicData) {
    notFound();
  }

  const { topic, opinions } = topicData;
  const analyses = getTopicAnalyses(id);
  const summary = getTopicSummary(id);

  // Get source names for opinions
  const opinionsWithSources = opinions.map(opinion => {
    const source = db.prepare('SELECT name FROM sources WHERE id = ?').get(opinion.source_id) as { name: string } | undefined;
    return {
      ...opinion,
      sourceName: source?.name || 'Unknown Source',
    };
  });

  // Parse summary points
  const proPoints = summary ? JSON.parse(summary.pro_points) : [];
  const conPoints = summary ? JSON.parse(summary.con_points) : [];

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
              const keyPoints = analysis.key_points ? JSON.parse(analysis.key_points) : [];
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
              Request AI agent analyses for this topic to see multiple perspectives.
            </p>
            <a
              href={`/api/analyze?topicId=${id}`}
              className="inline-block font-sans text-sm bg-[var(--color-text)] text-[var(--color-cream)] px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Generate Analyses
            </a>
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
        <a
          href="/"
          className="font-sans text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          ← Back to all debates
        </a>
      </div>
    </div>
  );
}
