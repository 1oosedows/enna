"use client";

import { Category, CategoryInfo } from "@/types";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  activeCategory: Category | null;
  onCategoryChange: (c: Category | null) => void;
  categories: CategoryInfo[];
  resultCount: number;
}

export default function SearchFilter({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  categories,
  resultCount,
}: Props) {
  return (
    <div id="tools" className="scroll-mt-24">
      {/* Search bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search tools, tags, or categories..."
          className="input-field pl-12 pr-20"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
          {resultCount} results
        </div>
      </div>

      {/* Category filter */}
      <div
        id="categories"
        className="flex flex-wrap items-center justify-center gap-2 mb-12 scroll-mt-24"
      >
        <button
          onClick={() => onCategoryChange(null)}
          className={`category-badge ${!activeCategory ? "active" : ""}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              onCategoryChange(cat.id === activeCategory ? null : cat.id)
            }
            className={`category-badge ${cat.id === activeCategory ? "active" : ""}`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            {cat.count !== undefined && (
              <span className="text-text-muted ml-1">({cat.count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
