// Run with: npx tsx scripts/init-db.ts
import { initDb } from "../src/lib/db";

async function main() {
  console.log("Initializing database...");
  await initDb();
  console.log("Done. Tables created.");
}

main().catch(console.error);
