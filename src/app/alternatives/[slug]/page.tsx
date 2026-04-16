import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import alternativesData from "@/data/alternatives.json";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";
import { formatStars, timeAgo } from "@/lib/github";

export function generateStaticParams() {
  return alternativesData.alternatives.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alt = alternativesData.alternatives.find((a) => a.slug === slug);
  if (!alt) return { title: "Not Found" };

  const title = `Open-Source Alternatives to ${alt.commercial} - ENNA`;
  const description = alt.description;

  return {
    title,
    description,
    openGraph: { title, description, url: `/alternatives/${slug}`, type: "article" },
  };
}

export default async function AlternativeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alt = alternativesData.alternatives.find((a) => a.slug === slug);
  if (!alt) notFound();

  const tools = toolsData as Tool[];
  const toolMap = new Map(tools.map((t) => [t.slug, t]));
  const altTools = alt.tools
    .map((s) => toolMap.get(s))
    .filter(Boolean) as Tool[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Open-Source Alternatives to ${alt.commercial}`,
    description: alt.description,
    url: `https://www.en-na.com/alternatives/${alt.slug}`,
    numberOfItems: altTools.length,
    itemListElement: altTools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: t.name,
        url: `https://www.en-na.com/tool/${t.slug}`,
      },
    })),
  };

  const otherAlts = alternativesData.alternatives.filter(
    (a) => a.slug !== slug
  );

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">
            ENNA
          </Link>
          <span className="text-border">/</span>
          <Link
            href="/alternatives"
            className="hover:text-brand-400 transition-colors"
          >
            Alternatives
          </Link>
          <span className="text-border">/</span>
          <span className="text-text-secondary">{alt.commercial}</span>
        </nav>

        <div className="glass rounded-2xl p-8 md:p-10 mb-8">
          <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight mb-4">
            Open-Source Alternatives to{" "}
            <span className="brand-gradient-text">{alt.commercial}</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-4">
            {alt.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {alt.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-12">
          {altTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tool/${tool.slug}`}
              className="block"
            >
              <div className="glass glass-hover rounded-xl p-6">
                <div className="flex items-start gap-4">
                  {tool.avatarUrl ? (
                    <img
                      src={tool.avatarUrl}
                      alt=""
                      className="w-12 h-12 rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg brand-gradient flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-mono font-bold text-sm">
                        {tool.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-mono font-semibold text-lg text-text-primary">
                        {tool.name}
                      </h2>
                      <span className="text-xs font-mono text-text-muted">
                        {tool.language}
                      </span>
                      {tool.stars !== undefined && (
                        <span className="text-xs font-mono text-yellow-500">
                          {formatStars(tool.stars)} stars
                        </span>
                      )}
                      {tool.lastCommit && (
                        <span className="text-xs font-mono text-text-muted">
                          {timeAgo(tool.lastCommit)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {tool.longDescription || tool.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tool.platform.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-secondary text-text-muted"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {otherAlts.length > 0 && (
          <section>
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-6">
              More Alternatives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherAlts.slice(0, 6).map((a) => (
                <Link
                  key={a.slug}
                  href={`/alternatives/${a.slug}`}
                  className="block"
                >
                  <div className="glass glass-hover rounded-xl p-4 h-full">
                    <h3 className="font-mono font-semibold text-sm text-text-primary mb-1">
                      {a.commercial}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {a.tools.length} open-source alternatives
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
