import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import kitsData from "@/data/kits.json";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";
import { formatStars } from "@/lib/github";

export function generateStaticParams() {
  return kitsData.kits.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = kitsData.kits.find((k) => k.slug === slug);
  if (!kit) return { title: "Not Found" };

  return {
    title: `${kit.title} - ENNA`,
    description: kit.description,
    openGraph: { title: kit.title, description: kit.description, type: "article" },
  };
}

export default async function KitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = kitsData.kits.find((k) => k.slug === slug);
  if (!kit) notFound();

  const tools = toolsData as Tool[];
  const toolMap = new Map(tools.map((t) => [t.slug, t]));

  const otherKits = kitsData.kits.filter((k) => k.slug !== slug);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">
            ENNA
          </Link>
          <span className="text-border">/</span>
          <Link href="/kits" className="hover:text-brand-400 transition-colors">
            Kits
          </Link>
          <span className="text-border">/</span>
          <span className="text-text-secondary">{kit.title}</span>
        </nav>

        <div className="glass rounded-2xl p-8 md:p-10 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{kit.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight">
                {kit.title}
              </h1>
              <p className="text-sm font-mono text-text-muted mt-1">
                {kit.difficulty} · {kit.tools.length} tools
              </p>
            </div>
          </div>
          <p className="text-lg text-text-secondary leading-relaxed">
            {kit.description}
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {kit.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                {section.title}
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                {section.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.tools.map((toolSlug) => {
                  const tool = toolMap.get(toolSlug);
                  if (!tool) return null;
                  return (
                    <Link
                      key={toolSlug}
                      href={`/tool/${toolSlug}`}
                      className="block"
                    >
                      <div className="glass glass-hover rounded-xl p-4 flex items-center gap-3">
                        {tool.avatarUrl ? (
                          <img
                            src={tool.avatarUrl}
                            alt=""
                            className="w-8 h-8 rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-mono text-[10px] font-bold">
                              {tool.name.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-mono text-text-primary">
                            {tool.name}
                          </span>
                          <span className="text-xs font-mono text-text-muted ml-2">
                            {tool.language}
                          </span>
                          {tool.stars !== undefined && (
                            <span className="text-xs font-mono text-yellow-500 ml-2">
                              {formatStars(tool.stars)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="text-center mb-12">
          <Link
            href={`/install?kit=${kit.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg brand-gradient text-white font-mono text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Install all {kit.tools.length} tools
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {otherKits.length > 0 && (
          <section>
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-6">
              Other Kits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherKits.slice(0, 3).map((k) => (
                <Link key={k.slug} href={`/kits/${k.slug}`} className="block">
                  <div className="glass glass-hover rounded-xl p-4 h-full">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{k.icon}</span>
                      <h3 className="font-mono font-semibold text-sm text-text-primary">
                        {k.title}
                      </h3>
                    </div>
                    <p className="text-xs text-text-muted font-mono">
                      {k.tools.length} tools
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
