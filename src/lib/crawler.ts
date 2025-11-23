import { v4 as uuidv4 } from 'uuid';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import db, { Source, Opinion } from './database';

const parser = new Parser({
  timeout: 10000, // 10 second timeout for RSS parsing
  maxRedirects: 3,
});

// Fetch with timeout helper
async function fetchWithTimeout(url: string, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'NewsOpinions/1.0 (Opinion Aggregator)',
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// Sample opinion sources (in production, this would be configurable)
export const defaultSources: Omit<Source, 'created_at'>[] = [
  {
    id: 'nyt-opinion',
    name: 'New York Times Opinion',
    url: 'https://www.nytimes.com/section/opinion',
    feed_url: 'https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml',
    bias: 'center-left',
    category: 'mainstream'
  },
  {
    id: 'wsj-opinion',
    name: 'Wall Street Journal Opinion',
    url: 'https://www.wsj.com/news/opinion',
    feed_url: 'https://feeds.a.dj.com/rss/RSSOpinion.xml',
    bias: 'center-right',
    category: 'mainstream'
  },
  {
    id: 'atlantic',
    name: 'The Atlantic',
    url: 'https://www.theatlantic.com/ideas/',
    feed_url: 'https://www.theatlantic.com/feed/channel/ideas/',
    bias: 'center-left',
    category: 'magazine'
  },
  {
    id: 'national-review',
    name: 'National Review',
    url: 'https://www.nationalreview.com/',
    feed_url: 'https://www.nationalreview.com/feed/',
    bias: 'conservative',
    category: 'magazine'
  },
  {
    id: 'jacobin',
    name: 'Jacobin',
    url: 'https://jacobin.com/',
    feed_url: 'https://jacobin.com/feed',
    bias: 'left',
    category: 'magazine'
  },
  {
    id: 'reason',
    name: 'Reason',
    url: 'https://reason.com/',
    feed_url: 'https://reason.com/feed/',
    bias: 'libertarian',
    category: 'magazine'
  }
];

// Initialize sources in database
export function initializeSources(): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO sources (id, name, url, feed_url, bias, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const source of defaultSources) {
    stmt.run(source.id, source.name, source.url, source.feed_url, source.bias, source.category);
  }
}

// Get all sources
export function getAllSources(): Source[] {
  return db.prepare('SELECT * FROM sources').all() as Source[];
}

// Crawl RSS feed for a source
export async function crawlRSSFeed(source: Source): Promise<Opinion[]> {
  if (!source.feed_url) {
    console.warn(`[Crawler] Source ${source.id} has no feed_url configured`);
    return [];
  }

  try {
    console.log(`[Crawler] Starting RSS crawl for ${source.name} (${source.feed_url})`);
    const feed = await parser.parseURL(source.feed_url);
    const opinions: Opinion[] = [];

    if (!feed.items || feed.items.length === 0) {
      console.warn(`[Crawler] No items found in RSS feed for ${source.name}`);
      return [];
    }

    for (const item of feed.items.slice(0, 10)) {
      const id = uuidv4();
      const opinion: Opinion = {
        id,
        source_id: source.id,
        title: item.title || 'Untitled',
        author: item.creator || item.author,
        url: item.link || source.url,
        content: item.contentSnippet || item.content || '',
        excerpt: item.contentSnippet?.slice(0, 300),
        published_at: item.pubDate || item.isoDate,
        crawled_at: new Date().toISOString(),
        category: categorizeContent(item.title || '', item.contentSnippet || '')
      };

      opinions.push(opinion);
    }

    console.log(`[Crawler] Successfully crawled ${opinions.length} opinions from ${source.name}`);
    return opinions;
  } catch (error) {
    console.error(`[Crawler] Error crawling RSS feed for ${source.name} (${source.feed_url}):`, error);
    if (error instanceof Error) {
      console.error(`[Crawler] Error details: ${error.message}`);
    }
    return [];
  }
}

// Crawl HTML page for opinions
export async function crawlHTMLPage(url: string, timeoutMs: number = 10000): Promise<{
  title: string;
  author: string;
  content: string;
  excerpt: string;
}> {
  try {
    console.log(`[Crawler] Fetching HTML page: ${url}`);
    const response = await fetchWithTimeout(url, timeoutMs);

    if (!response.ok) {
      console.error(`[Crawler] HTTP error ${response.status} for ${url}`);
      return { title: '', author: '', content: '', excerpt: '' };
    }

    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('text/html')) {
      console.warn(`[Crawler] Non-HTML content type (${contentType}) for ${url}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Common selectors for opinion articles
    const title = $('h1').first().text().trim() ||
                  $('article h1').first().text().trim() ||
                  $('[class*="headline"]').first().text().trim();

    const author = $('[class*="author"]').first().text().trim() ||
                   $('[rel="author"]').first().text().trim() ||
                   $('meta[name="author"]').attr('content') || '';

    const content = $('article p').map((_, el) => $(el).text()).get().join('\n\n') ||
                    $('[class*="article-body"] p').map((_, el) => $(el).text()).get().join('\n\n') ||
                    $('main p').map((_, el) => $(el).text()).get().join('\n\n');

    const excerpt = content.slice(0, 300);

    if (!title && !content) {
      console.warn(`[Crawler] No title or content extracted from ${url}`);
    }

    return { title, author, content, excerpt };
  } catch (error) {
    console.error(`[Crawler] Error crawling HTML page ${url}:`, error);
    if (error instanceof Error) {
      console.error(`[Crawler] Error details: ${error.message}`);
    }
    return { title: '', author: '', content: '', excerpt: '' };
  }
}

// Categorize content based on keywords
function categorizeContent(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();

  const categories: Record<string, string[]> = {
    politics: ['election', 'congress', 'senate', 'president', 'democrat', 'republican', 'vote', 'policy', 'legislation', 'government'],
    tech: ['ai', 'artificial intelligence', 'technology', 'software', 'startup', 'silicon valley', 'crypto', 'blockchain', 'algorithm', 'data'],
    business: ['economy', 'market', 'stock', 'investment', 'business', 'corporate', 'finance', 'trade', 'gdp', 'inflation'],
    culture: ['culture', 'art', 'music', 'movie', 'book', 'entertainment', 'media', 'social', 'education', 'religion'],
    global: ['international', 'foreign', 'war', 'climate', 'global', 'world', 'nation', 'treaty', 'diplomatic', 'united nations']
  };

  let maxScore = 0;
  let bestCategory = 'general';

  for (const [category, keywords] of Object.entries(categories)) {
    const score = keywords.filter(kw => text.includes(kw)).length;
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

// Store opinion in database
export function storeOpinion(opinion: Opinion): Opinion {
  const existing = db.prepare('SELECT id FROM opinions WHERE url = ?').get(opinion.url);
  if (existing) {
    return opinion;
  }

  db.prepare(`
    INSERT INTO opinions (id, source_id, title, author, url, content, excerpt, published_at, crawled_at, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    opinion.id,
    opinion.source_id,
    opinion.title,
    opinion.author,
    opinion.url,
    opinion.content,
    opinion.excerpt,
    opinion.published_at,
    opinion.crawled_at,
    opinion.category
  );

  return opinion;
}

// Get recent opinions
export function getRecentOpinions(limit: number = 50): Opinion[] {
  return db.prepare(`
    SELECT * FROM opinions
    ORDER BY crawled_at DESC
    LIMIT ?
  `).all(limit) as Opinion[];
}

// Get opinions by category
export function getOpinionsByCategory(category: string, limit: number = 20): Opinion[] {
  return db.prepare(`
    SELECT * FROM opinions
    WHERE category = ?
    ORDER BY crawled_at DESC
    LIMIT ?
  `).all(category, limit) as Opinion[];
}

// Crawl all sources
export async function crawlAllSources(): Promise<Opinion[]> {
  const sources = getAllSources();

  if (sources.length === 0) {
    console.warn('[Crawler] No sources configured for crawling');
    return [];
  }

  console.log(`[Crawler] Starting crawl of ${sources.length} sources`);
  const allOpinions: Opinion[] = [];
  let successCount = 0;
  let failureCount = 0;

  for (const source of sources) {
    try {
      const opinions = await crawlRSSFeed(source);
      if (opinions.length > 0) {
        successCount++;
        for (const opinion of opinions) {
          const stored = storeOpinion(opinion);
          allOpinions.push(stored);
        }
      } else {
        failureCount++;
      }
    } catch (error) {
      failureCount++;
      console.error(`[Crawler] Unexpected error crawling source ${source.id}:`, error);
    }
  }

  console.log(`[Crawler] Crawl complete: ${successCount} sources succeeded, ${failureCount} failed, ${allOpinions.length} total opinions`);
  return allOpinions;
}
