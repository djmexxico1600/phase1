/**
 * @file lib/env.ts
 * @description Type-safe environment variables using Zod.
 * Separates server-only and public client variables.
 * Validates on module load to fail fast.
 */

import { z } from 'zod';

// ============================================================
// SCHEMA DEFINITION
// ============================================================

const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // ---- DATABASE ----
  NEON_DATABASE_URL: z.string().url('Invalid Neon database URL'),
  NEON_DATABASE_URL_UNPOOLED: z.string().url().optional(),

  // ---- BETTER AUTH ----
  BETTER_AUTH_SECRET: z.string().min(32, 'Secret must be at least 32 characters'),
  BETTER_AUTH_URL: z.string().url('Invalid Better Auth URL'),

  // ---- STRIPE ----
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'Invalid Stripe secret key'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith('pk_', 'Invalid Stripe publishable key'),

  // ---- CLOUDFLARE R2 ----
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string().default('beatforge-media'),
  R2_PUBLIC_URL: z.string().url('Invalid R2 public URL'),

  // ---- RESEND (Email) ----
  RESEND_API_KEY: z.string().startsWith('re_'),
  EMAIL_FROM: z.string().email(),

  // ---- SENTRY ----
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // ---- POSTHOG ANALYTICS ----
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),

  // ---- CLOUDFLARE TURNSTILE ----
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),

  // ---- APP CONFIG ----
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL'),
  NEXT_PUBLIC_APP_NAME: z.string().default('BeatForge'),
});

// ============================================================
// TYPES
// ============================================================

export type Env = z.infer<typeof envSchema>;

export type ServerEnv = Pick<
  Env,
  | 'NODE_ENV'
  | 'NEON_DATABASE_URL'
  | 'NEON_DATABASE_URL_UNPOOLED'
  | 'BETTER_AUTH_SECRET'
  | 'BETTER_AUTH_URL'
  | 'STRIPE_SECRET_KEY'
  | 'STRIPE_WEBHOOK_SECRET'
  | 'CLOUDFLARE_ACCOUNT_ID'
  | 'R2_ACCESS_KEY_ID'
  | 'R2_SECRET_ACCESS_KEY'
  | 'R2_BUCKET_NAME'
  | 'R2_PUBLIC_URL'
  | 'RESEND_API_KEY'
  | 'EMAIL_FROM'
  | 'SENTRY_DSN'
  | 'SENTRY_ORG'
  | 'SENTRY_PROJECT'
  | 'SENTRY_AUTH_TOKEN'
  | 'TURNSTILE_SECRET_KEY'
  | 'NEXT_PUBLIC_APP_URL'
>;

export type ClientEnv = Pick<
  Env,
  | 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
  | 'NEXT_PUBLIC_SENTRY_DSN'
  | 'NEXT_PUBLIC_POSTHOG_KEY'
  | 'NEXT_PUBLIC_POSTHOG_HOST'
  | 'NEXT_PUBLIC_TURNSTILE_SITE_KEY'
  | 'NEXT_PUBLIC_APP_URL'
  | 'NEXT_PUBLIC_APP_NAME'
>;

// ============================================================
// VALIDATION & EXPORT
// ============================================================

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

// Validate on module load (fail fast in development)
const env = validateEnv();

export default env;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get server-only environment variables.
 * Throws error if accessed on client.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot access server environment variables on client');
  }

  return {
    NODE_ENV: env.NODE_ENV,
    NEON_DATABASE_URL: env.NEON_DATABASE_URL,
    NEON_DATABASE_URL_UNPOOLED: env.NEON_DATABASE_URL_UNPOOLED,
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: env.BETTER_AUTH_URL,
    STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,
    CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: env.R2_BUCKET_NAME,
    R2_PUBLIC_URL: env.R2_PUBLIC_URL,
    RESEND_API_KEY: env.RESEND_API_KEY,
    EMAIL_FROM: env.EMAIL_FROM,
    SENTRY_DSN: env.SENTRY_DSN,
    SENTRY_ORG: env.SENTRY_ORG,
    SENTRY_PROJECT: env.SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN: env.SENTRY_AUTH_TOKEN,
    TURNSTILE_SECRET_KEY: env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
  };
}

/**
 * Get client-safe environment variables.
 */
export function getClientEnv(): ClientEnv {
  return {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_POSTHOG_KEY: env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
  };
}

/**
 * Check if running in development.
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if running in production.
 */
export const isProduction = env.NODE_ENV === 'production';
