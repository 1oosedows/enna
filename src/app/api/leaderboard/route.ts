import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const sql = getDb();

  // Top reviewers by number of reviews
  const topReviewers = await sql`
    SELECT u.username, u.avatar_url, u.github_id,
           COUNT(r.id)::int as review_count,
           ROUND(AVG(r.rating), 1)::float as avg_rating
    FROM users u
    JOIN reviews r ON u.id = r.user_id
    GROUP BY u.id, u.username, u.avatar_url, u.github_id
    ORDER BY review_count DESC
    LIMIT 20
  `;

  // Overall stats
  const stats = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM users) as total_users,
      (SELECT COUNT(*)::int FROM reviews) as total_reviews,
      (SELECT COUNT(DISTINCT tool_slug)::int FROM reviews) as tools_reviewed
  `;

  return NextResponse.json({
    topReviewers,
    stats: stats[0] || { total_users: 0, total_reviews: 0, tools_reviewed: 0 },
  });
}
