import Header from "@/components/Header";
import Footer from "@/components/Footer";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";
import { LAUNCH_TOOL_COUNT } from "@/lib/constants";
import { formatStars, timeAgo } from "@/lib/github";
import Link from "next/link";

export const metadata = {
  title: "Changelog - ENNA",
  description:
    "See what changed on ENNA. New tools, updated stats, and recent GitHub activity across the index.",
};

export default function ChangelogPage() {
  const tools = toolsData as Tool[];

  // New tools (added after launch)
  const newTools = tools.slice(LAUNCH_TOOL_COUNT);

  // Most recently active (by GitHub push)
  const recentlyActive = [...tools]
    .filter((t) => t.lastCommit)
    .sort(
      (a, b) =>
        new Date(b.lastCommit!).getTime() - new Date(a.lastCommit!).getTime()
    )
    .slice(0, 20);

  // Most starred
  const topStarred = [...tools]
    .filter((t) => t.stars !== undefined)
    .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
    .slice(0, 10);

  // Tools with most open issues (may need attention)
  const mostIssues = [...tools]
    .filter((t) => t.openIssues !== undefined && t.openIssues > 0)
    .sort((a, b) => (b.openIssues ?? 0) - (a.openIssues ?? 0))
    .slice(0, 10);

  // Language breakdown
  const langCounts = new Map<string, number>();
  tools.forEach((t) => langCounts.set(t.language, (langCounts.get(t.language) || 0) + 1));
  const langBreakdown = Array.from(langCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Data
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Changelog</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            What changed on ENNA. New tools, GitHub activity, and index stats.
          </p>

          <div className="flex items-center justify-center gap-8 mt-8 font-mono text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold brand-gradient-text">
                {tools.length}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                Total Tools
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                +{newTools.length}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                Since Launch
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-400">
                {langCounts.size}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                Languages
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* New tools since launch */}
          {newTools.length > 0 && (
            <section className="glass rounded-xl p-6">
              <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                New Tools Since Launch ({newTools.length})
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {newTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tool/${tool.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-secondary transition-colors"
                  >
                    {tool.avatarUrl ? (
                      <img src={tool.avatarUrl} alt="" className="w-6 h-6 rounded" />
                    ) : (
                      <div className="w-6 h-6 rounded brand-gradient flex items-center justify-center">
                        <span className="text-white font-mono text-[8px] font-bold">
                          {tool.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-mono text-text-primary flex-1 truncate">
                      {tool.name}
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      {tool.category}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Most recently active */}
          <section className="glass rounded-xl p-6">
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Most Recently Active
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentlyActive.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tool/${tool.slug}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-secondary transition-colors"
                >
                  <span className="text-sm font-mono text-text-primary flex-1 truncate">
                    {tool.name}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {timeAgo(tool.lastCommit!)}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Top starred */}
          <section className="glass rounded-xl p-6">
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Most Starred
            </h2>
            <div className="space-y-2">
              {topStarred.map((tool, i) => (
                <Link
                  key={tool.slug}
                  href={`/tool/${tool.slug}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-secondary transition-colors"
                >
                  <span className="text-xs font-mono text-text-muted w-5 text-right">
                    {i + 1}
                  </span>
                  <span className="text-sm font-mono text-text-primary flex-1 truncate">
                    {tool.name}
                  </span>
                  <span className="text-xs font-mono text-yellow-500">
                    {formatStars(tool.stars!)}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Language breakdown */}
          <section className="glass rounded-xl p-6">
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Language Breakdown
            </h2>
            <div className="space-y-3">
              {langBreakdown.map(([lang, count]) => {
                const pct = Math.round((count / tools.length) * 100);
                return (
                  <div key={lang}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-mono text-text-primary">
                        {lang}
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full brand-gradient"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
