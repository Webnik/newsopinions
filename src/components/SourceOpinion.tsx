import { formatDistanceToNow } from 'date-fns';

interface SourceOpinionProps {
  title: string;
  author?: string;
  sourceName: string;
  excerpt?: string;
  url: string;
  publishedAt?: string;
}

export default function SourceOpinion({
  title,
  author,
  sourceName,
  excerpt,
  url,
  publishedAt,
}: SourceOpinionProps) {
  return (
    <div className="bg-[var(--color-cream-light)] border border-[var(--color-border)] rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow">
          <h4 className="font-headline text-base mb-1 leading-tight">
            {title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-sans mb-2">
            {author && <span>{author}</span>}
            {author && <span>•</span>}
            <span>{sourceName}</span>
            {publishedAt && (
              <>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
                </span>
              </>
            )}
          </div>
          {excerpt && (
            <p className="font-sans text-sm text-[var(--color-text-muted)] line-clamp-2">
              {excerpt}
            </p>
          )}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 hover:bg-[var(--color-border)] rounded transition-colors"
          aria-label="Read original article"
        >
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
