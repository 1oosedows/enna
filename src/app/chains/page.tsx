import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";
import chainsData from "@/data/chains.json";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const metadata = {
  title: "Tool Chains - ENNA",
  description:
    "Tools that work great together. Copy-paste command pipelines for recon, exploitation, OSINT, forensics, and more.",
};

export default function ChainsPage() {
  const tools = toolsData as Tool[];
  const toolMap = new Map(tools.map((t) => [t.slug, t]));

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Recipes
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Tool Chains</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Tools that work best together. Each chain is a copy-paste pipeline
            you can run right now.
          </p>
        </div>

        <div className="space-y-6">
          {chainsData.chains.map((chain) => {
            const chainTools = chain.tools
              .map((slug) => toolMap.get(slug))
              .filter(Boolean) as Tool[];

            return (
              <div key={chain.slug} className="glass rounded-xl p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-mono font-semibold text-lg text-text-primary mb-1">
                      {chain.title}
                    </h2>
                    <p className="text-sm text-text-secondary">
                      {chain.description}
                    </p>
                  </div>
                </div>

                {/* Tool flow */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {chainTools.map((tool, i) => (
                    <div key={tool.slug} className="flex items-center gap-2">
                      <Link
                        href={`/tool/${tool.slug}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border hover:border-brand-500/40 text-sm font-mono text-text-secondary hover:text-brand-400 transition-all"
                      >
                        {tool.avatarUrl && (
                          <img
                            src={tool.avatarUrl}
                            alt=""
                            className="w-4 h-4 rounded"
                          />
                        )}
                        {tool.name}
                      </Link>
                      {i < chainTools.length - 1 && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-brand-500/50"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>

                {/* Command */}
                <div className="bg-surface-base rounded-lg p-4 border border-border group relative">
                  <code className="text-sm font-mono text-brand-400 break-all whitespace-pre-wrap">
                    $ {chain.command}
                  </code>
                  <CopyButton text={chain.command} />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {chain.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-secondary text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
