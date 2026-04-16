import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  const sql = getDb();

  const activity = await sql`
    (
      SELECT 'review' as type, u.username, u.avatar_url,
             r.tool_slug, r.rating::text as detail, r.created_at
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT 10
    )
    UNION ALL
    (
      SELECT 'toolkit' as type, u.username, u.avatar_url,
             t.tool_slug, NULL as detail, t.created_at
      FROM toolkits t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 10
    )
    ORDER BY created_at DESC
    LIMIT 15
  `;

  return NextResponse.json({ activity });
}
