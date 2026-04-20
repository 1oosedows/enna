import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { notifyToolkitAdd } from "@/lib/discord";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

// GET /api/toolkit?user=username OR /api/toolkit?tool=slug
export async function GET(request: NextRequest) {
  const sql = getDb();
  const toolSlug = request.nextUrl.searchParams.get("tool");
  const username = request.nextUrl.searchParams.get("user");

  if (toolSlug) {
    // Get use count + whether current user uses it
    const session = await getServerSession() as Record<string, unknown> | null;

    const countResult = await sql`
      SELECT COUNT(*)::int as count FROM toolkits WHERE tool_slug = ${toolSlug}
    `;

    let userUses = false;
    if (session?.userId) {
      const userResult = await sql`
        SELECT 1 FROM toolkits WHERE tool_slug = ${toolSlug} AND user_id = ${session.userId as number}
      `;
      userUses = userResult.length > 0;
    }

    return NextResponse.json({
      count: countResult[0]?.count ?? 0,
      userUses,
    });
  }

  if (username) {
    // Get a user's full toolkit
    const rows = await sql`
      SELECT t.tool_slug, t.created_at
      FROM toolkits t
      JOIN users u ON t.user_id = u.id
      WHERE u.username = ${username}
      ORDER BY t.created_at DESC
    `;

    const userRows = await sql`
      SELECT username, avatar_url, created_at
      FROM users WHERE username = ${username}
    `;

    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: userRows[0],
      tools: rows,
    });
  }

  return NextResponse.json({ error: "Provide ?tool=slug or ?user=username" }, { status: 400 });
}

// POST /api/toolkit — toggle a tool in the user's toolkit
export async function POST(request: NextRequest) {
  const session = await getServerSession() as Record<string, unknown> | null;

  if (!session?.userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  // Rate limit: 20 toolkit toggles per minute per user
  const { ok } = rateLimit(`toolkit:${session.userId}`, 20, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  const { toolSlug } = await request.json();
  if (!toolSlug) {
    return NextResponse.json({ error: "toolSlug required" }, { status: 400 });
  }

  const sql = getDb();
  const userId = session.userId as number;

  // Check if already in toolkit
  const existing = await sql`
    SELECT id FROM toolkits WHERE user_id = ${userId} AND tool_slug = ${toolSlug}
  `;

  if (existing.length > 0) {
    // Remove
    await sql`DELETE FROM toolkits WHERE user_id = ${userId} AND tool_slug = ${toolSlug}`;
    return NextResponse.json({ added: false });
  } else {
    // Add
    await sql`INSERT INTO toolkits (user_id, tool_slug) VALUES (${userId}, ${toolSlug})`;

    // Discord notification (fire and forget)
    const userRows = await sql`SELECT username FROM users WHERE id = ${userId}`;
    const tool = (toolsData as Tool[]).find((t) => t.slug === toolSlug);
    if (userRows.length > 0 && tool) {
      notifyToolkitAdd(userRows[0].username as string, toolSlug, tool.name);
    }

    return NextResponse.json({ added: true });
  }
}
