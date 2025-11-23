'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('[Error Boundary]', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <h1 className="font-headline text-3xl mb-4 text-red-900">
          Something went wrong
        </h1>
        <p className="font-sans text-lg text-red-700 mb-6">
          An unexpected error occurred while loading this page.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-white rounded border border-red-300 text-left">
            <p className="font-mono text-sm text-red-800 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-gray-600 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 rounded-full bg-[var(--color-text)] text-[var(--color-cream)] font-sans text-sm hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2 rounded-full bg-[var(--color-cream-light)] text-[var(--color-text)] font-sans text-sm border border-[var(--color-border)] hover:bg-[var(--color-cream)] transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
