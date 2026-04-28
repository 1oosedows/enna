import Link from "next/link";
import toolsData from "@/data/tools.json";
import workflowData from "@/data/workflows.json";
import blogData from "@/data/blog.json";
import { categories } from "@/data/categories";
import { Tool } from "@/types";
import { formatStars } from "@/lib/github";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Stats - ENNA",
  description: "Live statistics and metrics from ENNA's curated index of open-source security tools.",
};

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
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  Shell: "#89e051",
  PowerShell: "#012456",
};

export default function StatsPage() {
  const tools = toolsData as Tool[];
  const workflows = (workflowData as { workflows: unknown[] }).workflows;
  const posts = (blogData as { posts: unknown[] }).posts;

  const totalStars = tools.reduce((sum, t) => sum + (t.stars || 0), 0);

  const categoryCounts = categories.map((cat) => ({
    ...cat,
    count: tools.filter((t) => t.category === cat.id).length,
  }));
  const maxCategoryCount = Math.max(...categoryCounts.map((c) => c.count));

  const langMap = new Map<string, number>();
  for (const tool of tools) {
    if (tool.language) {
      const current = langMap.get(tool.language) || 0;
      langMap.set(tool.language, current + 1);
    }
  }
  const topLanguages = [...langMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxLangCount = topLanguages[0]?.[1] || 1;

  const now = Date.now();
  const DAY = 1000 * 60 * 60 * 24;
  let active = 0;
  let moderate = 0;
  let stale = 0;
  let unknown = 0;
  for (const tool of tools) {
    if (!tool.lastCommit) {
      unknown++;
    } else {
      const age = now - new Date(tool.lastCommit).getTime();
      if (age < 90 * DAY) active++;
      else if (age < 365 * DAY) moderate++;
      else stale++;
    }
  }

  const topStarred = [...tools]
    .filter((t) => t.stars)
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
    .slice(0, 10);

  const platformCounts = { Linux: 0, macOS: 0, Windows: 0 };
  for (const tool of tools) {
    if (tool.platform?.includes("Linux")) platformCounts.Linux++;
    if (tool.platform?.includes("macOS")) platformCounts.macOS++;
    if (tool.platform?.includes("Windows")) platformCounts.Windows++;
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold font-mono brand-gradient-text mb-2">
            ENNA Stats
          </h1>
          <p className="text-text-muted font-mono text-sm">
            Live metrics from {tools.length} indexed tools
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Tools", value: tools.length },
            { label: "Categories", value: categories.length },
            { label: "Workflows", value: workflows.length },
            { label: "Blog Posts", value: posts.length },
            { label: "GitHub Stars", value: formatStars(totalStars) },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-6 text-center">
              <div className="text-2xl font-bold font-mono text-text-primary">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Tools per Category
            </h2>
            <div className="space-y-3">
              {categoryCounts
                .sort((a, b) => b.count - a.count)
                .map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-text-secondary flex items-center gap-1.5">
                        <span>{cat.icon}</span>
                        {cat.name}
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        {cat.count}
                      </span>
                    </div>
                    <div className="bg-surface-secondary rounded-full h-3">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: `${(cat.count / maxCategoryCount) * 100}%`,
                          backgroundColor: "var(--color-brand-500)",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Language Distribution
            </h2>
            <div className="space-y-3">
              {topLanguages.map(([lang, count]) => (
                <div key={lang}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-text-secondary flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{
                          backgroundColor: langColors[lang] || "#6b7280",
                        }}
                      />
                      {lang}
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      {count}
                    </span>
                  </div>
                  <div className="bg-surface-secondary rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${(count / maxLangCount) * 100}%`,
                        backgroundColor: langColors[lang] || "#6b7280",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Health Overview
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center">
                <div className="text-xl font-bold font-mono text-green-400">
                  {active}
                </div>
                <div className="text-xs font-mono text-green-400/70 mt-1">
                  Active (&lt;90d)
                </div>
              </div>
              <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 text-center">
                <div className="text-xl font-bold font-mono text-yellow-400">
                  {moderate}
                </div>
                <div className="text-xs font-mono text-yellow-400/70 mt-1">
                  Moderate (90-365d)
                </div>
              </div>
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center">
                <div className="text-xl font-bold font-mono text-red-400">
                  {stale}
                </div>
                <div className="text-xs font-mono text-red-400/70 mt-1">
                  Stale (&gt;365d)
                </div>
              </div>
              <div className="rounded-lg bg-surface-secondary border border-border p-4 text-center">
                <div className="text-xl font-bold font-mono text-text-muted">
                  {unknown}
                </div>
                <div className="text-xs font-mono text-text-muted/70 mt-1">
                  Unknown
                </div>
              </div>
            </div>

            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4 mt-8">
              Platform Coverage
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(platformCounts).map(([platform, count]) => (
                <div
                  key={platform}
                  className="rounded-lg bg-surface-secondary border border-border p-3 text-center"
                >
                  <div className="text-lg font-bold font-mono text-text-primary">
                    {count}
                  </div>
                  <div className="text-xs font-mono text-text-muted mt-1">
                    {platform}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Top 10 Most Starred
            </h2>
            <div className="space-y-2">
              {topStarred.map((tool, i) => (
                <div
                  key={tool.slug}
                  className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                >
                  <span className="text-xs font-mono text-text-muted w-5 text-right">
                    {i + 1}
                  </span>
                  <Link
                    href={`/tool/${tool.slug}`}
                    className="text-sm font-mono text-text-primary hover:text-brand-400 transition-colors flex-1 truncate"
                  >
                    {tool.name}
                  </Link>
                  <span className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{
                        backgroundColor:
                          langColors[tool.language] || "#6b7280",
                      }}
                    />
                    {tool.language}
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    ★ {formatStars(tool.stars || 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
