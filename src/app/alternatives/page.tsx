import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import alternativesData from "@/data/alternatives.json";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const metadata = {
  title: "Open-Source Alternatives - ENNA",
  description:
    "Open-source alternatives to commercial security tools. Free replacements for Maltego, Burp Suite, Cobalt Strike, Nessus, IDA Pro, and more.",
};

export default function AlternativesPage() {
  const tools = toolsData as Tool[];
  const toolMap = new Map(tools.map((t) => [t.slug, t]));

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Free &amp; Open Source
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Open-Source Alternatives</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Free, open-source replacements for the commercial security tools
            you know. Same capabilities, no license fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alternativesData.alternatives.map((alt) => {
            const altTools = alt.tools
              .map((slug) => toolMap.get(slug))
              .filter(Boolean) as Tool[];

            return (
              <Link
                key={alt.slug}
                href={`/alternatives/${alt.slug}`}
                className="block"
              >
                <div className="glass glass-hover card-glow rounded-xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-mono font-semibold text-lg text-text-primary">
                      {alt.commercial}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {altTools.length} alternatives
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                    {alt.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {altTools.slice(0, 5).map((t) => (
                      <span
                        key={t.slug}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-secondary border border-border text-xs font-mono text-text-muted"
                      >
                        {t.avatarUrl && (
                          <img src={t.avatarUrl} alt="" className="w-3.5 h-3.5 rounded" />
                        )}
                        {t.name}
                      </span>
                    ))}
                    {altTools.length > 5 && (
                      <span className="px-2 py-1 text-xs font-mono text-text-muted">
                        +{altTools.length - 5} more
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {alt.tags.map((tag) => (
                      <span key={tag} className="tag-pill text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
