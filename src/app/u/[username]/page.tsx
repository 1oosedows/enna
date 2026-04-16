import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDb } from "@/lib/db";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";
import { formatStars } from "@/lib/github";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return {
    title: `${username}'s Toolkit - ENNA`,
    description: `See what OSINT and security tools ${username} uses.`,
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const sql = getDb();

  const userRows = await sql`
    SELECT id, username, avatar_url, created_at FROM users WHERE username = ${username}
  `;
  if (userRows.length === 0) notFound();

  const user = userRows[0];

  const toolkitRows = await sql`
    SELECT tool_slug, created_at FROM toolkits
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `;

  const reviewRows = await sql`
    SELECT tool_slug, rating, comment, created_at FROM reviews
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `;

  const tools = toolsData as Tool[];
  const toolMap = new Map(tools.map((t) => [t.slug, t]));

  const toolkitTools = toolkitRows
    .map((r) => toolMap.get(r.tool_slug as string))
    .filter(Boolean) as Tool[];

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">
            ENNA
          </Link>
          <span className="text-border">/</span>
          <Link href="/leaderboard" className="hover:text-brand-400 transition-colors">
            Community
          </Link>
          <span className="text-border">/</span>
          <span className="text-text-secondary">{user.username}</span>
        </nav>

        {/* Profile header */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4">
            {user.avatar_url && (
              <img
                src={user.avatar_url as string}
                alt=""
                className="w-16 h-16 rounded-xl"
              />
            )}
            <div>
              <h1 className="text-2xl font-mono font-bold text-text-primary">
                {user.username}
              </h1>
              <div className="flex items-center gap-4 mt-1 text-sm font-mono text-text-muted">
                <span>{toolkitRows.length} tools</span>
                <span>{reviewRows.length} reviews</span>
                <a
                  href={`https://github.com/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Toolkit */}
        {toolkitTools.length > 0 && (
          <section className="mb-12">
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Toolkit ({toolkitTools.length} tools)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {toolkitTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tool/${tool.slug}`}
                  className="block"
                >
                  <div className="glass glass-hover rounded-xl p-4 flex items-center gap-3">
                    {tool.avatarUrl ? (
                      <img
                        src={tool.avatarUrl}
                        alt=""
                        className="w-8 h-8 rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-mono text-[10px] font-bold">
                          {tool.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-mono text-text-primary">
                        {tool.name}
                      </span>
                      <span className="text-xs font-mono text-text-muted ml-2">
                        {tool.language}
                      </span>
                    </div>
                    {tool.stars !== undefined && (
                      <span className="text-xs font-mono text-yellow-500">
                        {formatStars(tool.stars)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviewRows.length > 0 && (
          <section>
            <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Reviews ({reviewRows.length})
            </h2>
            <div className="space-y-3">
              {reviewRows.map((review, i) => {
                const tool = toolMap.get(review.tool_slug as string);
                return (
                  <div key={i} className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/tool/${review.tool_slug}`}
                        className="text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        {tool?.name || review.tool_slug}
                      </Link>
                      <span className="text-yellow-500 text-sm">
                        {"★".repeat(review.rating as number)}
                        {"☆".repeat(5 - (review.rating as number))}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {review.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
