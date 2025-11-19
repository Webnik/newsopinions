import TopicCard from '@/components/TopicCard';
import { initializeSystem, getAllTopics } from '@/lib/orchestrator';
import db from '@/lib/database';

// Initialize system on first load
initializeSystem();

export default async function HomePage() {
  const topics = getAllTopics();

  // Get additional data for each topic
  const topicsWithData = topics.map(topic => {
    const opinions = db.prepare(`
      SELECT COUNT(*) as count FROM topic_opinions WHERE topic_id = ?
    `).get(topic.id) as { count: number };

    const analyses = db.prepare(`
      SELECT COUNT(*) as count FROM agent_analyses WHERE topic_id = ?
    `).get(topic.id) as { count: number };

    return {
      ...topic,
      opinionsCount: opinions?.count || 0,
      analysesCount: analyses?.count || 0,
    };
  });

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
                <a
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
                </a>
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
            <p className="font-sans text-sm text-[var(--color-text-muted)] mb-4">
              Start by seeding some sample data or crawling opinion sources.
            </p>
            <a
              href="/api/seed"
              className="inline-block font-sans text-sm bg-[var(--color-text)] text-[var(--color-cream)] px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Seed Sample Data
            </a>
          </div>
        )}
      </section>

      {/* Newsletter signup */}
      <section className="mt-16 bg-[var(--color-text)] text-[var(--color-cream)] rounded-lg p-8 text-center">
        <h2 className="font-headline text-2xl mb-4">Stay Informed</h2>
        <p className="font-sans text-sm opacity-80 mb-6 max-w-md mx-auto">
          Get daily AI-analyzed opinion summaries delivered to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 rounded-full bg-[var(--color-highlight)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] font-sans text-sm"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-[var(--color-cream)] text-[var(--color-text)] font-sans text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
