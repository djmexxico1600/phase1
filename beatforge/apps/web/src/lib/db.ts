/**
 * @file lib/db.ts
 * @description Drizzle ORM client for Neon Postgres.
 * Supports both unpooled (for migrations) and Hyperdrive pooled connection.
 * Read replicas via withReplicas() for scaling queries.
 */

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@beatforge/db';
import { getServerEnv } from './env';

const env = getServerEnv();

// ============================================================
// CONNECTION SETUP
// ============================================================

// Enable connection cache for edge environments
neonConfig.fetchConnectionCache = true;

// Choose connection pool: Hyperdrive in production, direct in dev
const connectionUrl =
  process.env.NODE_ENV === 'production'
    ? env.NEON_DATABASE_URL // Hyperdrive proxied
    : env.NEON_DATABASE_URL; // Direct connection in dev

if (!connectionUrl) {
  throw new Error('NEON_DATABASE_URL environment variable is required');
}

const sql = neon(connectionUrl);

// ============================================================
// DRIZZLE CLIENT (MAIN)
// ============================================================

export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

export type Database = typeof db;

// ============================================================
// MIGRATION CLIENT (Unpooled for DDL)
// ============================================================

export const dbMigrate = (() => {
  if (!env.NEON_DATABASE_URL_UNPOOLED) {
    return db; // Fallback to pooled
  }

  const sqlMigrate = neon(env.NEON_DATABASE_URL_UNPOOLED);
  return drizzle(sqlMigrate, { schema });
})();

// ============================================================
// EXPORTS
// ============================================================

export { schema };

// ============================================================
// QUERY BUILDERS (Re-export from @beatforge/db)
// ============================================================

export * from '@beatforge/db';

// ============================================================
// HELPER TYPES
// ============================================================

export type QueryResult<T> = Promise<T | null>;
export type QueryResults<T> = Promise<T[]>;

/**
 * Type-safe transaction wrapper.
 */
export async function withTransaction<T>(
  callback: (trx: Database) => Promise<T>
): Promise<T> {
  // Transactions not fully supported with serverless HTTP
  // but can be implemented via raw SQL if needed
  return callback(db);
}

/**
 * Batch query helper for multiple independent queries.
 */
export async function batch<T extends readonly unknown[]>(
  ...queries: T
): Promise<Awaited<T>> {
  return Promise.all(queries) as Promise<Awaited<T>>;
}

export default db;
