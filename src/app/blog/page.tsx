import Header from "@/components/Header";
import Footer from "@/components/Footer";
import blogData from "@/data/blog.json";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata = {
  title: "Blog - ENNA",
  description:
    "Weekly updates on new tools, categories, and features added to ENNA. Subscribe to the newsletter for Sunday updates.",
};

interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  content: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <article className="glass glass-hover card-glow rounded-xl p-8 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <time className="text-xs font-mono text-text-muted">
            {formatDate(post.date)}
          </time>
          <span className="text-border">|</span>
          <span className="text-xs font-mono text-text-muted">
            {post.author}
          </span>
        </div>

        <h2 className="font-mono font-semibold text-xl text-text-primary mb-3 leading-tight">
          {post.title}
        </h2>

        <p className="text-text-secondary leading-relaxed mb-6 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
          <span className="text-sm font-mono text-brand-400">Read more</span>
        </div>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  const posts = (blogData.posts as Post[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Weekly Updates
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Blog</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Weekly updates every Sunday. New tools, categories, features, and
            site improvements.
          </p>
        </div>

        <div className="mb-12">
          <NewsletterSignup />
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
