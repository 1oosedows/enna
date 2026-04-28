"use client";

import Link from "next/link";
import { Tool } from "@/types";
import { formatStars, timeAgo } from "@/lib/github";
import { getCategoryColorScheme } from "@/lib/category-colors";

function getHealthStatus(lastCommit?: string): { color: string; label: string } | null {
  if (!lastCommit) return null;
  const days = Math.floor((Date.now() - new Date(lastCommit).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 90) return { color: "bg-emerald-500", label: "Active" };
  if (days <= 365) return { color: "bg-yellow-500", label: "Moderate" };
  return { color: "bg-red-500", label: "Stale" };
}

interface Props {
  tool: Tool;
  index: number;
}

export default function ToolCard({ tool, index }: Props) {
  const scheme = getCategoryColorScheme(tool.category);

  const langColors: Record<string, string> = {
    Python: "#3572A5",
    Go: "#00ADD8",
    Rust: "#DEA584",
    "C/C++": "#555555",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Ruby: "#CC342D",
    Java: "#B07219",
    Perl: "#0298C3",
    JavaScript: "#F7DF1E",
    TypeScript: "#3178C6",
    Elixir: "#6E4A7E",
    Shell: "#89e051",
    PowerShell: "#012456",
    DuckyScript: "#ff6600",
  };

  const glassHover =
    scheme === "caution"
      ? "glass-hover-caution"
      : scheme === "danger"
        ? "glass-hover-danger"
        : "glass-hover";

  const cardGlow =
    scheme === "caution"
      ? "card-glow card-glow-caution"
      : scheme === "danger"
        ? "card-glow card-glow-danger"
        : "card-glow";

  const tagClass =
    scheme === "caution"
      ? "tag-pill-caution"
      : scheme === "danger"
        ? "tag-pill-danger"
        : "tag-pill";

  const gradientClass =
    scheme === "caution"
      ? "caution-gradient"
      : scheme === "danger"
        ? "danger-gradient"
        : "brand-gradient";

  const categoryLabel =
    scheme === "caution"
      ? "Dual Use"
      : scheme === "danger"
        ? "Offensive"
        : null;

  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="block animate-slide-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
    >
      <div
        className={`glass ${glassHover} ${cardGlow} rounded-xl p-6 h-full flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {tool.avatarUrl ? (
              <img
                src={tool.avatarUrl}
                alt=""
                className="w-10 h-10 rounded-lg opacity-80"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-lg ${gradientClass} opacity-60 flex items-center justify-center`}
              >
                <span className="text-white font-mono text-xs font-bold">
                  {tool.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-mono font-semibold text-text-primary transition-colors">
                {tool.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: langColors[tool.language] || "#888",
                  }}
                />
                <span className="text-xs font-mono text-text-muted">
                  {tool.language}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {categoryLabel && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${gradientClass} text-white`}
              >
                {categoryLabel}
              </span>
            )}
            {tool.affiliateUrl && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                Pro
              </span>
            )}
            {tool.featured && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                  categoryLabel
                    ? "bg-surface-secondary border border-border text-text-muted"
                    : `${gradientClass} text-white`
                }`}
              >
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 4).map((tag) => (
            <span key={tag} className={tagClass}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          {tool.stars !== undefined && (
            <span className="stat-chip">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-yellow-500"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {formatStars(tool.stars)}
            </span>
          )}
          {tool.forks !== undefined && (
            <span className="stat-chip">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="6" r="3" />
                <path d="M18 9v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9" />
                <path d="M12 12v3" />
              </svg>
              {formatStars(tool.forks)}
            </span>
          )}
          {tool.lastCommit && (
            <span className="stat-chip ml-auto">
              {(() => {
                const health = getHealthStatus(tool.lastCommit);
                return health ? (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${health.color}`}
                    title={health.label}
                  />
                ) : null;
              })()}
              {timeAgo(tool.lastCommit)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
