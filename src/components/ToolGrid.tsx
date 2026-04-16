"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import Fuse from "fuse.js";
import { Tool, Category, CategoryInfo } from "@/types";
import { PAGE_SIZE } from "@/lib/constants";
import SearchFilter from "./SearchFilter";
import ToolCard from "./ToolCard";

type SortOption = "name" | "stars" | "recent";

interface Props {
  tools: Tool[];
  categories: CategoryInfo[];
}

export default function ToolGrid({ tools, categories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState<Category | null>(
    (searchParams.get("category") as Category) || null
  );
  const [activeLanguage, setActiveLanguage] = useState<string | null>(
    searchParams.get("lang") || null
  );
  const [activePlatform, setActivePlatform] = useState<string | null>(
    searchParams.get("platform") || null
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "name"
  );
  const [visible, setVisible] = useState(PAGE_SIZE);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  // Build Fuse index once
  const fuse = useMemo(
    () =>
      new Fuse(tools, {
        keys: [
          { name: "name", weight: 3 },
          { name: "tags", weight: 2 },
          { name: "description", weight: 1 },
          { name: "category", weight: 1 },
          { name: "language", weight: 1 },
        ],
        threshold: 0.35,
        includeScore: true,
      }),
    [tools]
  );

  // Derive available languages and platforms from tools
  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    tools.forEach((t) => {
      const lang = t.language;
      counts.set(lang, (counts.get(lang) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([lang, count]) => ({ lang, count }));
  }, [tools]);

  const platforms = useMemo(() => {
    const counts = new Map<string, number>();
    tools.forEach((t) => {
      t.platform.forEach((p) => counts.set(p, (counts.get(p) || 0) + 1));
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([platform, count]) => ({ platform, count }));
  }, [tools]);

  // Track search queries (debounced)
  useEffect(() => {
    clearTimeout(searchTimer.current);
    if (query.trim().length >= 2) {
      searchTimer.current = setTimeout(() => {
        track("search", { query: query.trim(), results: filtered.length });
      }, 1000);
    }
    return () => clearTimeout(searchTimer.current);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeCategory) params.set("category", activeCategory);
    if (activeLanguage) params.set("lang", activeLanguage);
    if (activePlatform) params.set("platform", activePlatform);
    if (sortBy !== "name") params.set("sort", sortBy);
    const str = params.toString();
    router.replace(str ? `/?${str}` : "/", { scroll: false });
  }, [query, activeCategory, activeLanguage, activePlatform, sortBy, router]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, activeCategory, activeLanguage, activePlatform, sortBy]);

  const categoriesWithCount = useMemo(() => {
    return categories.map((c) => ({
      ...c,
      count: tools.filter((t) => t.category === c.id).length,
    }));
  }, [tools, categories]);

  const filtered = useMemo(() => {
    let result: Tool[];

    // Fuzzy search or full list
    if (query.trim()) {
      result = fuse.search(query.trim()).map((r) => r.item);
    } else {
      result = [...tools];
    }

    // Category filter
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }

    // Language filter
    if (activeLanguage) {
      result = result.filter((t) => t.language === activeLanguage);
    }

    // Platform filter
    if (activePlatform) {
      result = result.filter((t) => t.platform.includes(activePlatform));
    }

    // Sort (skip if fuzzy search is active — Fuse already ranks by relevance)
    if (!query.trim()) {
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (sortBy === "stars") return (b.stars ?? 0) - (a.stars ?? 0);
        if (sortBy === "recent") {
          if (!a.lastCommit) return 1;
          if (!b.lastCommit) return -1;
          return new Date(b.lastCommit).getTime() - new Date(a.lastCommit).getTime();
        }
        return a.name.localeCompare(b.name);
      });
    }

    return result;
  }, [tools, fuse, query, activeCategory, activeLanguage, activePlatform, sortBy]);

  const showMore = useCallback(() => {
    setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <SearchFilter
        query={query}
        onQueryChange={setQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categoriesWithCount}
        resultCount={filtered.length}
      />

      {/* Language & Platform filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <span className="text-xs font-mono text-text-muted mr-1">Language</span>
        <button
          onClick={() => setActiveLanguage(null)}
          className={`px-2 py-0.5 rounded-md text-xs font-mono transition-colors ${
            !activeLanguage
              ? "bg-accent-500/15 text-accent-400 border border-accent-500/30"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          All
        </button>
        {languages.slice(0, 8).map(({ lang, count }) => (
          <button
            key={lang}
            onClick={() => setActiveLanguage(lang === activeLanguage ? null : lang)}
            className={`px-2 py-0.5 rounded-md text-xs font-mono transition-colors ${
              activeLanguage === lang
                ? "bg-accent-500/15 text-accent-400 border border-accent-500/30"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {lang} <span className="opacity-50">({count})</span>
          </button>
        ))}

        <span className="text-border mx-2">|</span>

        <span className="text-xs font-mono text-text-muted mr-1">Platform</span>
        {platforms.map(({ platform, count }) => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform === activePlatform ? null : platform)}
            className={`px-2 py-0.5 rounded-md text-xs font-mono transition-colors ${
              activePlatform === platform
                ? "bg-accent-500/15 text-accent-400 border border-accent-500/30"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {platform === "linux" ? "🐧" : platform === "macos" ? "🍎" : "🪟"}{" "}
            {platform} <span className="opacity-50">({count})</span>
          </button>
        ))}
      </div>

      {/* Sort + active filter summary */}
      <div className="flex items-center justify-between mb-6">
        {(activeLanguage || activePlatform) && (
          <button
            onClick={() => { setActiveLanguage(null); setActivePlatform(null); }}
            className="text-xs font-mono text-brand-400 hover:text-brand-300 transition-colors"
          >
            Clear filters
          </button>
        )}
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted ml-auto">
          <span>Sort by</span>
          {(["name", "stars", "recent"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sortBy === opt
                  ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
                  : "hover:text-text-secondary"
              }`}
            >
              {opt === "name" ? "A-Z" : opt === "stars" ? "Stars" : "Recent"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted font-mono text-lg mb-2">
            No tools found
          </p>
          <p className="text-text-muted font-mono text-sm">
            Try a different search or category
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} index={i} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={showMore}
                className="px-6 py-3 rounded-lg bg-surface-secondary border border-border hover:border-brand-500/40 text-sm font-mono text-text-secondary hover:text-brand-400 transition-all"
              >
                Show more ({filtered.length - visible} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
