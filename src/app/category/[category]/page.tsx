import { notFound } from 'next/navigation';
import TopicCard from '@/components/TopicCard';
import { getTopicsByCategory } from '@/lib/orchestrator';
import db from '@/lib/database';

const validCategories = ['politics', 'tech', 'business', 'culture', 'global'];

const categoryInfo: Record<string, { title: string; description: string }> = {
  politics: {
    title: 'Politics',
    description: 'Debates on policy, governance, elections, and political philosophy',
  },
  tech: {
    title: 'Technology',
    description: 'Discussions on AI, software, digital policy, and technological change',
  },
  business: {
    title: 'Business & Economics',
    description: 'Analysis of markets, trade, corporate governance, and economic policy',
  },
  culture: {
    title: 'Culture & Society',
    description: 'Perspectives on art, media, education, and social trends',
  },
  global: {
    title: 'Global Affairs',
    description: 'International relations, foreign policy, and geopolitical developments',
  },
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!validCategories.includes(category)) {
    notFound();
  }

  const info = categoryInfo[category];
  const topics = getTopicsByCategory(category);

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

  const badgeClass = `badge-${category}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-12">
        <span className={`badge ${badgeClass} mb-4`}>
          {info.title}
        </span>
        <h1 className="font-headline text-4xl mb-4">{info.title}</h1>
        <p className="font-sans text-lg text-[var(--color-text-muted)]">
          {info.description}
        </p>
      </header>

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
          <h3 className="font-headline text-xl mb-2">No debates in this category yet</h3>
          <p className="font-sans text-sm text-[var(--color-text-muted)]">
            Check back soon for {info.title.toLowerCase()} topics.
          </p>
        </div>
      )}
    </div>
  );
}
