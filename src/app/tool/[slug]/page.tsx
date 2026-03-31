import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import CopyButton from "@/components/CopyButton";
import { categories } from "@/data/categories";
import { enrichTool, formatStars, timeAgo } from "@/lib/github";
import { getCategoryColorScheme } from "@/lib/category-colors";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (toolsData as Tool[]).map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = (toolsData as Tool[]).find((t) => t.slug === slug);
  if (!tool) return { title: "Tool Not Found" };
  const category = categories.find((c) => c.id === tool.category);
  const pageTitle = `${tool.name} — ${category?.name || "Tools"}`;
  const pageDescription = `${tool.description} — ${tool.language} | ${tool.tags.slice(0, 3).join(", ")}`;
  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/tool/${tool.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

function PlatformBadge({ platform }: { platform: string }) {
  const icons: Record<string, string> = {
    linux: "🐧",
    macos: "🍎",
    windows: "🪟",
  };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-secondary border border-border text-xs font-mono">
      <span>{icons[platform] || "💻"}</span>
      <span className="text-text-secondary">{platform}</span>
    </span>
  );
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const baseTool = (toolsData as Tool[]).find((t) => t.slug === slug);
  if (!baseTool) notFound();

  const enriched = await enrichTool(baseTool);
  const tool = {
    ...enriched,
    website: enriched.website || enriched.homepageUrl || undefined,
  };
  const category = categories.find((c) => c.id === tool.category);

  const relatedTools = (toolsData as Tool[])
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 6);

  const alternativeTools = tool.alternatives
    ? (toolsData as Tool[]).filter((t) => tool.alternatives?.includes(t.slug))
    : [];

  const scheme = getCategoryColorScheme(tool.category);
  const gradientClass =
    scheme === "caution"
      ? "caution-gradient"
      : scheme === "danger"
        ? "danger-gradient"
        : "brand-gradient";
  const scanLineClass =
    scheme === "caution"
      ? "scan-line-caution"
      : scheme === "danger"
        ? "scan-line-danger"
        : "scan-line";
  const tagClass =
    scheme === "caution"
      ? "tag-pill-caution"
      : scheme === "danger"
        ? "tag-pill-danger"
        : "tag-pill";
  const accentColor =
    scheme === "caution"
      ? "text-caution-400"
      : scheme === "danger"
        ? "text-danger-400"
        : "text-brand-400";

  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.longDescription || tool.githubDescription || tool.description,
    applicationCategory: "SecurityApplication",
    operatingSystem: tool.platform.join(", "),
    url: `https://www.en-na.com/tool/${tool.slug}`,
    ...(tool.license && tool.license !== "NOASSERTION" ? { license: tool.license } : {}),
    ...(tool.stars ? { aggregateRating: { "@type": "AggregateRating", ratingValue: Math.min(5, Math.round((tool.stars / 1000) * 10) / 10 + 3), bestRating: 5, ratingCount: tool.stars } } : {}),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    downloadUrl: `https://github.com/${tool.github}`,
  };

  const displayDescription = tool.longDescription || tool.githubDescription || tool.description;

  const allTopics = [
    ...tool.tags,
    ...(tool.githubTopics?.filter((t) => !tool.tags.includes(t)) || []),
  ];

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
            <Link href="/" className="hover:text-brand-400 transition-colors">
              ENNA
            </Link>
            <span className="text-border">/</span>
            <Link
              href="/#tools"
              className="hover:text-brand-400 transition-colors"
            >
              Tools
            </Link>
            <span className="text-border">/</span>
            <Link
              href={`/#${tool.category}`}
              className="hover:text-brand-400 transition-colors"
            >
              {category?.name}
            </Link>
            <span className="text-border">/</span>
            <span className="text-text-secondary">{tool.name}</span>
          </nav>

          {/* Hero section */}
          <div className="glass rounded-2xl p-8 md:p-10 mb-8 relative overflow-hidden">
            <div className={scanLineClass} />

            {/* Top: Avatar + Name + Badges */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              {tool.avatarUrl ? (
                <img
                  src={tool.avatarUrl}
                  alt=""
                  className="w-20 h-20 rounded-xl border border-border"
                />
              ) : (
                <div className={`w-20 h-20 rounded-xl ${gradientClass} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-mono font-bold text-2xl">
                    {tool.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight">
                    {tool.name}
                  </h1>
                  {tool.featured && (
                    <span className={`px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider ${gradientClass} text-white`}>
                      Featured
                    </span>
                  )}
                  {tool.license && tool.license !== "NOASSERTION" && (
                    <span className="px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider bg-surface-secondary border border-border text-text-muted">
                      {tool.license}
                    </span>
                  )}
                </div>
                <p className="text-base text-text-secondary font-mono mb-1">
                  {category?.icon} {category?.name} · {tool.language}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-lg text-text-primary leading-relaxed">
                {displayDescription}
              </p>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-8 pb-8 border-b border-border">
              {tool.stars !== undefined && (
                <div className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-yellow-500"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-lg font-mono font-bold text-text-primary">
                    {formatStars(tool.stars)}
                  </span>
                  <span className="text-sm text-text-muted">stars</span>
                </div>
              )}
              {tool.forks !== undefined && (
                <div className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-text-muted"
                  >
                    <circle cx="12" cy="18" r="3" />
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="18" cy="6" r="3" />
                    <path d="M18 9v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9" />
                    <path d="M12 12v3" />
                  </svg>
                  <span className="text-lg font-mono font-bold text-text-primary">
                    {formatStars(tool.forks)}
                  </span>
                  <span className="text-sm text-text-muted">forks</span>
                </div>
              )}
              {tool.openIssues !== undefined && (
                <div className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-text-muted"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="text-lg font-mono font-bold text-text-primary">
                    {tool.openIssues}
                  </span>
                  <span className="text-sm text-text-muted">issues</span>
                </div>
              )}
              {tool.lastCommit && (
                <div className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-text-muted"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg>
                  <span className="text-sm text-text-muted">
                    Updated{" "}
                    <span className="text-text-primary font-semibold">
                      {timeAgo(tool.lastCommit)}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://github.com/${tool.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-lg ${gradientClass} text-white font-mono text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
              {tool.website && (
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg glass glass-hover text-text-primary font-mono text-sm inline-flex items-center gap-2"
                >
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
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  Official Website
                </a>
              )}
              {tool.documentation && (
                <a
                  href={tool.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg glass glass-hover text-text-primary font-mono text-sm inline-flex items-center gap-2"
                >
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
                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                  </svg>
                  Documentation
                </a>
              )}
              {tool.downloadUrl && (
                <a
                  href={tool.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg glass glass-hover text-text-primary font-mono text-sm inline-flex items-center gap-2"
                >
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
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </a>
              )}
              {tool.affiliateUrl && (
                <a
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`px-6 py-3 rounded-lg ${gradientClass} text-white font-mono text-sm inline-flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity`}
                >
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
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {tool.affiliateLabel || "Get Pro"}
                </a>
              )}
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Left column: Details + Install (spans 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Install section */}
              {(tool.installCommand || tool.installCommands) && (
                <div className="glass rounded-xl p-6">
                  <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                    Installation
                  </h2>

                  {tool.installCommands ? (
                    <div className="space-y-3">
                      {Object.entries(tool.installCommands).map(
                        ([method, cmd]) => (
                          <div key={method}>
                            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5">
                              {method}
                            </p>
                            <div className="bg-surface-base rounded-lg p-4 border border-border group relative">
                              <code className={`text-sm font-mono ${accentColor} break-all`}>
                                $ {cmd}
                              </code>
                              <CopyButton text={cmd} />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="bg-surface-base rounded-lg p-4 border border-border group relative">
                      <code className={`text-sm font-mono ${accentColor} break-all`}>
                        $ {tool.installCommand}
                      </code>
                      <CopyButton text={tool.installCommand || ""} />
                    </div>
                  )}
                </div>
              )}

              {/* Use cases */}
              {tool.useCases && tool.useCases.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                    Use Cases
                  </h2>
                  <ul className="space-y-3">
                    {tool.useCases.map((useCase, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${scheme === "caution" ? "bg-caution-500" : scheme === "danger" ? "bg-danger-500" : "bg-brand-500"} mt-2 flex-shrink-0`} />
                        <span className="text-sm text-text-secondary leading-relaxed">
                          {useCase}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {allTopics.map((tag) => (
                    <span key={tag} className={`${tagClass} text-sm`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Sidebar */}
            <div className="space-y-6">
              {/* Quick info */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                  Details
                </h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">
                      Category
                    </dt>
                    <dd className="text-sm font-mono text-text-primary">
                      {category?.icon} {category?.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">
                      Language
                    </dt>
                    <dd className="text-sm font-mono text-text-primary">
                      {tool.language}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">
                      Repository
                    </dt>
                    <dd>
                      <a
                        href={`https://github.com/${tool.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-mono ${accentColor} hover:opacity-80 transition-colors`}
                      >
                        {tool.github}
                      </a>
                    </dd>
                  </div>
                  {tool.license && tool.license !== "NOASSERTION" && (
                    <div>
                      <dt className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">
                        License
                      </dt>
                      <dd className="text-sm font-mono text-text-primary">
                        {tool.license}
                      </dd>
                    </div>
                  )}
                  {tool.platform && (
                    <div>
                      <dt className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">
                        Platforms
                      </dt>
                      <dd className="flex flex-wrap gap-1.5 mt-1">
                        {tool.platform.map((p) => (
                          <PlatformBadge key={p} platform={p} />
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Links */}
              <div className="glass rounded-xl p-6">
                <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                  Links
                </h2>
                <div className="space-y-2">
                  <a
                    href={`https://github.com/${tool.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-surface-secondary transition-colors group"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-text-muted group-hover:text-text-primary transition-colors"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-text-primary group-hover:text-brand-400 transition-colors truncate">
                        GitHub Repository
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        github.com/{tool.github}
                      </p>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-text-muted"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>

                  {tool.website && (
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-surface-secondary transition-colors group"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-text-muted group-hover:text-text-primary transition-colors"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-text-primary group-hover:text-brand-400 transition-colors truncate">
                          Official Website
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {tool.website.replace(/https?:\/\//, "").replace(/\/$/, "")}
                        </p>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-text-muted"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}

                  {tool.documentation && (
                    <a
                      href={tool.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-surface-secondary transition-colors group"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-text-muted group-hover:text-text-primary transition-colors"
                      >
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-text-primary group-hover:text-brand-400 transition-colors truncate">
                          Documentation
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {tool.documentation.replace(/https?:\/\//, "").replace(/\/$/, "")}
                        </p>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-text-muted"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}

                  {tool.downloadUrl && (
                    <a
                      href={tool.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-surface-secondary transition-colors group"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-text-muted group-hover:text-text-primary transition-colors"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-text-primary group-hover:text-brand-400 transition-colors truncate">
                          Download
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {tool.downloadUrl.replace(/https?:\/\//, "").replace(/\/$/, "")}
                        </p>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-text-muted"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}

                  <a
                    href={`https://github.com/${tool.github}/releases`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-surface-secondary transition-colors group"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-text-muted group-hover:text-text-primary transition-colors"
                    >
                      <polyline points="20 12 20 22 4 22 4 12" />
                      <rect x="2" y="7" width="20" height="5" />
                      <line x1="12" y1="22" x2="12" y2="7" />
                      <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
                      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-text-primary group-hover:text-brand-400 transition-colors truncate">
                        Releases
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        github.com/{tool.github}/releases
                      </p>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-text-muted"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>

                  <a
                    href={`https://github.com/${tool.github}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-surface-secondary transition-colors group"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-text-muted group-hover:text-text-primary transition-colors"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-text-primary group-hover:text-brand-400 transition-colors truncate">
                        Issues
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        github.com/{tool.github}/issues
                      </p>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-text-muted"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Ad slot */}
              <AdSlot provider="custom" placement="sidebar" />
            </div>
          </div>

          {/* Alternatives */}
          {alternativeTools.length > 0 && (
            <div className="mb-12">
              <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-6">
                Alternatives & Comparisons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alternativeTools.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/tool/${alt.slug}`}
                    className="glass glass-hover card-glow rounded-xl p-5 block"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-mono font-semibold text-sm">
                        {alt.name}
                      </h3>
                      <span className="text-xs font-mono text-text-muted">
                        {alt.language}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {alt.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related tools in same category */}
          {relatedTools.length > 0 && (
            <div>
              <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-6">
                More in {category?.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.map((rt) => (
                  <Link
                    key={rt.slug}
                    href={`/tool/${rt.slug}`}
                    className="glass glass-hover card-glow rounded-xl p-5 block"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-mono font-semibold text-sm">
                        {rt.name}
                      </h3>
                      <span className="text-xs font-mono text-text-muted">
                        {rt.language}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {rt.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {rt.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-secondary text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
