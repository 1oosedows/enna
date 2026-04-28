"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toolsData from "@/data/tools.json";
import { categories } from "@/data/categories";
import { Tool } from "@/types";

const tools = toolsData as Tool[];
const validSlugs = new Set(tools.map((t) => t.slug));

export default function StackBuilder() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Set<string>>(() => {
    const param = searchParams.get("tools");
    if (!param) return new Set();
    const slugs = param.split(",").filter((s) => validSlugs.has(s));
    return new Set(slugs);
  });
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  );

  useEffect(() => {
    const param = searchParams.get("tools");
    if (param) {
      const slugs = param.split(",").filter((s) => validSlugs.has(s));
      if (slugs.length > 0) setSelected(new Set(slugs));
    }
  }, [searchParams]);

  const filteredTools = useMemo(() => {
    if (!search.trim()) return tools;
    const q = search.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [search]);

  const toolsByCategory = useMemo(() => {
    const map = new Map<string, Tool[]>();
    for (const cat of categories) {
      const catTools = filteredTools.filter((t) => t.category === cat.id);
      if (catTools.length > 0) map.set(cat.id, catTools);
    }
    return map;
  }, [filteredTools]);

  const stackUrl = selected.size > 0
    ? `/stack/${Array.from(selected).join(",")}`
    : null;

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleCategory(catId: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }

  function copyUrl() {
    if (!stackUrl) return;
    const full = `${window.location.origin}${stackUrl}`;
    navigator.clipboard.writeText(full);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="lg:w-64 shrink-0">
        <div className="glass rounded-xl p-4 sticky top-24">
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tools..."
              className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500/50"
            />
          </div>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {categories.map((cat) => {
              const count = tools.filter(
                (t) => t.category === cat.id && selected.has(t.slug)
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-mono text-text-secondary hover:bg-surface-secondary transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </span>
                  {count > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-500/20 text-brand-400 font-mono">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="glass rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4 sticky top-24 z-10">
          <span className="text-sm font-mono text-text-secondary">
            <span className="text-brand-400 font-semibold">{selected.size}</span> tools selected
          </span>
          {stackUrl && (
            <>
              <code className="text-xs font-mono text-text-muted bg-surface-secondary px-2 py-1 rounded max-w-xs truncate hidden sm:block">
                {stackUrl}
              </code>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={copyUrl}
                  className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono hover:bg-brand-500/20 transition-colors"
                >
                  Share Stack
                </button>
                <Link
                  href={stackUrl}
                  className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-text-secondary text-xs font-mono hover:text-brand-400 transition-colors"
                >
                  View Stack
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          {categories.map((cat) => {
            const catTools = toolsByCategory.get(cat.id);
            if (!catTools) return null;
            const isExpanded = expandedCategories.has(cat.id);
            return (
              <div key={cat.id}>
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="flex items-center gap-2 mb-3 group"
                >
                  <span>{cat.icon}</span>
                  <h2 className="text-sm font-mono font-semibold text-text-primary">
                    {cat.name}
                  </h2>
                  <span className="text-xs text-text-muted font-mono">
                    ({catTools.length})
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isExpanded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {catTools.map((tool) => {
                      const isSelected = selected.has(tool.slug);
                      return (
                        <button
                          key={tool.slug}
                          onClick={() => toggle(tool.slug)}
                          className={`glass rounded-xl p-4 text-left transition-all ${
                            isSelected
                              ? "border-brand-500/40 bg-brand-500/5"
                              : "hover:bg-surface-secondary"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-brand-500 border-brand-500"
                                : "border-border"
                            }`}>
                              {isSelected && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-mono font-semibold text-sm text-text-primary truncate">
                                {tool.name}
                              </h3>
                              <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                                {tool.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-mono text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded">
                                  {tool.language}
                                </span>
                                {tool.stars !== undefined && (
                                  <span className="text-[10px] font-mono text-text-muted">
                                    ★ {tool.stars >= 1000 ? `${(tool.stars / 1000).toFixed(1)}k` : tool.stars}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
