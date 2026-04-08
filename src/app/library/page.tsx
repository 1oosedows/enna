import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import libraryData from "@/data/library.json";
import Link from "next/link";

export const metadata = {
  title: "Library - ENNA",
  description:
    "Curated books for OSINT, pentesting, and security research. Essential reading for professionals.",
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
  coverImage?: string;
}

const formatIcons: Record<string, string> = {
  Book: "📖",
  Paperback: "📖",
  Hardcover: "📕",
  Kindle: "📱",
};

function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/library/${book.slug}`} className="block h-full">
      <div className="glass glass-hover card-glow rounded-xl p-6 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              width={48}
              height={64}
              className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-16 rounded-lg brand-gradient opacity-60 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-mono text-xs font-bold">
                {book.imageTag}
              </span>
            </div>
          )}
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

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex gap-1.5">
            {book.editions.map((edition) => (
              <span
                key={edition.format}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-secondary text-[10px] font-mono text-text-muted"
              >
                {formatIcons[edition.format] || "📖"} {edition.format}
              </span>
            ))}
          </div>
          <span className="text-xs font-mono text-brand-400">View →</span>
        </div>
      </div>
    </Link>
  );
}

export default function LibraryPage() {
  const books = libraryData.books as Book[];

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
            Essential reading for security professionals. Hand-picked books
            to complement your toolkit.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm font-mono text-text-muted">
              <span className="text-brand-400">{books.length}</span> books
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
      </main>
      <Footer />
    </>
  );
}
