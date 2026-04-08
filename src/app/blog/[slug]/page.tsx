import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import blogData from "@/data/blog.json";

interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export function generateStaticParams() {
  return blogData.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (blogData.posts as Post[]).find((p) => p.slug === slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} - ENNA Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          className="space-y-2 mb-6 ml-4"
        >
          {listItems.map((item, idx) => (
            <li
              key={idx}
              className="text-text-secondary leading-relaxed flex gap-2"
            >
              <span className="text-brand-400 mt-1.5 flex-shrink-0">-</span>
              <span>{renderInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={`h2-${i}`}
          className="font-mono font-semibold text-xl text-text-primary mt-10 mb-4"
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={`h3-${i}`}
          className="font-mono font-semibold text-lg text-text-primary mt-8 mb-3"
        >
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p
          key={`p-${i}`}
          className="text-text-secondary leading-relaxed mb-4"
        >
          {renderInlineMarkdown(line)}
        </p>
      );
    }
    i++;
  }
  flushList();
  return elements;
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`(.+?)`/);

    let nextMatch: { index: number; full: string; inner: string; type: "bold" | "code" } | null = null;

    if (boldMatch && boldMatch.index !== undefined) {
      nextMatch = { index: boldMatch.index, full: boldMatch[0], inner: boldMatch[1], type: "bold" };
    }
    if (codeMatch && codeMatch.index !== undefined) {
      if (!nextMatch || codeMatch.index < nextMatch.index) {
        nextMatch = { index: codeMatch.index, full: codeMatch[0], inner: codeMatch[1], type: "code" };
      }
    }

    if (!nextMatch) {
      parts.push(remaining);
      break;
    }

    if (nextMatch.index > 0) {
      parts.push(remaining.slice(0, nextMatch.index));
    }

    if (nextMatch.type === "bold") {
      parts.push(
        <strong key={key++} className="text-text-primary font-semibold">
          {nextMatch.inner}
        </strong>
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-surface-secondary text-brand-400 font-mono text-sm"
        >
          {nextMatch.inner}
        </code>
      );
    }

    remaining = remaining.slice(nextMatch.index + nextMatch.full.length);
  }

  return parts;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = blogData.posts as Post[];
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentIdx = sorted.findIndex((p) => p.slug === slug);
  const prevPost = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;
  const nextPost = currentIdx > 0 ? sorted[currentIdx - 1] : null;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <nav className="flex items-center gap-2 text-sm font-mono text-text-muted mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">
            ENNA
          </Link>
          <span>/</span>
          <Link
            href="/blog"
            className="hover:text-brand-400 transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-text-secondary truncate">{post.title}</span>
        </nav>

        <article>
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <time className="text-sm font-mono text-text-muted">
                {formatDate(post.date)}
              </time>
              <span className="text-border">|</span>
              <span className="text-sm font-mono text-text-muted">
                {post.author}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-mono font-bold text-text-primary leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="glass rounded-2xl p-8 md:p-10 mb-10">
            {renderContent(post.content)}
          </div>
        </article>

        <div className="mb-10">
          <NewsletterSignup />
        </div>

        <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="block">
              <div className="glass glass-hover rounded-xl p-5">
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Previous
                </span>
                <p className="font-mono font-semibold text-sm text-text-primary mt-1 leading-tight">
                  {prevPost.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="block">
              <div className="glass glass-hover rounded-xl p-5 text-right">
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Next
                </span>
                <p className="font-mono font-semibold text-sm text-text-primary mt-1 leading-tight">
                  {nextPost.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>
      <Footer />
    </>
  );
}
