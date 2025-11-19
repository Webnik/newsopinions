'use client';

import Link from 'next/link';
import { useState } from 'react';

const categories = [
  { name: 'Politics', href: '/category/politics', color: 'badge-politics' },
  { name: 'Tech', href: '/category/tech', color: 'badge-tech' },
  { name: 'Business', href: '/category/business', color: 'badge-business' },
  { name: 'Culture', href: '/category/culture', color: 'badge-culture' },
  { name: 'Global', href: '/category/global', color: 'badge-global' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-cream)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              {/* Globe animation inspired by Semafor */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-mint)] animate-pulse-slow" />
              <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-[var(--color-text)] opacity-20" />
            </div>
            <span className="font-headline text-2xl tracking-tight">
              News<span className="text-[var(--color-text-muted)]">Opinions</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/about"
              className="font-sans text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/agents"
              className="font-sans text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Our AI Agents
            </Link>
            <button className="font-sans text-sm bg-[var(--color-text)] text-[var(--color-cream)] px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`badge ${cat.color} hover:opacity-80 transition-opacity`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[var(--color-border)] py-4 px-4 animate-fade-in">
            <nav className="flex flex-col gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`badge ${cat.color} justify-center`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <hr className="border-[var(--color-border)] my-2" />
              <Link
                href="/about"
                className="font-sans text-sm text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/agents"
                className="font-sans text-sm text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Our AI Agents
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Tagline bar */}
      <div className="bg-[var(--color-cream-light)] py-2 px-4 text-center border-t border-[var(--color-border)]">
        <p className="font-sans text-xs text-[var(--color-text-muted)] tracking-wide">
          AI-POWERED OPINION ANALYSIS • MULTIPLE PERSPECTIVES • BALANCED DEBATE
        </p>
      </div>
    </header>
  );
}
