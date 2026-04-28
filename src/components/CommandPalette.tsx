"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import toolsData from "@/data/tools.json";
import { categories } from "@/data/categories";
import { formatStars } from "@/lib/github";
import { Tool } from "@/types";

const tools = toolsData as Tool[];

const fuse = new Fuse(tools, {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "description", weight: 0.2 },
    { name: "category", weight: 0.15 },
    { name: "tags", weight: 0.15 },
    { name: "language", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
});

const featuredTools = tools
  .filter((t) => t.featured)
  .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
  .slice(0, 8);

function getCategoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? id;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return featuredTools;
    return fuse.search(query, { limit: 8 }).map((r) => r.item);
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const navigate = useCallback(
    (tool: Tool) => {
      close();
      router.push(`/tool/${tool.slug}`);
    },
    [close, router]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[activeIndex]) {
          navigate(results[activeIndex]);
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, activeIndex, results, close, navigate]);

  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.children[activeIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]"
      onClick={close}
    >
      <div className="fixed inset-0 glass opacity-80" />
      <div
        className="relative w-full max-w-xl glass rounded-xl border border-border shadow-2xl font-mono animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <svg
            className="w-4 h-4 text-text-muted shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] text-text-muted bg-surface-secondary rounded border border-border">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
          {results.length === 0 && (
            <div className="px-4 py-8 text-center text-text-muted text-sm">
              No tools found for &ldquo;{query}&rdquo;
            </div>
          )}
          {results.map((tool, i) => (
            <button
              key={tool.slug}
              onClick={() => navigate(tool)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                i === activeIndex
                  ? "bg-surface-secondary text-text-primary"
                  : "text-text-secondary hover:bg-surface-secondary/50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium truncate ${
                      i === activeIndex ? "text-brand-400" : "text-text-primary"
                    }`}
                  >
                    {tool.name}
                  </span>
                  <span className="text-[11px] text-text-muted truncate">
                    {getCategoryName(tool.category)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {tool.language && (
                    <span className="text-[11px] text-text-muted">
                      {tool.language}
                    </span>
                  )}
                  {tool.stars !== undefined && (
                    <span className="text-[11px] text-text-muted">
                      ★ {formatStars(tool.stars)}
                    </span>
                  )}
                </div>
              </div>
              {i === activeIndex && (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] text-text-muted bg-surface-base rounded border border-border">
                  ↵
                </kbd>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[10px] text-text-muted">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-surface-secondary rounded border border-border">↑</kbd>
              <kbd className="px-1 py-0.5 bg-surface-secondary rounded border border-border ml-0.5">↓</kbd>
              {" "}navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-surface-secondary rounded border border-border">↵</kbd>
              {" "}select
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-surface-secondary rounded border border-border">esc</kbd>
              {" "}close
            </span>
          </div>
          <span>{results.length} result{results.length !== 1 && "s"}</span>
        </div>
      </div>
    </div>
  );
}
