import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getDb } from "@/lib/db";
import { notifyNewReview } from "@/lib/discord";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

// GET /api/reviews?tool=slug
export async function GET(request: NextRequest) {
  const toolSlug = request.nextUrl.searchParams.get("tool");
  if (!toolSlug) {
    return NextResponse.json({ error: "tool parameter required" }, { status: 400 });
  }

  const sql = getDb();

  const reviews = await sql`
    SELECT r.id, r.rating, r.comment, r.created_at,
           u.username, u.avatar_url, u.github_id
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.tool_slug = ${toolSlug}
    ORDER BY r.created_at DESC
    LIMIT 50
  `;

  const stats = await sql`
    SELECT COUNT(*)::int as count,
           ROUND(AVG(rating), 1)::float as average
    FROM reviews
    WHERE tool_slug = ${toolSlug}
  `;

  return NextResponse.json({
    reviews,
    stats: stats[0] || { count: 0, average: 0 },
  });
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  const session = await getServerSession() as Record<string, unknown> | null;

  if (!session?.userId) {
    return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });
  }

  const body = await request.json();
  const { toolSlug, rating, comment } = body;

  if (!toolSlug || !rating || !comment) {
    return NextResponse.json({ error: "toolSlug, rating, and comment are required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  if (comment.length < 10 || comment.length > 500) {
    return NextResponse.json({ error: "Comment must be 10-500 characters" }, { status: 400 });
  }

  const sql = getDb();
  const userId = session.userId as number;

  try {
    const result = await sql`
      INSERT INTO reviews (tool_slug, user_id, rating, comment)
      VALUES (${toolSlug}, ${userId}, ${rating}, ${comment})
      ON CONFLICT (tool_slug, user_id)
      DO UPDATE SET rating = ${rating}, comment = ${comment}, created_at = NOW()
      RETURNING id
    `;

    // Discord notification (fire and forget)
    const userRows = await sql`SELECT username FROM users WHERE id = ${userId}`;
    const tool = (toolsData as Tool[]).find((t) => t.slug === toolSlug);
    if (userRows.length > 0 && tool) {
      notifyNewReview(userRows[0].username as string, toolSlug, tool.name, rating, comment);
    }

    return NextResponse.json({ id: result[0].id }, { status: 201 });
  } catch (error) {
    console.error("Review insert error:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
