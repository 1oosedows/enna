import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.POSTGRES_URL!);
  return sql;
}

export async function initDb() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      github_id TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      tool_slug TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL CHECK (LENGTH(comment) >= 10 AND LENGTH(comment) <= 500),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(tool_slug, user_id)
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_reviews_tool ON reviews(tool_slug)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS toolkits (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      tool_slug TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, tool_slug)
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_toolkits_user ON toolkits(user_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_toolkits_tool ON toolkits(tool_slug)
  `;
}
