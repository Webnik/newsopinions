import { getAllAgents } from '@/lib/agents';
import { initializeSystem } from '@/lib/orchestrator';

// Initialize to ensure agents exist
initializeSystem();

export default function AgentsPage() {
  const agents = getAllAgents();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl mb-4">Our AI Agents</h1>
        <p className="font-sans text-lg text-[var(--color-text-muted)]">
          Six AI personas with distinct viewpoints analyze every topic
        </p>
      </header>

      <section className="mb-12">
        <p className="font-sans text-center max-w-2xl mx-auto mb-8">
          Each of our AI agents has a carefully designed persona with specific biases,
          values, and analytical styles. This isn't about creating "balanced" AI—it's
          about making the inherent perspectives explicit and transparent.
        </p>
      </section>

      <div className="grid gap-6">
        {agents.map(agent => (
          <div
            key={agent.id}
            className={`${agent.color_class} rounded-lg p-6`}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold">
                  {agent.name.charAt(0)}
                </span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-headline text-xl">{agent.name}</h2>
                  <span className="font-sans text-xs uppercase tracking-wider px-2 py-1 bg-white/30 rounded-full">
                    {agent.bias}
                  </span>
                </div>
                <p className="font-sans text-sm mb-3">
                  <strong>Style:</strong> {agent.style}
                </p>
                <p className="font-sans text-sm text-[var(--color-text-muted)]">
                  {agent.persona.split('\n')[0].replace('You are ', '').replace(/\.$/, '').trim()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-12 bg-[var(--color-cream-light)] border border-[var(--color-border)] rounded-lg p-8">
        <h2 className="font-headline text-2xl mb-4">Why These Personas?</h2>
        <p className="font-sans mb-4">
          We chose these six perspectives to represent major currents in contemporary
          political and intellectual discourse:
        </p>
        <ul className="space-y-3 font-sans text-sm">
          <li>
            <strong>Conservative:</strong> Traditional values, free markets, limited government,
            skepticism of rapid change
          </li>
          <li>
            <strong>Progressive:</strong> Social justice, systemic reform, collective action,
            government as a force for good
          </li>
          <li>
            <strong>Libertarian:</strong> Individual freedom, minimal government, free markets,
            voluntary cooperation
          </li>
          <li>
            <strong>Centrist:</strong> Pragmatic compromise, evidence-based policy, rejection of extremes
          </li>
          <li>
            <strong>Techno-Optimist:</strong> Technology as solution, innovation-first thinking,
            long-term optimism
          </li>
          <li>
            <strong>Skeptic:</strong> Critical thinking, epistemic humility, questioning assumptions
          </li>
        </ul>
        <p className="font-sans mt-4 text-sm text-[var(--color-text-muted)]">
          These don't cover all possible viewpoints, but they capture perspectives that often
          talk past each other in public discourse. By making each perspective explicit, we
          help readers understand not just what different people think, but why they think it.
        </p>
      </section>
    </div>
  );
}
