import { Metadata } from "next";
import Link from "next/link";
import toolsData from "@/data/tools.json";
import { categories } from "@/data/categories";
import { Tool } from "@/types";
import { formatStars } from "@/lib/github";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import StackCopyButton from "./StackCopyButton";

const tools = toolsData as Tool[];

interface Props {
  params: Promise<{ slugs: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const slugList = slugs.split(",").map((s) => s.trim());
  const validTools = tools.filter((t) => slugList.includes(t.slug));
  return {
    title: `Custom Stack: ${validTools.length} tools | ENNA`,
    description: `A curated security tool stack featuring ${validTools.map((t) => t.name).slice(0, 5).join(", ")}${validTools.length > 5 ? " and more" : ""}.`,
  };
}

export function generateStaticParams() {
  return [];
}

export default async function StackViewPage({ params }: Props) {
  const { slugs } = await params;
  const slugList = slugs.split(",").map((s) => s.trim());
  const validTools = tools.filter((t) => slugList.includes(t.slug));

  if (validTools.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center py-20">
            <h1 className="text-2xl font-mono font-bold text-text-primary mb-4">
              No valid tools found
            </h1>
            <p className="text-text-secondary mb-6">
              The slugs in this URL didn&apos;t match any tools in our directory.
            </p>
            <Link
              href="/stack"
              className="inline-flex px-4 py-2 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-mono hover:bg-brand-500/20 transition-colors"
            >
              Build a Stack
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const totalStars = validTools.reduce((sum, t) => sum + (t.stars ?? 0), 0);
  const categoriesUsed = new Set(validTools.map((t) => t.category));
  const languagesUsed = new Set(validTools.map((t) => t.language));
  const editUrl = `/stack?tools=${validTools.map((t) => t.slug).join(",")}`;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-xl p-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-2xl font-mono font-bold">
                  <span className="brand-gradient-text">Custom Stack</span>
                </h1>
                <p className="text-text-secondary mt-1 text-sm">
                  A curated selection of {validTools.length} security {validTools.length === 1 ? "tool" : "tools"}.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={editUrl}
                  className="px-4 py-2 rounded-lg bg-surface-secondary border border-border text-text-secondary text-sm font-mono hover:text-brand-400 transition-colors"
                >
                  Edit Stack
                </Link>
                <StackCopyButton />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-surface-secondary rounded-lg p-4 text-center">
                <div className="text-2xl font-mono font-bold text-brand-400">{validTools.length}</div>
                <div className="text-xs font-mono text-text-muted mt-1">Tools</div>
              </div>
              <div className="bg-surface-secondary rounded-lg p-4 text-center">
                <div className="text-2xl font-mono font-bold text-brand-400">
                  {totalStars > 0 ? formatStars(totalStars) : "—"}
                </div>
                <div className="text-xs font-mono text-text-muted mt-1">Total Stars</div>
              </div>
              <div className="bg-surface-secondary rounded-lg p-4 text-center">
                <div className="text-2xl font-mono font-bold text-brand-400">{categoriesUsed.size}</div>
                <div className="text-xs font-mono text-text-muted mt-1">Categories</div>
              </div>
              <div className="bg-surface-secondary rounded-lg p-4 text-center">
                <div className="text-2xl font-mono font-bold text-brand-400">{languagesUsed.size}</div>
                <div className="text-xs font-mono text-text-muted mt-1">Languages</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validTools.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
