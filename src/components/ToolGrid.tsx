"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tool, Category, CategoryInfo } from "@/types";
import SearchFilter from "./SearchFilter";
import ToolCard from "./ToolCard";

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

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeCategory) params.set("category", activeCategory);
    const str = params.toString();
    router.replace(str ? `/?${str}` : "/", { scroll: false });
  }, [query, activeCategory, router]);

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

    // Featured first, then alphabetical
    return result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [tools, query, activeCategory]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
