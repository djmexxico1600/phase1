import type { Config } from "drizzle-kit";

export default {
  schema: "./packages/db/src/schema/index.ts",
  out: "./packages/db/src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL_UNPOOLED!,
  },
  verbose: true,
  strict: true,
  migrations: {
    table: "__drizzle_migrations",
    schema: "public",
  },
} satisfies Config;
