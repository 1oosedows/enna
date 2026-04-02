"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tool, Category, CategoryInfo } from "@/types";
import SearchFilter from "./SearchFilter";
import ToolCard from "./ToolCard";

const PAGE_SIZE = 30;

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
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeCategory) params.set("category", activeCategory);
    const str = params.toString();
    router.replace(str ? `/?${str}` : "/", { scroll: false });
  }, [query, activeCategory, router]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, activeCategory]);

  const categoriesWithCount = useMemo(() => {
    return categories.map((c) => ({
      ...c,
      count: tools.filter((t) => t.category === c.id).length,
    }));
  }, [tools, categories]);

  const filtered = useMemo(() => {
    let result = tools;

    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q) ||
          t.language.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [tools, query, activeCategory]);

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
