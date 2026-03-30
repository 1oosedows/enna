import Header from "@/components/Header";
import Footer from "@/components/Footer";
import libraryData from "@/data/library.json";
import Link from "next/link";

export const metadata = {
  title: "Library",
  description:
    "Curated books and hardware for OSINT, pentesting, and security research. Essential reading and tools for professionals.",
};

interface BookEdition {
  format: string;
  url: string;
}

interface Book {
  slug: string;
  title: string;
  author: string;
  description: string;
  category: string;
  tags: string[];
  imageTag: string;
  year: number;
  editions: BookEdition[];
}

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

const formatIcons: Record<string, string> = {
  Book: "📖",
  Paperback: "📖",
  Hardcover: "📕",
  Kindle: "📱",
};

function BookCard({ book }: { book: Book }) {
  return (
    <div className="glass glass-hover card-glow rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-16 rounded-lg brand-gradient opacity-60 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-mono text-xs font-bold">
            {book.imageTag}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-mono font-semibold text-text-primary text-sm leading-tight mb-1">
            {book.title}
          </h3>
          <p className="text-xs font-mono text-text-muted">{book.author}</p>
          <p className="text-xs font-mono text-text-muted mt-0.5">{book.year}</p>
        </div>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
        {book.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {book.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
          Available formats
        </p>
        <div className="flex flex-wrap gap-2">
          {book.editions.map((edition) => (
            <a
              key={edition.format}
              href={edition.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-xs font-mono text-text-secondary hover:text-emerald-400 transition-all"
            >
              <span>{formatIcons[edition.format] || "📖"}</span>
              <span>{edition.format}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function HardwareCard({ item }: { item: HardwareItem }) {
  const hasLink = !!item.amazonUrl;

  const content = (
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
        {hasLink ? (
          <a
            href={item.amazonUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-xs font-mono text-text-secondary hover:text-emerald-400 transition-all"
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
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Buy on Amazon
          </a>
        ) : (
          <span className="text-xs font-mono text-text-muted">
            Link coming soon
          </span>
        )}
        {item.relatedTool && (
          <Link
            href={`/tool/${item.relatedTool}`}
            className="ml-auto text-xs font-mono text-brand-400 hover:text-brand-300 transition-colors"
          >
            View Tool →
          </Link>
        )}
      </div>
    </div>
  );

  return content;
}

export default function LibraryPage() {
  const books = libraryData.books as Book[];
  const hardware = libraryData.hardware as HardwareItem[];

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Curated Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Library</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Essential books and hardware for security professionals. Hand-picked
            resources to complement your toolkit.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm font-mono text-text-muted">
              <span className="text-brand-400">{books.length}</span> books
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-text-muted">
              <span className="text-accent-400">{hardware.length}</span> hardware
            </div>
          </div>
        </div>

        {/* Books Section */}
        <section id="books" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg brand-gradient opacity-60 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-mono font-semibold text-xl text-text-primary">
                Books
              </h2>
              <p className="text-sm text-text-muted font-mono">
                {books.length} titles across security, OSINT, and blockchain
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book, i) => (
              <div
                key={book.slug}
                className="animate-slide-up"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </section>

        {/* Hardware Section */}
        <section id="hardware" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-accent-500/20 border border-accent-500/30 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a855a0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" />
                <line x1="20" y1="14" x2="23" y2="14" />
                <line x1="1" y1="9" x2="4" y2="9" />
                <line x1="1" y1="14" x2="4" y2="14" />
              </svg>
            </div>
            <div>
              <h2 className="font-mono font-semibold text-xl text-text-primary">
                Hardware
              </h2>
              <p className="text-sm text-text-muted font-mono">
                {hardware.length} devices for hands-on security research
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hardware.map((item, i) => (
              <div
                key={item.slug}
                className="animate-slide-up"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <HardwareCard item={item} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
