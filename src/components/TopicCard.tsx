import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface TopicCardProps {
  id: string;
  title: string;
  summary?: string;
  category?: string;
  created_at: string;
  opinionsCount?: number;
  analysesCount?: number;
  isFeatured?: boolean;
}

export default function TopicCard({
  id,
  title,
  summary,
  category,
  created_at,
  opinionsCount = 0,
  analysesCount = 0,
  isFeatured = false,
}: TopicCardProps) {
  const categoryBadgeClass = category ? `badge-${category}` : 'badge-politics';

  return (
    <Link href={`/topic/${id}`}>
      <article
        className={`article-card rounded-lg p-6 h-full flex flex-col ${
          isFeatured ? 'ring-2 ring-[var(--color-highlight)]' : ''
        }`}
      >
        {/* Category & Time */}
        <div className="flex items-center justify-between mb-3">
          {category && (
            <span className={`badge ${categoryBadgeClass}`}>
              {category}
            </span>
          )}
          <span className="font-sans text-xs text-[var(--color-text-muted)]">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-headline text-xl mb-3 leading-tight">
          {title}
        </h3>

        {/* Summary */}
        {summary && (
          <p className="font-sans text-sm text-[var(--color-text-muted)] mb-4 flex-grow line-clamp-3">
            {summary}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-[var(--color-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <span className="font-sans text-xs text-[var(--color-text-muted)]">
              {opinionsCount} opinions
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-[var(--color-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <span className="font-sans text-xs text-[var(--color-text-muted)]">
              {analysesCount} analyses
            </span>
          </div>
        </div>

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-0 right-0 bg-[var(--color-highlight)] text-[var(--color-text)] px-2 py-1 text-xs font-sans font-semibold rounded-bl-lg">
            FEATURED
          </div>
        )}
      </article>
    </Link>
  );
}
