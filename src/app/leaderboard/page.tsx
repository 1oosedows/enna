"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Reviewer {
  username: string;
  avatar_url: string;
  github_id: string;
  review_count: number;
  avg_rating: number;
}

interface Stats {
  total_users: number;
  total_reviews: number;
  tools_reviewed: number;
}

export default function LeaderboardPage() {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_reviews: 0,
    tools_reviewed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setReviewers(data.topReviewers);
        setStats(data.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <>
      <title>Community Leaderboard - ENNA</title>
      <meta
        name="description"
        content="Top ENNA community contributors. See who has reviewed the most tools and contributed the most to the index."
      />
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Community
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Leaderboard</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Top contributors to the ENNA community. Sign in and review tools to
            climb the ranks.
          </p>

          <div className="flex items-center justify-center gap-8 mt-8 font-mono text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold brand-gradient-text">
                {stats.total_users}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                Members
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {stats.total_reviews}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                Reviews
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-400">
                {stats.tools_reviewed}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                Tools Reviewed
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-text-muted font-mono">Loading...</p>
          </div>
        ) : reviewers.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-text-muted font-mono text-lg mb-2">
              No reviews yet
            </p>
            <p className="text-text-muted font-mono text-sm">
              Be the first to review a tool and claim the top spot.
            </p>
          </div>
        ) : (
          <div className="glass rounded-xl overflow-hidden">
            {reviewers.map((reviewer, i) => (
              <div
                key={reviewer.github_id}
                className={`flex items-center gap-4 px-6 py-4 ${
                  i < reviewers.length - 1 ? "border-b border-border" : ""
                } ${i < 3 ? "bg-brand-500/5" : ""}`}
              >
                <span className="text-lg w-8 text-center font-mono">
                  {i < 3 ? medals[i] : (
                    <span className="text-text-muted text-sm">{i + 1}</span>
                  )}
                </span>
                {reviewer.avatar_url && (
                  <img
                    src={reviewer.avatar_url}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <a
                    href={`https://github.com/${reviewer.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-text-primary hover:text-brand-400 transition-colors"
                  >
                    {reviewer.username}
                  </a>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-text-muted">
                    <span className="text-brand-400 font-semibold">
                      {reviewer.review_count}
                    </span>{" "}
                    reviews
                  </span>
                  <span className="text-yellow-500">
                    ★ {reviewer.avg_rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
