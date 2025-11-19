import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="font-headline text-6xl mb-4 text-[var(--color-text-muted)]">404</h1>
      <h2 className="font-headline text-2xl mb-4">Page Not Found</h2>
      <p className="font-sans text-[var(--color-text-muted)] mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block font-sans text-sm bg-[var(--color-text)] text-[var(--color-cream)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
      >
        Back to Homepage
      </Link>
    </div>
  );
}
