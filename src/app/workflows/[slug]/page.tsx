import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import workflowData from "@/data/workflows.json";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

interface Step {
  title: string;
  description: string;
  tools: string[];
  tips: string;
}

interface Workflow {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  estimatedTime: string;
  tags: string[];
  steps: Step[];
}

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/30",
};

export function generateStaticParams() {
  return workflowData.workflows.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workflow = (workflowData.workflows as Workflow[]).find(
    (w) => w.slug === slug
  );
  if (!workflow) return { title: "Not Found" };

  return {
    title: `${workflow.title} - ENNA Workflows`,
    description: workflow.description,
    openGraph: {
      title: workflow.title,
      description: workflow.description,
      type: "article",
    },
  };
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workflows = workflowData.workflows as Workflow[];
  const workflow = workflows.find((w) => w.slug === slug);
  if (!workflow) notFound();

  const tools = toolsData as Tool[];
  const toolMap = new Map(tools.map((t) => [t.slug, t]));

  const totalTools = workflow.steps.reduce(
    (sum, s) => sum + s.tools.length,
    0
  );

  const otherWorkflows = workflows
    .filter((w) => w.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <nav className="flex items-center gap-2 text-sm font-mono text-text-muted mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">
            ENNA
          </Link>
          <span>/</span>
          <Link
            href="/workflows"
            className="hover:text-brand-400 transition-colors"
          >
            Workflows
          </Link>
          <span>/</span>
          <span className="text-text-secondary truncate">
            {workflow.title}
          </span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{workflow.icon}</span>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${difficultyColors[workflow.difficulty] || ""}`}
              >
                {workflow.difficulty}
              </span>
              <span className="text-sm font-mono text-text-muted">
                {workflow.estimatedTime}
              </span>
              <span className="text-border">|</span>
              <span className="text-sm font-mono text-text-muted">
                {workflow.steps.length} steps, {totalTools} tools
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text-primary leading-tight mb-4">
            {workflow.title}
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed">
            {workflow.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {workflow.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="space-y-6 mb-16">
          {workflow.steps.map((step, i) => (
            <div key={i} className="glass rounded-xl p-6 md:p-8 relative">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg brand-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-mono font-bold text-sm">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h2 className="font-mono font-semibold text-xl text-text-primary">
                    {step.title}
                  </h2>
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed mb-5 ml-14">
                {step.description}
              </p>

              {step.tools.length > 0 && (
                <div className="ml-14 mb-5">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-3">
                    Tools for this step
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.tools.map((toolSlug) => {
                      const tool = toolMap.get(toolSlug);
                      if (!tool) return null;
                      return (
                        <Link
                          key={toolSlug}
                          href={`/tool/${toolSlug}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-secondary border border-border hover:border-brand-500/40 hover:bg-brand-500/5 text-sm font-mono text-text-secondary hover:text-brand-400 transition-all"
                        >
                          {tool.avatarUrl && (
                            <img
                              src={tool.avatarUrl}
                              alt=""
                              className="w-5 h-5 rounded"
                            />
                          )}
                          {tool.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {step.tips && (
                <div className="ml-14 px-4 py-3 rounded-lg bg-brand-500/5 border border-brand-500/20">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    <span className="text-brand-400 font-mono font-semibold">
                      Tip:{" "}
                    </span>
                    {step.tips}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {otherWorkflows.length > 0 && (
          <section>
            <h2 className="font-mono font-semibold text-lg text-text-primary mb-6">
              Other Workflows
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherWorkflows.map((w) => (
                <Link key={w.slug} href={`/workflows/${w.slug}`} className="block">
                  <div className="glass glass-hover rounded-xl p-5 h-full">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{w.icon}</span>
                      <h3 className="font-mono font-semibold text-sm text-text-primary leading-tight">
                        {w.title}
                      </h3>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {w.description}
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
