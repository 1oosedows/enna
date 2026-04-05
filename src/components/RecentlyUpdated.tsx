import Link from "next/link";
import { Tool } from "@/types";
import { formatStars, timeAgo } from "@/lib/github";
import { getCategoryColorScheme } from "@/lib/category-colors";

interface Props {
  tools: Tool[];
}

export default function RecentlyUpdated({ tools }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted">
            Recently Updated
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tools.map((tool, i) => {
          const scheme = getCategoryColorScheme(tool.category);
          return (
            <Link
              key={tool.slug}
              href={`/tool/${tool.slug}`}
              className="glass glass-hover rounded-xl p-4 block animate-slide-up"
              style={{
                animationDelay: `${i * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-mono font-semibold text-sm text-text-primary truncate">
                  {tool.name}
                </h3>
                {tool.stars !== undefined && (
                  <span className="text-[10px] font-mono text-text-muted flex items-center gap-0.5 flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {formatStars(tool.stars)}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary line-clamp-1 mb-2">
                {tool.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-text-muted">
                  {tool.language}
                </span>
                {tool.lastCommit && (
                  <span className="text-[10px] font-mono text-green-400">
                    {timeAgo(tool.lastCommit)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
