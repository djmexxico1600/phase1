/**
 * @file client.ts
 * @description Drizzle ORM client for Neon Postgres.
 * Uses @neondatabase/serverless for edge-compatible connections.
 * Supports read replicas via drizzle withReplicas() for scaling.
 */
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index";

// Enable connection cache for edge environments
neonConfig.fetchConnectionCache = true;

if (!process.env["NEON_DATABASE_URL"]) {
  throw new Error("NEON_DATABASE_URL environment variable is required");
}

const sql = neon(process.env["NEON_DATABASE_URL"]);

export const db = drizzle(sql, {
  schema,
  logger: process.env["NODE_ENV"] === "development",
});

export type Database = typeof db;

// Export schema for use in queries
export { schema };
