# NewsOpinions

AI-powered opinion analysis platform that aggregates opinions from across the political spectrum and has multiple AI agents debate them, giving you balanced perspectives on every hot topic.

## Features

- **Semafor-inspired design** - Clean, readable layout with cream color palette
- **Opinion aggregation** - Crawls RSS feeds from diverse opinion sources
- **6 AI agent personas** - Each with distinct biases and analytical styles
- **Pro/Con summaries** - Quick bullet-point overview of all arguments
- **Source attribution** - Links to original opinion pieces

## AI Agents

1. **Reagan Reynolds** (Conservative) - Traditional values, free markets
2. **Maya Chen** (Progressive) - Social justice, systemic reform
3. **Max Sterling** (Libertarian) - Individual freedom, decentralization
4. **Jordan Blake** (Centrist) - Pragmatic compromise
5. **Aria Nexus** (Techno-Optimist) - Innovation-first thinking
6. **Dr. Vera Scruton** (Skeptic) - Critical analysis, epistemic humility

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
# Required for real AI analysis (optional - demo mode works without it)
ANTHROPIC_API_KEY=your-api-key-here
```

Without the API key, the system runs in demo mode with placeholder analyses.

## Usage

### 1. Seed Sample Data

```bash
curl -X POST http://localhost:3000/api/seed
```

### 2. Crawl Opinion Sources

```bash
curl -X POST http://localhost:3000/api/crawl
```

### 3. Generate AI Analysis

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"topicId": "<topic-id>"}'
```

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/seed` | POST | Seed database with sample data |
| `/api/crawl` | POST | Crawl all opinion sources |
| `/api/topics` | GET | List all topics |
| `/api/topics?category=tech` | GET | Filter topics by category |
| `/api/analyze` | POST | Generate AI analyses for topic (body: `{"topicId": "xxx"}`) |

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── topic/[id]/        # Topic detail pages
│   └── category/[cat]/    # Category pages
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── TopicCard.tsx
│   ├── AgentAnalysis.tsx
│   ├── ProConSummary.tsx
│   └── SourceOpinion.tsx
└── lib/                   # Core logic
    ├── database.ts        # SQLite schema
    ├── agents.ts          # AI persona definitions
    ├── crawler.ts         # RSS/HTML scraping
    ├── orchestrator.ts    # Topic identification
    └── ai-service.ts      # Anthropic Claude integration
```

## Automation

For production, set up cron jobs to:

1. **Crawl sources hourly**: `curl -X POST http://localhost:3000/api/crawl`
2. **Generate analyses for new topics**: Iterate through unanalyzed topics

Example cron (every hour):
```cron
0 * * * * curl -X POST -s http://localhost:3000/api/crawl
```

## Known Limitations & Production Readiness

⚠️ **This application is currently in development and not production-ready without modifications.**

### Current Limitations

1. **Database**: Uses local SQLite (`newsopinions.db`) which:
   - Will not persist on serverless platforms (Vercel, Netlify)
   - Does not support horizontal scaling
   - Requires migration to managed database for production

2. **No Authentication/Authorization**:
   - All API routes are publicly accessible
   - No rate limiting implemented
   - Recommended: Add authentication layer before production deployment

3. **External Fetch Security**:
   - RSS/HTML crawling has basic timeout protection (10s)
   - No SSRF protection if URLs become user-controlled
   - Content sanitization is basic (cheerio text extraction only)

4. **Error Handling**:
   - Improved logging and error handling added for AI parsing and crawling
   - Production deployments should integrate proper observability (e.g., Sentry)

### Recent Security & Reliability Improvements

✅ **API Security**: All mutating endpoints changed from GET to POST
✅ **Input Validation**: Added validation on API inputs (e.g., topicId)
✅ **Timeout Protection**: 10-second timeouts on all external HTTP requests
✅ **Error Logging**: Comprehensive logging for AI parsing failures and crawl errors
✅ **Lazy Initialization**: Database initialization moved from module-load to on-demand
✅ **Type Safety**: Enhanced type checking in AI response parsing

### Recommended for Production

Before deploying to production, implement:

1. **Database Migration**:
   - Migrate to managed database (Vercel Postgres, PlanetScale, Turso, Supabase)
   - Add migration scripts and backup strategy

2. **Authentication**:
   - Add authentication middleware (NextAuth.js, Clerk, etc.)
   - Protect all mutating API routes
   - Implement CSRF protection

3. **Rate Limiting**:
   - Add rate limiting to API routes (e.g., using Upstash Redis)
   - Implement per-IP and per-user limits

4. **Observability**:
   - Integrate error tracking (Sentry, LogRocket)
   - Add performance monitoring
   - Set up alerting for failures

5. **Content Security**:
   - Add HTML sanitization library (e.g., DOMPurify) for stored content
   - Implement Content Security Policy headers
   - Validate and sanitize all external URLs

6. **Testing**:
   - Add integration tests for API routes
   - Add unit tests for crawler and orchestrator
   - Implement CI/CD pipeline

## Deployment

### Vercel (Development Only)

1. Push to GitHub
2. Import to Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

**Note**: SQLite database won't persist on Vercel. For production, migrate to a managed database first.

### Production Deployment

For production deployments:

1. Choose a managed database:
   - **Vercel Postgres** - Integrated with Vercel
   - **PlanetScale** - MySQL-compatible, serverless
   - **Turso** - SQLite-compatible, edge-distributed
   - **Supabase** - PostgreSQL with real-time capabilities

2. Update database connection in `src/lib/database.ts`
3. Add authentication and rate limiting
4. Configure environment variables
5. Set up monitoring and alerts
6. Deploy to your platform of choice

## Customization

### Adding Opinion Sources

Edit `src/lib/crawler.ts` and add to `defaultSources`:

```typescript
{
  id: 'my-source',
  name: 'My Opinion Source',
  url: 'https://example.com',
  feed_url: 'https://example.com/feed.xml',
  bias: 'center-left',
  category: 'politics'
}
```

### Modifying AI Agents

Edit `src/lib/agents.ts` to customize personas, add new agents, or modify analytical styles.

## License

MIT

## Acknowledgments

- Design inspired by [Semafor](https://semafor.com)
- AI powered by [Anthropic Claude](https://anthropic.com)
