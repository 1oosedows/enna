import Header from "@/components/Header";
import Footer from "@/components/Footer";
import workflowData from "@/data/workflows.json";
import Link from "next/link";

export const metadata = {
  title: "Workflows - ENNA",
  description:
    "Step-by-step security workflows and playbooks linking tools in sequence. OSINT investigations, web app pentests, AD attack paths, crypto tracing, and more.",
};

interface Workflow {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  estimatedTime: string;
  tags: string[];
  steps: { title: string; tools: string[] }[];
}

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/30",
};

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const toolCount = workflow.steps.reduce(
    (sum, s) => sum + s.tools.length,
    0
  );

  return (
    <Link href={`/workflows/${workflow.slug}`} className="block h-full">
      <article className="glass glass-hover card-glow rounded-xl p-6 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg brand-gradient opacity-70 flex items-center justify-center flex-shrink-0 text-2xl">
            {workflow.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-mono font-semibold text-text-primary text-lg leading-tight mb-1">
              {workflow.title}
            </h2>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${difficultyColors[workflow.difficulty] || ""}`}
              >
                {workflow.difficulty}
              </span>
              <span className="text-xs font-mono text-text-muted">
                {workflow.estimatedTime}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
          {workflow.description}
        </p>

        <div className="flex items-center gap-4 pt-3 border-t border-border text-xs font-mono text-text-muted">
          <span>
            <span className="text-brand-400">{workflow.steps.length}</span>{" "}
            steps
          </span>
          <span>
            <span className="text-accent-400">{toolCount}</span> tools
          </span>
          <span className="ml-auto text-brand-400">View workflow</span>
        </div>
      </article>
    </Link>
  );
}

export default function WorkflowsPage() {
  const workflows = workflowData.workflows as Workflow[];

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Step-by-Step Guides
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Workflows</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Security playbooks that link tools together in the order you
            actually use them. Each step tells you what to do, which tool to
            use, and practical tips from real engagements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow, i) => (
            <div
              key={workflow.slug}
              className="animate-slide-up"
              style={{
                animationDelay: `${i * 80}ms`,
                animationFillMode: "both",
              }}
            >
              <WorkflowCard workflow={workflow} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
