import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";
import guidesData from "@/data/guides.json";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

interface GuideStep {
  title: string;
  description: string;
  commands?: { label: string; command: string }[];
  output?: string;
  notes?: string;
}

interface Guide {
  slug: string;
  title: string;
  description: string;
  prerequisites: string[];
  steps: GuideStep[];
}

export function generateStaticParams() {
  return guidesData.guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = (guidesData.guides as Guide[]).find((g) => g.slug === slug);
  const tool = (toolsData as Tool[]).find((t) => t.slug === slug);
  if (!guide || !tool) return { title: "Not Found" };

  return {
    title: `How to Install and Use ${tool.name} - ENNA Guide`,
    description: guide.description,
    openGraph: {
      title: `How to Install and Use ${tool.name}`,
      description: guide.description,
      type: "article",
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = (guidesData.guides as Guide[]).find((g) => g.slug === slug);
  const tool = (toolsData as Tool[]).find((t) => t.slug === slug);
  if (!guide || !tool) notFound();

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <nav className="flex items-center gap-2 text-sm font-mono text-text-muted mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">
            ENNA
          </Link>
          <span>/</span>
          <Link
            href={`/tool/${slug}`}
            className="hover:text-brand-400 transition-colors"
          >
            {tool.name}
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Guide</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {tool.avatarUrl && (
              <img
                src={tool.avatarUrl}
                alt=""
                className="w-10 h-10 rounded-lg"
              />
            )}
            <div>
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
                Getting Started Guide
              </p>
              <h1 className="text-3xl md:text-4xl font-mono font-bold text-text-primary leading-tight">
                {guide.title}
              </h1>
            </div>
          </div>

          <p className="text-lg text-text-secondary leading-relaxed mb-6">
            {guide.description}
          </p>

          {guide.prerequisites.length > 0 && (
            <div className="glass rounded-xl p-5 mb-6">
              <h2 className="text-sm font-mono font-semibold text-text-muted uppercase tracking-wider mb-3">
                Prerequisites
              </h2>
              <ul className="space-y-1.5">
                {guide.prerequisites.map((pre, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="text-brand-400 mt-0.5">-</span>
                    <span>{pre}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tool.documentation && (
            <a
              href={tool.documentation}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Official Documentation
            </a>
          )}
        </header>

        <div className="space-y-8">
          {guide.steps.map((step, i) => (
            <section key={i} className="glass rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-mono font-bold text-sm">
                    {i + 1}
                  </span>
                </div>
                <h2 className="font-mono font-semibold text-xl text-text-primary pt-0.5">
                  {step.title}
                </h2>
              </div>

              <div className="ml-12">
                <p className="text-text-secondary leading-relaxed mb-4">
                  {step.description}
                </p>

                {step.commands &&
                  step.commands.map((cmd, j) => (
                    <div key={j} className="mb-4">
                      {cmd.label && (
                        <p className="text-xs font-mono text-text-muted mb-1.5">
                          {cmd.label}
                        </p>
                      )}
                      <div className="relative group">
                        <pre className="bg-surface-secondary border border-border rounded-lg p-4 overflow-x-auto">
                          <code className="text-sm font-mono text-brand-400">
                            {cmd.command}
                          </code>
                        </pre>
                        <div className="absolute top-2 right-2">
                          <CopyButton text={cmd.command} />
                        </div>
                      </div>
                    </div>
                  ))}

                {step.output && (
                  <div className="mb-4">
                    <p className="text-xs font-mono text-text-muted mb-1.5">
                      Example output
                    </p>
                    <pre className="bg-surface-secondary border border-border rounded-lg p-4 overflow-x-auto">
                      <code className="text-xs font-mono text-text-muted whitespace-pre">
                        {step.output}
                      </code>
                    </pre>
                  </div>
                )}

                {step.notes && (
                  <div className="px-4 py-3 rounded-lg bg-brand-500/5 border border-brand-500/20">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      <span className="text-brand-400 font-mono font-semibold">
                        Note:{" "}
                      </span>
                      {step.notes}
                    </p>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href={`/tool/${slug}`}
            className="flex-1 glass glass-hover rounded-xl p-5 text-center"
          >
            <span className="text-sm font-mono text-brand-400">
              Back to {tool.name}
            </span>
          </Link>
          {tool.documentation && (
            <a
              href={tool.documentation}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 glass glass-hover rounded-xl p-5 text-center"
            >
              <span className="text-sm font-mono text-brand-400">
                Full Documentation
              </span>
            </a>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
