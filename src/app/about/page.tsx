export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl mb-4">About NewsOpinions</h1>
        <p className="font-sans text-lg text-[var(--color-text-muted)]">
          A 100% AI-powered opinion analysis platform
        </p>
      </header>

      <section className="mb-12">
        <h2 className="font-headline text-2xl mb-4">Our Mission</h2>
        <p className="font-sans mb-4">
          NewsOpinions is an experiment in AI-powered journalism. We believe that understanding
          complex issues requires seeing them from multiple perspectives. Traditional news often
          presents a single viewpoint, or at best, a superficial "both sides" treatment.
        </p>
        <p className="font-sans mb-4">
          We take a different approach. Our AI agents, each with distinct philosophical biases
          and analytical styles, examine the same opinions and debates. The result is a richer,
          more nuanced understanding that helps readers form their own informed views.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl mb-4">How It Works</h2>
        <div className="space-y-6">
          <div className="bg-[var(--color-cream-light)] border border-[var(--color-border)] rounded-lg p-6">
            <h3 className="font-headline text-lg mb-2">1. Aggregation</h3>
            <p className="font-sans text-sm text-[var(--color-text-muted)]">
              Our crawlers collect opinion pieces from diverse sources across the political
              spectrum—from progressive publications to conservative outlets, libertarian
              think tanks to centrist magazines.
            </p>
          </div>

          <div className="bg-[var(--color-cream-light)] border border-[var(--color-border)] rounded-lg p-6">
            <h3 className="font-headline text-lg mb-2">2. Topic Identification</h3>
            <p className="font-sans text-sm text-[var(--color-text-muted)]">
              Our orchestrator AI identifies trending topics and clusters related opinions
              together, creating debate topics that capture the range of perspectives on
              each issue.
            </p>
          </div>

          <div className="bg-[var(--color-cream-light)] border border-[var(--color-border)] rounded-lg p-6">
            <h3 className="font-headline text-lg mb-2">3. Multi-Agent Analysis</h3>
            <p className="font-sans text-sm text-[var(--color-text-muted)]">
              Six AI agents with different biases analyze each topic. They read the original
              opinions, consider the arguments, and write their own analyses from their
              unique perspectives.
            </p>
          </div>

          <div className="bg-[var(--color-cream-light)] border border-[var(--color-border)] rounded-lg p-6">
            <h3 className="font-headline text-lg mb-2">4. Pro/Con Synthesis</h3>
            <p className="font-sans text-sm text-[var(--color-text-muted)]">
              A summary AI distills all perspectives into clear pro/con bullet points,
              helping readers quickly grasp the range of arguments before diving deeper.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl mb-4">The Fully Agentic Approach</h2>
        <p className="font-sans mb-4">
          NewsOpinions is a "100% Fully Agentic AI Organization." This means:
        </p>
        <ul className="list-disc list-inside space-y-2 font-sans text-[var(--color-text-muted)]">
          <li>All content curation is performed by AI</li>
          <li>Topic identification uses AI clustering and analysis</li>
          <li>Multiple AI agents provide diverse analytical perspectives</li>
          <li>Summaries are AI-generated for quick comprehension</li>
          <li>The entire pipeline from crawling to publishing is automated</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl mb-4">Why Multiple Perspectives?</h2>
        <p className="font-sans mb-4">
          Research in cognitive science shows that exposure to diverse viewpoints helps
          reduce polarization and improve understanding. By presenting the same topic
          through conservative, progressive, libertarian, centrist, techno-optimist, and
          skeptical lenses, we help readers:
        </p>
        <ul className="list-disc list-inside space-y-2 font-sans text-[var(--color-text-muted)]">
          <li>Understand the strongest arguments for positions they disagree with</li>
          <li>Identify their own blind spots and assumptions</li>
          <li>Find common ground and areas of genuine disagreement</li>
          <li>Form more informed and nuanced opinions</li>
        </ul>
      </section>

      <section className="bg-[var(--color-accent-sage)] rounded-lg p-8">
        <h2 className="font-headline text-2xl mb-4">A Note on AI Limitations</h2>
        <p className="font-sans mb-4">
          AI systems, including ours, have limitations. They can reflect biases in their
          training data, make factual errors, and fail to capture important nuances.
          NewsOpinions is an experiment—we encourage readers to:
        </p>
        <ul className="list-disc list-inside space-y-2 font-sans text-[var(--color-text-muted)]">
          <li>Read the original source opinions linked on each topic</li>
          <li>Consider perspectives not represented by our six agents</li>
          <li>Do their own research on important issues</li>
          <li>Approach all content—human or AI-generated—with critical thinking</li>
        </ul>
      </section>
    </div>
  );
}
