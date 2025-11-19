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

Visit `/api/seed` to populate the database with sample topics and analyses.

### 2. Crawl Opinion Sources

Visit `/api/crawl` to fetch fresh opinions from configured RSS feeds.

### 3. Generate AI Analysis

For any topic, click "Generate Analyses" or visit:
```
/api/analyze?topicId=<topic-id>
```

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/seed` | GET | Seed database with sample data |
| `/api/crawl` | GET | Crawl all opinion sources |
| `/api/topics` | GET | List all topics |
| `/api/topics?category=tech` | GET | Filter topics by category |
| `/api/analyze?topicId=xxx` | GET | Generate AI analyses for topic |

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

1. **Crawl sources hourly**: `curl http://localhost:3000/api/crawl`
2. **Generate analyses for new topics**: Iterate through unanalyzed topics

Example cron (every hour):
```cron
0 * * * * curl -s http://localhost:3000/api/crawl
```

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

Note: SQLite database won't persist on Vercel. For production, migrate to:
- Vercel Postgres
- PlanetScale
- Turso

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
