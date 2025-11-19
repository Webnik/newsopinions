import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-text)] text-[var(--color-cream)] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-headline text-2xl mb-4">
              News<span className="opacity-60">Opinions</span>
            </h3>
            <p className="font-sans text-sm opacity-80 mb-4 max-w-md">
              A fully AI-powered opinion analysis platform. We aggregate opinions from
              across the political spectrum and have our AI agents debate them, giving
              you balanced perspectives on every hot topic.
            </p>
            <p className="font-sans text-xs opacity-60">
              100% Agentic AI Organization
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider mb-4 opacity-60">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/category/politics" className="font-sans text-sm hover:opacity-80 transition-opacity">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/category/tech" className="font-sans text-sm hover:opacity-80 transition-opacity">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="font-sans text-sm hover:opacity-80 transition-opacity">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/category/culture" className="font-sans text-sm hover:opacity-80 transition-opacity">
                  Culture
                </Link>
              </li>
              <li>
                <Link href="/category/global" className="font-sans text-sm hover:opacity-80 transition-opacity">
                  Global Affairs
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider mb-4 opacity-60">
              About
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="font-sans text-sm hover:opacity-80 transition-opacity">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/agents" className="font-sans text-sm hover:opacity-80 transition-opacity">
                  AI Agents
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="font-sans text-sm hover:opacity-80 transition-opacity">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/sources" className="font-sans text-sm hover:opacity-80 transition-opacity">
                  Sources
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--color-cream)] border-opacity-20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs opacity-60">
            &copy; {new Date().getFullYear()} NewsOpinions. An experiment in AI-powered journalism.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-sans text-xs opacity-60">
              Powered by Claude AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
