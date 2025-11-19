interface ProConSummaryProps {
  proPoints: string[];
  conPoints: string[];
  neutralContext?: string;
}

export default function ProConSummary({
  proPoints,
  conPoints,
  neutralContext,
}: ProConSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Neutral context */}
      {neutralContext && (
        <div className="bg-[var(--color-cream-light)] border border-[var(--color-border)] rounded-lg p-6">
          <h3 className="font-headline text-lg mb-3">Context</h3>
          <p className="font-sans text-sm text-[var(--color-text-muted)]">
            {neutralContext}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pro section */}
        <div className="pro-section rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="font-headline text-lg">Arguments For</h3>
          </div>
          <ul className="space-y-3">
            {proPoints.map((point, i) => (
              <li key={i} className="font-sans text-sm flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">+</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Con section */}
        <div className="con-section rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h3 className="font-headline text-lg">Arguments Against</h3>
          </div>
          <ul className="space-y-3">
            {conPoints.map((point, i) => (
              <li key={i} className="font-sans text-sm flex items-start gap-2">
                <span className="text-red-600 font-bold mt-0.5">-</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
