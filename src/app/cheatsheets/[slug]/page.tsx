import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";
import cheatsheetsData from "@/data/cheatsheets.json";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export function generateStaticParams() {
  return cheatsheetsData.cheatsheets.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = cheatsheetsData.cheatsheets.find((c) => c.slug === slug);
  if (!cs) return { title: "Not Found" };

  return {
    title: `${cs.title} - ENNA`,
    description: cs.description,
    openGraph: { title: cs.title, description: cs.description, type: "article" },
  };
}

export default async function CheatsheetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = cheatsheetsData.cheatsheets.find((c) => c.slug === slug);
  if (!cs) notFound();

  const tools = toolsData as Tool[];
  const tool = tools.find((t) => t.slug === cs.toolSlug);

  const otherSheets = cheatsheetsData.cheatsheets.filter(
    (c) => c.slug !== slug
  );

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">
            ENNA
          </Link>
          <span className="text-border">/</span>
          <Link
            href="/cheatsheets"
            className="hover:text-brand-400 transition-colors"
          >
            Cheat Sheets
          </Link>
          <span className="text-border">/</span>
          <span className="text-text-secondary">{cs.title}</span>
        </nav>

        <div className="glass rounded-2xl p-8 md:p-10 mb-8">
          <div className="flex items-center gap-4 mb-4">
            {tool?.avatarUrl ? (
              <img src={tool.avatarUrl} alt="" className="w-14 h-14 rounded-xl" />
            ) : (
              <div className="w-14 h-14 rounded-xl brand-gradient flex items-center justify-center">
                <span className="text-white font-mono font-bold text-xl">
                  {cs.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight">
                {cs.title}
              </h1>
              <p className="text-sm font-mono text-text-muted mt-1">
                {cs.description}
              </p>
            </div>
          </div>
          {tool && (
            <Link
              href={`/tool/${tool.slug}`}
              className="inline-flex items-center gap-2 text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors"
            >
              View {tool.name} tool page
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>

        <div className="space-y-8 mb-12">
          {cs.sections.map((section) => (
            <section key={section.title} className="glass rounded-xl p-6">
              <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.commands.map((cmd, i) => (
                  <div
                    key={i}
                    className="bg-surface-base rounded-lg p-4 border border-border group relative"
                  >
                    <p className="text-xs text-text-muted font-mono mb-2">
                      {cmd.description}
                    </p>
                    <code className="text-sm font-mono text-brand-400 break-all">
                      $ {cmd.command}
                    </code>
                    <CopyButton text={cmd.command} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {otherSheets.length > 0 && (
          <section>
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-6">
              More Cheat Sheets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherSheets.slice(0, 6).map((c) => (
                <Link
                  key={c.slug}
                  href={`/cheatsheets/${c.slug}`}
                  className="block"
                >
                  <div className="glass glass-hover rounded-xl p-4 h-full">
                    <h3 className="font-mono font-semibold text-sm text-text-primary">
                      {c.title}
                    </h3>
                    <p className="text-xs text-text-muted font-mono mt-1">
                      {c.sections.length} sections
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
