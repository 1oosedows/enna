"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 brand-gradient rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-white font-mono font-bold text-sm">
              EN
            </span>
          </div>
          <span className="font-mono font-semibold text-lg tracking-tight">
            <span className="brand-gradient-text">ENNA</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#tools"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Tools
          </Link>
          <Link
            href="/#categories"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/library"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Library
          </Link>
          <a
            href="https://github.com/1oosedows/enna"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs font-mono text-text-muted">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>250+ tools indexed</span>
          </div>
        </div>
      </div>
    </header>
  );
}
