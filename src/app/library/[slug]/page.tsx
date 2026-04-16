import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import libraryData from "@/data/library.json";
import { Book } from "@/types";

export function generateStaticParams() {
  return libraryData.books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = (libraryData.books as Book[]).find((b) => b.slug === slug);
  if (!book) return { title: "Not Found" };

  return {
    title: `${book.title} - Library`,
    description: `${book.description} By ${book.author}.`,
    openGraph: {
      title: `${book.title} - ENNA Library`,
      description: book.description,
      type: "article",
    },
  };
}

const formatIcons: Record<string, string> = {
  Book: "📖",
  Paperback: "📖",
  Hardcover: "📕",
  Kindle: "📱",
};

const categoryLabels: Record<string, string> = {
  osint: "OSINT",
  exploitation: "Exploitation",
  "red-team": "Red Team",
  "blue-team": "Blue Team",
  forensics: "Forensics",
  "web-security": "Web Security",
  pentesting: "Penetration Testing",
  network: "Network Security",
  malware: "Malware Analysis",
  "social-engineering": "Social Engineering",
  privacy: "Privacy",
  blockchain: "Blockchain",
  "crypto-forensics": "Crypto Forensics",
  programming: "Programming",
  rf: "RF / Wireless",
  networking: "Networking",
  hacking: "Hacking",
  implant: "Implants",
  laptop: "Laptops",
};

export default async function LibraryItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const book = (libraryData.books as Book[]).find((b) => b.slug === slug);
  if (!book) notFound();

  return <BookDetail book={book} />;
}

function BookDetail({ book }: { book: Book }) {
  const relatedBooks = (libraryData.books as Book[])
    .filter(
      (b) =>
        b.slug !== book.slug &&
        (b.category === book.category ||
          b.author.split(" & ")[0] === book.author.split(" & ")[0])
    )
    .slice(0, 4);

  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    datePublished: String(book.year),
    description: book.longDescription || book.description,
    url: `https://www.en-na.com/library/${book.slug}`,
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.publisher ? { publisher: { "@type": "Organization", name: book.publisher } } : {}),
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <Breadcrumb title={book.title} />

        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  width={192}
                  height={256}
                  className="w-48 h-64 rounded-xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-48 h-64 rounded-xl brand-gradient opacity-70 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-white font-mono text-3xl font-bold mb-2">
                    {book.imageTag}
                  </span>
                  <span className="text-white/60 font-mono text-xs">
                    {book.year}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider brand-gradient text-white">
                  {categoryLabels[book.category] || book.category}
                </span>
                <span className="text-xs font-mono text-text-muted">
                  {book.year}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-mono font-bold text-text-primary mb-3 leading-tight">
                {book.title}
              </h1>

              <p className="text-lg font-mono text-text-secondary mb-4">
                by {book.author}
              </p>

              <p className="text-text-secondary leading-relaxed mb-6">
                {book.longDescription || book.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {book.tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-3">
                  Available formats
                </p>
                <div className="flex flex-wrap gap-3">
                  {book.editions.map((edition) => (
                    <a
                      key={edition.format}
                      href={edition.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-surface-secondary border border-border hover:border-emerald-500/40 hover:bg-emerald-500/10 text-sm font-mono text-text-secondary hover:text-emerald-400 transition-all"
                    >
                      <span className="text-lg">
                        {formatIcons[edition.format] || "📖"}
                      </span>
                      <span>{edition.format}</span>
                      <ExternalIcon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                Book Details
              </h2>
              <dl className="space-y-3">
                <DetailRow label="Author" value={book.author} />
                <DetailRow label="Year" value={String(book.year)} />
                <DetailRow label="Category" value={categoryLabels[book.category] || book.category} />
                {book.publisher && <DetailRow label="Publisher" value={book.publisher} />}
                {book.isbn && <DetailRow label="ISBN" value={book.isbn} />}
                <DetailRow label="Formats" value={book.editions.map((e) => e.format).join(", ")} last />
              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
                Get This Book
              </h2>
              <div className="space-y-2">
                {book.editions.map((edition) => (
                  <a
                    key={edition.format}
                    href={edition.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-surface-secondary border border-border hover:border-emerald-500/40 hover:bg-emerald-500/10 text-sm font-mono text-text-secondary hover:text-emerald-400 transition-all"
                  >
                    <span>{formatIcons[edition.format] || "📖"}</span>
                    <span className="flex-1">{edition.format}</span>
                    <span className="text-text-muted">Amazon →</span>
                  </a>
                ))}
              </div>
            </div>
            <BackToLibrary />
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <section>
            <h2 className="font-mono font-semibold text-lg text-text-primary mb-6">
              Related Books
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedBooks.map((related) => (
                <Link
                  key={related.slug}
                  href={`/library/${related.slug}`}
                  className="block"
                >
                  <div className="glass glass-hover rounded-xl p-4 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-14 rounded-lg brand-gradient opacity-60 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-mono text-[10px] font-bold">
                          {related.imageTag}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-mono font-semibold text-text-primary text-xs leading-tight truncate">
                          {related.title}
                        </h3>
                        <p className="text-[10px] font-mono text-text-muted mt-0.5">
                          {related.author}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {related.description}
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

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm font-mono text-text-muted mb-8">
      <Link href="/" className="hover:text-brand-400 transition-colors">
        ENNA
      </Link>
      <span>/</span>
      <Link href="/library" className="hover:text-brand-400 transition-colors">
        Library
      </Link>
      <span>/</span>
      <span className="text-text-secondary truncate">{title}</span>
    </nav>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${last ? "" : "border-b border-border"}`}>
      <dt className="text-sm font-mono text-text-muted">{label}</dt>
      <dd className="text-sm font-mono text-text-primary">{value}</dd>
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-50"
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function BackToLibrary() {
  return (
    <div className="glass rounded-xl p-6">
      <Link
        href="/library"
        className="flex items-center gap-2 text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Browse all books
      </Link>
    </div>
  );
}
