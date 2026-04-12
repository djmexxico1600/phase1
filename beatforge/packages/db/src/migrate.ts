/**
 * @file migrate.ts
 * @description Runs Drizzle migrations against the database.
 * Used by CI/CD pipeline before deploying new code.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import path from "path";
import { fileURLToPath } from "url";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = process.env["NEON_DATABASE_URL_UNPOOLED"];
if (!url) {
  throw new Error("NEON_DATABASE_URL_UNPOOLED is required for migrations");
}

const sql = neon(url);
const db = drizzle(sql);

async function main(): Promise<void> {
  console.log("Running database migrations...");
  await migrate(db, {
    migrationsFolder: path.join(__dirname, "migrations"),
  });
  console.log("Migrations completed successfully.");
  process.exit(0);
}

main().catch((err: unknown) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
