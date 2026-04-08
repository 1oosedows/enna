"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import toolsData from "@/data/tools.json";

export default function Header() {
  const [open, setOpen] = useState(false);

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
          <Link
            href="/gear"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Gear
          </Link>
          <Link
            href="/blog"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Blog
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
            <span>{toolsData.length} tools indexed</span>
          </div>
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border glass">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <Link
              href="/#tools"
              onClick={() => setOpen(false)}
              className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/#categories"
              onClick={() => setOpen(false)}
              className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/library"
              onClick={() => setOpen(false)}
              className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
            >
              Library
            </Link>
            <Link
              href="/gear"
              onClick={() => setOpen(false)}
              className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
            >
              Gear
            </Link>
            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
            >
              Blog
            </Link>
            <a
              href="https://github.com/1oosedows/enna"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
