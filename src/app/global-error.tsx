'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ maxWidth: '600px', margin: '100px auto', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#991b1b' }}>
            Application Error
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '24px', color: '#7f1d1d' }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginBottom: '24px', padding: '16px', background: '#fee2e2', borderRadius: '8px', textAlign: 'left' }}>
              <pre style={{ fontSize: '12px', overflow: 'auto', color: '#991b1b' }}>
                {error.message}
              </pre>
            </div>
          )}
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              background: '#1f2937',
              color: '#f5f5dc',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
