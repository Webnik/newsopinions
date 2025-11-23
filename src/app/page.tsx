import Link from 'next/link';
import TopicCard from '@/components/TopicCard';
import { ensureInitialized, getAllTopicsWithCounts } from '@/lib/orchestrator';

export default async function HomePage() {
  // Lazy initialization - only runs once per process
  ensureInitialized();

  // Get topics with counts (optimized - single query)
  const topicsWithData = getAllTopicsWithCounts();

  const featuredTopics = topicsWithData.filter(t => t.is_featured);
  const recentTopics = topicsWithData.filter(t => !t.is_featured);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl mb-4">
          Intelligence for the<br />
          <span className="text-[var(--color-text-muted)]">Opinion Economy</span>
        </h1>
        <p className="font-sans text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          AI-powered analysis of opinions from across the political spectrum.
          Multiple AI agents debate every topic, giving you balanced perspectives.
        </p>
      </section>

      {/* Featured topics */}
      {featuredTopics.length > 0 && (
        <section className="mb-12">
          <h2 className="font-headline text-2xl mb-6">Featured Debates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTopics.map(topic => (
              <TopicCard
                key={topic.id}
                id={topic.id}
                title={topic.title}
                summary={topic.summary || undefined}
                category={topic.category || undefined}
                created_at={topic.created_at}
                opinionsCount={topic.opinionsCount}
                analysesCount={topic.analysesCount}
                isFeatured={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* World at a Glance - numbered topics */}
      {recentTopics.length > 0 && (
        <section className="mb-12">
          <h2 className="font-headline text-2xl mb-6">World at a Glance</h2>
          <div className="bg-[var(--color-cream-light)] rounded-lg p-6 border border-[var(--color-border)]">
            <div className="grid md:grid-cols-2 gap-4">
              {recentTopics.slice(0, 6).map((topic, index) => (
                <Link
                  key={topic.id}
                  href={`/topic/${topic.id}`}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--color-cream)] transition-colors"
                >
                  <span className="font-headline text-3xl text-[var(--color-text-muted)]">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-headline text-base leading-tight mb-1">
                      {topic.title}
                    </h3>
                    <span className={`badge badge-${topic.category || 'politics'}`}>
                      {topic.category || 'General'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All topics grid */}
      <section>
        <h2 className="font-headline text-2xl mb-6">All Debates</h2>
        {topicsWithData.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicsWithData.map(topic => (
              <TopicCard
                key={topic.id}
                id={topic.id}
                title={topic.title}
                summary={topic.summary || undefined}
                category={topic.category || undefined}
                created_at={topic.created_at}
                opinionsCount={topic.opinionsCount}
                analysesCount={topic.analysesCount}
                isFeatured={topic.is_featured === 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[var(--color-cream-light)] rounded-lg border border-[var(--color-border)]">
            <h3 className="font-headline text-xl mb-2">No debates yet</h3>
            <p className="font-sans text-sm text-[var(--color-text-muted)]">
              Start by seeding some sample data or crawling opinion sources.
            </p>
            <p className="font-sans text-xs text-[var(--color-text-muted)] mt-2">
              Run <code className="bg-[var(--color-cream)] px-2 py-1 rounded">curl -X POST http://localhost:3000/api/seed</code> to get started.
            </p>
          </div>
        )}
      </section>

      {/* Newsletter signup - Placeholder for future feature */}
      <section className="mt-16 bg-[var(--color-text)] text-[var(--color-cream)] rounded-lg p-8 text-center">
        <h2 className="font-headline text-2xl mb-4">Stay Informed</h2>
        <p className="font-sans text-sm opacity-80 mb-2 max-w-md mx-auto">
          Newsletter functionality coming soon.
        </p>
        <p className="font-sans text-xs opacity-60 max-w-md mx-auto">
          Future releases will include daily AI-analyzed opinion summaries delivered to your inbox.
        </p>
      </section>
    </div>
  );
}
