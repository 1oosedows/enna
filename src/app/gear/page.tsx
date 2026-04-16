import Header from "@/components/Header";
import Footer from "@/components/Footer";
import libraryData from "@/data/library.json";
import Link from "next/link";

export const metadata = {
  title: "Gear - ENNA",
  description:
    "Curated hardware and devices for security professionals. Laptops, SDR equipment, RFID tools, WiFi adapters, and more.",
};

interface HardwareItem {
  slug: string;
  title: string;
  manufacturer: string;
  description: string;
  category: string;
  tags: string[];
  amazonUrl: string;
  imageTag: string;
  relatedTool?: string;
}

const categoryOrder = ["rf", "multi-tool", "rfid", "wireless", "laptop"];

const categoryLabels: Record<string, string> = {
  rf: "RF / SDR",
  "multi-tool": "Multi-Tools",
  rfid: "RFID / NFC",
  wireless: "WiFi Adapters",
  laptop: "Laptops",
};

const categoryIcons: Record<string, string> = {
  rf: "📡",
  "multi-tool": "🔧",
  rfid: "🏷",
  wireless: "📶",
  laptop: "💻",
};

function GearCard({ item }: { item: HardwareItem }) {
  return (
    <Link href={`/gear/${item.slug}`} className="block h-full">
      <div className="glass glass-hover card-glow rounded-xl p-6 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-accent-500/20 border border-accent-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-accent-400 font-mono text-xs font-bold">
              {item.imageTag}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-mono font-semibold text-text-primary text-sm leading-tight mb-1">
              {item.title}
            </h3>
            <p className="text-xs font-mono text-text-muted">
              {item.manufacturer}
            </p>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-border">
          <span className="text-xs font-mono text-brand-400">View Details</span>
          {item.relatedTool && (
            <span className="ml-auto text-xs font-mono text-accent-400">
              Related: {item.relatedTool}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function GearPage() {
  const hardware = libraryData.hardware as HardwareItem[];
  const categories = [...new Set(hardware.map((h) => h.category))];
  const sorted = categoryOrder.filter((c) => categories.includes(c));
  const remaining = categories.filter((c) => !sorted.includes(c));
  const allCats = [...sorted, ...remaining];

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
            Curated Hardware
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Gear</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Hardware and devices for security professionals. SDR equipment,
            pentest tools, WiFi adapters, and workstations.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm font-mono text-text-muted">
              <span className="text-accent-400">{hardware.length}</span> items
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-text-muted">
              <span className="text-brand-400">{allCats.length}</span>{" "}
              categories
            </div>
          </div>
        </div>

        {allCats.map((cat) => {
          const items = hardware.filter((h) => h.category === cat);
          return (
            <section key={cat} className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent-500/20 border border-accent-500/30 flex items-center justify-center">
                  <span className="text-lg">
                    {categoryIcons[cat] || "🔩"}
                  </span>
                </div>
                <div>
                  <h2 className="font-mono font-semibold text-xl text-text-primary">
                    {categoryLabels[cat] || cat}
                  </h2>
                  <p className="text-sm text-text-muted font-mono">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, i) => (
                  <div
                    key={item.slug}
                    className="animate-slide-up"
                    style={{
                      animationDelay: `${i * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <GearCard item={item} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        <div className="text-center mt-4">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass glass-hover text-sm font-mono text-text-secondary hover:text-brand-400 transition-colors"
          >
            Looking for books? Browse Library
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
