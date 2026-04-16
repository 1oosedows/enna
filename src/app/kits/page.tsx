import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import kitsData from "@/data/kits.json";

export const metadata = {
  title: "Starter Kits - ENNA",
  description:
    "Pre-built tool collections for bug bounties, SOC analysts, crypto investigators, red teamers, OSINT researchers, and mobile pentesters.",
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function KitsPage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Curated Collections
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Starter Kits</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Pre-built tool collections for common security roles. Pick a kit,
            install the tools, and start working.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitsData.kits.map((kit) => (
            <Link key={kit.slug} href={`/kits/${kit.slug}`} className="block h-full">
              <div className="glass glass-hover card-glow rounded-xl p-6 h-full flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{kit.icon}</span>
                  <div>
                    <h2 className="font-mono font-semibold text-lg text-text-primary leading-tight">
                      {kit.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${difficultyColors[kit.difficulty] || ""}`}
                      >
                        {kit.difficulty}
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        {kit.tools.length} tools
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {kit.description}
                </p>
                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border">
                  <span className="text-xs font-mono text-brand-400">
                    View kit
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
