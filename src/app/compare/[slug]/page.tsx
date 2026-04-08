import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/data/categories";
import { enrichTool, formatStars, timeAgo } from "@/lib/github";
import { getCategoryColorScheme } from "@/lib/category-colors";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const revalidate = 3600;

function getComparisonPairs(): { slugA: string; slugB: string }[] {
  const tools = toolsData as Tool[];
  const slugSet = new Set(tools.map((t) => t.slug));
  const pairs = new Set<string>();
  const result: { slugA: string; slugB: string }[] = [];

  for (const tool of tools) {
    for (const alt of tool.alternatives || []) {
      if (slugSet.has(alt)) {
        const sorted = [tool.slug, alt].sort();
        const key = `${sorted[0]}-vs-${sorted[1]}`;
        if (!pairs.has(key)) {
          pairs.add(key);
          result.push({ slugA: sorted[0], slugB: sorted[1] });
        }
      }
    }
  }
  return result;
}

export async function generateStaticParams() {
  return getComparisonPairs().map((p) => ({
    slug: `${p.slugA}-vs-${p.slugB}`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tools = toolsData as Tool[];
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return { title: "Comparison Not Found" };

  const toolA = tools.find((t) => t.slug === parts[0]);
  const toolB = tools.find((t) => t.slug === parts[1]);
  if (!toolA || !toolB) return { title: "Comparison Not Found" };

  const pageTitle = `${toolA.name} vs ${toolB.name} - Feature Comparison | ENNA`;
  const pageDescription = `Compare ${toolA.name} and ${toolB.name} side by side. Language, platform support, GitHub stats, features, and use cases compared for security professionals.`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/compare/${slug}`,
      type: "article",
    },
  };
}

function StatBar({
  label,
  valueA,
  valueB,
  format = "number",
}: {
  label: string;
  valueA?: number | string;
  valueB?: number | string;
  format?: "number" | "stars" | "date" | "text";
}) {
  const display = (v: number | string | undefined) => {
    if (v === undefined) return "-";
    if (format === "stars" && typeof v === "number") return formatStars(v);
    if (format === "date" && typeof v === "string") return timeAgo(v);
    return String(v);
  };

  const numA = typeof valueA === "number" ? valueA : 0;
  const numB = typeof valueB === "number" ? valueB : 0;
  const winA =
    format !== "text" &&
    format !== "date" &&
    typeof valueA === "number" &&
    typeof valueB === "number" &&
    valueA > valueB;
  const winB =
    format !== "text" &&
    format !== "date" &&
    typeof valueA === "number" &&
    typeof valueB === "number" &&
    valueB > valueA;

  return (
    <div className="flex items-center py-3 border-b border-border last:border-0">
      <div className="w-1/3 text-right pr-4">
        <span
          className={`text-sm font-mono ${winA ? "text-brand-400 font-semibold" : "text-text-primary"}`}
        >
          {display(valueA)}
        </span>
      </div>
      <div className="w-1/3 text-center">
        <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="w-1/3 text-left pl-4">
        <span
          className={`text-sm font-mono ${winB ? "text-brand-400 font-semibold" : "text-text-primary"}`}
        >
          {display(valueB)}
        </span>
      </div>
    </div>
  );
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tools = toolsData as Tool[];
  const parts = slug.split("-vs-");
  if (parts.length !== 2) notFound();

  const baseA = tools.find((t) => t.slug === parts[0]);
  const baseB = tools.find((t) => t.slug === parts[1]);
  if (!baseA || !baseB) notFound();

  const toolA = await enrichTool(baseA);
  const toolB = await enrichTool(baseB);

  const catA = categories.find((c) => c.id === toolA.category);
  const catB = categories.find((c) => c.id === toolB.category);

  const schemeA = getCategoryColorScheme(toolA.category);
  const schemeB = getCategoryColorScheme(toolB.category);

  const gradientA =
    schemeA === "caution"
      ? "caution-gradient"
      : schemeA === "danger"
        ? "danger-gradient"
        : "brand-gradient";
  const gradientB =
    schemeB === "caution"
      ? "caution-gradient"
      : schemeB === "danger"
        ? "danger-gradient"
        : "brand-gradient";

  const sharedTags = toolA.tags.filter((t) => toolB.tags.includes(t));
  const uniqueTagsA = toolA.tags.filter((t) => !toolB.tags.includes(t));
  const uniqueTagsB = toolB.tags.filter((t) => !toolA.tags.includes(t));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${toolA.name} vs ${toolB.name} - Feature Comparison`,
    description: `Side-by-side comparison of ${toolA.name} and ${toolB.name} for security professionals.`,
    url: `https://www.en-na.com/compare/${slug}`,
    about: [
      { "@type": "SoftwareApplication", name: toolA.name },
      { "@type": "SoftwareApplication", name: toolB.name },
    ],
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
            <Link href="/" className="hover:text-brand-400 transition-colors">
              ENNA
            </Link>
            <span className="text-border">/</span>
            <span className="text-text-secondary">Compare</span>
            <span className="text-border">/</span>
            <span className="text-text-secondary">
              {toolA.name} vs {toolB.name}
            </span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-center mb-10">
            {toolA.name}{" "}
            <span className="text-text-muted font-normal">vs</span>{" "}
            {toolB.name}
          </h1>

          {/* Tool headers */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Link
              href={`/tool/${toolA.slug}`}
              className="glass glass-hover rounded-xl p-6 text-center"
            >
              {toolA.avatarUrl ? (
                <img
                  src={toolA.avatarUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl mx-auto mb-3"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-xl ${gradientA} flex items-center justify-center mx-auto mb-3`}
                >
                  <span className="text-white font-mono font-bold text-xl">
                    {toolA.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <h2 className="font-mono font-semibold text-lg">{toolA.name}</h2>
              <p className="text-xs text-text-muted font-mono mt-1">
                {catA?.icon} {catA?.name} · {toolA.language}
              </p>
            </Link>

            <Link
              href={`/tool/${toolB.slug}`}
              className="glass glass-hover rounded-xl p-6 text-center"
            >
              {toolB.avatarUrl ? (
                <img
                  src={toolB.avatarUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl mx-auto mb-3"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-xl ${gradientB} flex items-center justify-center mx-auto mb-3`}
                >
                  <span className="text-white font-mono font-bold text-xl">
                    {toolB.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <h2 className="font-mono font-semibold text-lg">{toolB.name}</h2>
              <p className="text-xs text-text-muted font-mono mt-1">
                {catB?.icon} {catB?.name} · {toolB.language}
              </p>
            </Link>
          </div>

          {/* Stats comparison */}
          <div className="glass rounded-xl p-6 mb-8">
            <h3 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4 text-center">
              GitHub Stats
            </h3>
            <StatBar
              label="Stars"
              valueA={toolA.stars}
              valueB={toolB.stars}
              format="stars"
            />
            <StatBar
              label="Forks"
              valueA={toolA.forks}
              valueB={toolB.forks}
              format="stars"
            />
            <StatBar
              label="Issues"
              valueA={toolA.openIssues}
              valueB={toolB.openIssues}
              format="number"
            />
            <StatBar
              label="Updated"
              valueA={toolA.lastCommit}
              valueB={toolB.lastCommit}
              format="date"
            />
            <StatBar
              label="License"
              valueA={toolA.license || "-"}
              valueB={toolB.license || "-"}
              format="text"
            />
            <StatBar
              label="Language"
              valueA={toolA.language}
              valueB={toolB.language}
              format="text"
            />
          </div>

          {/* Descriptions side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass rounded-xl p-6">
              <h3 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-3">
                About {toolA.name}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {toolA.longDescription || toolA.description}
              </p>
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-3">
                About {toolB.name}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {toolB.longDescription || toolB.description}
              </p>
            </div>
          </div>

          {/* Platform support */}
          <div className="glass rounded-xl p-6 mb-8">
            <h3 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4 text-center">
              Platform Support
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {toolA.platform.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-secondary border border-border text-xs font-mono"
                  >
                    <span>
                      {p === "linux"
                        ? "🐧"
                        : p === "macos"
                          ? "🍎"
                          : p === "windows"
                            ? "🪟"
                            : "💻"}
                    </span>
                    <span className="text-text-secondary">{p}</span>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {toolB.platform.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-secondary border border-border text-xs font-mono"
                  >
                    <span>
                      {p === "linux"
                        ? "🐧"
                        : p === "macos"
                          ? "🍎"
                          : p === "windows"
                            ? "🪟"
                            : "💻"}
                    </span>
                    <span className="text-text-secondary">{p}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="glass rounded-xl p-6 mb-8">
            <h3 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4 text-center">
              Tags
            </h3>
            {sharedTags.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-mono text-text-muted text-center mb-2">
                  Shared
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {sharedTags.map((tag) => (
                    <span
                      key={tag}
                      className="tag-pill text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              {uniqueTagsA.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-text-muted text-center mb-2">
                    {toolA.name} only
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {uniqueTagsA.map((tag) => (
                      <span
                        key={tag}
                        className="tag-pill text-sm opacity-70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {uniqueTagsB.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-text-muted text-center mb-2">
                    {toolB.name} only
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {uniqueTagsB.map((tag) => (
                      <span
                        key={tag}
                        className="tag-pill text-sm opacity-70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="grid grid-cols-2 gap-6">
            <Link
              href={`/tool/${toolA.slug}`}
              className={`px-6 py-4 rounded-xl ${gradientA} text-white font-mono text-sm font-medium text-center hover:opacity-90 transition-opacity`}
            >
              View {toolA.name} Details
            </Link>
            <Link
              href={`/tool/${toolB.slug}`}
              className={`px-6 py-4 rounded-xl ${gradientB} text-white font-mono text-sm font-medium text-center hover:opacity-90 transition-opacity`}
            >
              View {toolB.name} Details
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
