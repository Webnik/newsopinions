import { NextResponse } from 'next/server';
import { crawlAllSources } from '@/lib/crawler';
import { ensureInitialized, processNewOpinions } from '@/lib/orchestrator';

// Crawl all configured opinion sources
export async function POST() {
  try {
    // Ensure system is initialized
    ensureInitialized();

    // Crawl all RSS feeds
    const opinions = await crawlAllSources();

    // Process opinions into topics
    const topics = processNewOpinions();

    return NextResponse.json({
      success: true,
      message: `Crawled ${opinions.length} opinions and created ${topics.length} topics`,
      data: {
        opinionsCount: opinions.length,
        topicsCount: topics.length,
        topics: topics.map(t => ({
          id: t.id,
          title: t.title,
          category: t.category,
        })),
      },
    });
  } catch (error) {
    console.error('Crawl error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to crawl sources' },
      { status: 500 }
    );
  }
}
