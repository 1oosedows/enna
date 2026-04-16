"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Activity {
  type: "review" | "toolkit";
  username: string;
  avatar_url: string;
  tool_slug: string;
  detail: string | null;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function ActivityFeed() {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/activity")
      .then((res) => res.json())
      .then((data) => setActivity(data.activity || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || activity.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 mb-16">
      <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
        Community Activity
      </h2>
      <div className="glass rounded-xl divide-y divide-border">
        {activity.slice(0, 8).map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            {item.avatar_url && (
              <img
                src={item.avatar_url}
                alt=""
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0 text-sm font-mono">
              <Link
                href={`/u/${item.username}`}
                className="text-text-primary hover:text-brand-400 transition-colors"
              >
                {item.username}
              </Link>
              <span className="text-text-muted">
                {item.type === "review"
                  ? ` reviewed `
                  : ` added `}
              </span>
              <Link
                href={`/tool/${item.tool_slug}`}
                className="text-brand-400 hover:text-brand-300 transition-colors"
              >
                {item.tool_slug}
              </Link>
              {item.type === "review" && item.detail && (
                <span className="text-yellow-500 ml-1">
                  {"★".repeat(Number(item.detail))}
                </span>
              )}
              {item.type === "toolkit" && (
                <span className="text-text-muted"> to their toolkit</span>
              )}
            </div>
            <span className="text-xs font-mono text-text-muted flex-shrink-0">
              {timeAgo(item.created_at)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
