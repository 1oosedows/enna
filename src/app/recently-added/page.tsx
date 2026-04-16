import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import toolsData from "@/data/tools.json";
import blogData from "@/data/blog.json";
import libraryData from "@/data/library.json";
import { Tool, Book } from "@/types";
import { LAUNCH_TOOL_COUNT } from "@/lib/constants";
import Link from "next/link";

export const metadata = {
  title: "Recently Added - ENNA",
  description:
    "The latest tools, books, and updates added to ENNA. See what's new this week and browse recent additions to the index.",
};

export default function RecentlyAddedPage() {
  const tools = toolsData as Tool[];
  const newTools = tools.slice(LAUNCH_TOOL_COUNT);
  const recentlyUpdated = [...tools]
    .filter((t) => t.lastCommit)
    .sort(
      (a, b) =>
        new Date(b.lastCommit!).getTime() - new Date(a.lastCommit!).getTime()
    )
    .slice(0, 12);

  const posts = blogData.posts
    .slice()
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const books = libraryData.books as Book[];

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            What&apos;s New
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Recently Added</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Everything new on ENNA. New tools, new books, and the latest
            updates.
          </p>
        </div>

        {/* New Tools */}
        {newTools.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg brand-gradient opacity-70 flex items-center justify-center">
                <span className="text-white text-lg">+</span>
              </div>
              <div>
                <h2 className="font-mono font-semibold text-xl text-text-primary">
                  New Tools
                </h2>
                <p className="text-sm text-text-muted font-mono">
                  {newTools.length} tools added since launch
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newTools.map((tool, i) => (
                <div
                  key={tool.slug}
                  className="animate-slide-up"
                  style={{
                    animationDelay: `${i * 30}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <ToolCard tool={tool} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recently Updated (by GitHub activity) */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-400 text-lg">~</span>
            </div>
            <div>
              <h2 className="font-mono font-semibold text-xl text-text-primary">
                Most Active Tools
              </h2>
              <p className="text-sm text-text-muted font-mono">
                Tools with the most recent GitHub activity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyUpdated.map((tool, i) => (
              <div
                key={tool.slug}
                className="animate-slide-up"
                style={{
                  animationDelay: `${i * 30}ms`,
                  animationFillMode: "both",
                }}
              >
                <ToolCard tool={tool} index={i} />
              </div>
            ))}
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-500/20 border border-accent-500/30 flex items-center justify-center">
                <span className="text-accent-400 text-lg">@</span>
              </div>
              <div>
                <h2 className="font-mono font-semibold text-xl text-text-primary">
                  Latest Updates
                </h2>
                <p className="text-sm text-text-muted font-mono">
                  From the blog
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all posts
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.slice(0, 4).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <div className="glass glass-hover rounded-xl p-6 h-full">
                  <time className="text-xs font-mono text-text-muted">
                    {new Date(post.date + "T12:00:00Z").toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                  <h3 className="font-mono font-semibold text-text-primary mt-2 mb-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Books */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
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
                  Latest Books
                </h2>
                <p className="text-sm text-text-muted font-mono">
                  Recently added to the library
                </p>
              </div>
            </div>
            <Link
              href="/library"
              className="text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors"
            >
              View full library
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {books.slice(-8).reverse().map((book) => (
              <Link
                key={book.slug}
                href={`/library/${book.slug}`}
                className="block"
              >
                <div className="glass glass-hover rounded-xl p-4 h-full">
                  <div className="flex items-center gap-3 mb-2">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt=""
                        className="w-8 h-11 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-11 rounded brand-gradient opacity-60 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-mono text-[8px] font-bold">
                          {book.imageTag}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-mono font-semibold text-text-primary text-xs leading-tight truncate">
                        {book.title}
                      </h3>
                      <p className="text-[10px] font-mono text-text-muted mt-0.5">
                        {book.author}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
