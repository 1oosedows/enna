import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import cheatsheetsData from "@/data/cheatsheets.json";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const metadata = {
  title: "Cheat Sheets - ENNA",
  description:
    "Quick-reference command cheat sheets for the most popular OSINT and security tools. Nmap, Hashcat, SQLMap, FFuf, and more.",
};

export default function CheatsheetsPage() {
  const tools = toolsData as Tool[];
  const toolMap = new Map(tools.map((t) => [t.slug, t]));

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Quick Reference
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Cheat Sheets</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Copy-paste command references for the tools you use every day.
            No fluff, just the flags you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cheatsheetsData.cheatsheets.map((cs) => {
            const tool = toolMap.get(cs.toolSlug);
            const cmdCount = cs.sections.reduce(
              (sum, s) => sum + s.commands.length,
              0
            );

            return (
              <Link
                key={cs.slug}
                href={`/cheatsheets/${cs.slug}`}
                className="block h-full"
              >
                <div className="glass glass-hover card-glow rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    {tool?.avatarUrl ? (
                      <img
                        src={tool.avatarUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg brand-gradient flex items-center justify-center">
                        <span className="text-white font-mono font-bold text-sm">
                          {cs.title.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h2 className="font-mono font-semibold text-text-primary">
                        {cs.title}
                      </h2>
                      <p className="text-xs font-mono text-text-muted">
                        {cs.sections.length} sections · {cmdCount} commands
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed flex-1">
                    {cs.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {cs.sections.slice(0, 3).map((s) => (
                      <span
                        key={s.title}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-secondary text-text-muted"
                      >
                        {s.title}
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
