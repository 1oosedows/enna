"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import toolsData from "@/data/tools.json";

const resourceLinks = [
  { href: "/cheatsheets", label: "Cheat Sheets", icon: "📋" },
  { href: "/chains", label: "Tool Chains", icon: "🔗" },
  { href: "/kits", label: "Starter Kits", icon: "🎯" },
  { href: "/install", label: "Install Generator", icon: "⚡" },
  { href: "/stack", label: "Build Stack", icon: "🧱" },
  { href: "/alternatives", label: "Alternatives", icon: "🔄" },
  { href: "/stats", label: "Stats", icon: "📈" },
  { href: "/changelog", label: "Changelog", icon: "📊" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/sponsors", label: "Sponsors", icon: "💖" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/icon.png"
            alt="ENNA"
            width={32}
            height={32}
            className="rounded-lg group-hover:opacity-90 transition-opacity"
          />
          <span className="font-mono font-semibold text-lg tracking-tight">
            <span className="brand-gradient-text">ENNA</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#tools"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Tools
          </Link>
          <Link
            href="/workflows"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Workflows
          </Link>
          <Link
            href="/library"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Library
          </Link>
          <Link
            href="/blog"
            className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Blog
          </Link>

          {/* Resources dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors flex items-center gap-1"
            >
              Resources
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {resourcesOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 glass rounded-xl border border-border shadow-xl overflow-hidden">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-mono text-text-secondary hover:text-brand-400 hover:bg-surface-secondary transition-colors"
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/suggest"
            className="text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors"
          >
            + Suggest
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
            onClick={() => setMobileOpen(!mobileOpen)}
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
              {mobileOpen ? (
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

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border glass max-h-[80vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
            <Link href="/#tools" onClick={() => setMobileOpen(false)} className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors">
              Tools
            </Link>
            <Link href="/workflows" onClick={() => setMobileOpen(false)} className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors">
              Workflows
            </Link>
            <Link href="/library" onClick={() => setMobileOpen(false)} className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors">
              Library
            </Link>
            <Link href="/gear" onClick={() => setMobileOpen(false)} className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors">
              Gear
            </Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors">
              Blog
            </Link>

            <div className="border-t border-border pt-3 mt-1">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Resources</p>
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-1.5 text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-border pt-3 mt-1">
              <Link href="/suggest" onClick={() => setMobileOpen(false)} className="text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors">
                + Suggest a Tool
              </Link>
            </div>
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
