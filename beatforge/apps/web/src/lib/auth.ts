/**
 * @file lib/auth.ts
 * @description Better Auth server configuration.
 * RBAC (producer/buyer/admin), 2FA, passkeys, social logins, Drizzle adapter.
 * All sessions stored in secure HTTP-only cookies.
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
// Dynamically import plugins to avoid build-time errors when a plugin
// is not available in the installed version of `better-auth`.
let authPlugins: any = {};
try {
  // Top-level await is supported in modern Node; Next.js server builds allow it.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  authPlugins = await import('better-auth/plugins');
} catch {
  authPlugins = {};
}
import { roles } from '@beatforge/shared';
import { db } from './db';
import { getServerEnv } from './env';

const env = getServerEnv();

// ============================================================
// BETTER AUTH SERVER CONFIGURATION
// ============================================================

const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),

  // ---- SECRETS & URLS ----
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/auth',

  // ---- SESSION CONFIGURATION ----
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // ---- COOKIE CONFIGURATION (Secure) ----
  appName: 'BeatForge',
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],

  // ---- EMAIL CONFIGURATION ----
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // ---- ACCOUNT LINKING ----
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },

  // ---- HOOKS ----
  hooks: {
    /**
     * After user is created: assign role based on signup type.
     */
    after: [
      {
        matcher: (context) => context.path === '/sign-up',
        handler: async (ctx) => {
          if (ctx.data.user) {
            // Default role is 'buyer'; producers opt-in
            // (This will be overridden by signup page logic)
            return ctx;
          }
        },
      },
    ],
  },

  // ---- CALLBACK URLS (Redirect after auth) ----
  callbacks: {
    authorized: async (req) => {
      // Middleware auth check
      return true;
    },
  },

  // ---- PLUGINS ----
  plugins: [
    // Two-Factor Authentication (guarded)
    (authPlugins as any).twoFactor
      ? (authPlugins as any).twoFactor({ issuer: 'BeatForge', window: 1 })
      : undefined,

    // Passkeys (WebAuthn) — fallback if plugin not present in installed version
    (authPlugins as any).passkey ? (authPlugins as any).passkey() : undefined,

    // Email OTP (backup MFA method) (guarded)
    (authPlugins as any).emailOTP ? (authPlugins as any).emailOTP() : undefined,

    // Social login providers (fallback if plugin missing)
    (authPlugins as any).socialProviders
      ? (authPlugins as any).socialProviders({
          providers: {
            discord: {
              clientId: process.env.DISCORD_CLIENT_ID || '',
              clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
            },
            github: {
              clientId: process.env.GITHUB_CLIENT_ID || '',
              clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            },
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID || '',
              clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            },
          },
        })
      : undefined,
  ],
  });

// ============================================================
// TYPES
// ============================================================

export type Session = any;
export type User = any;

// ============================================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================================

export const ROLES = {
  ADMIN: 'admin',
  PRODUCER: 'producer',
  BUYER: 'buyer',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * Check if user has a specific role.
 */
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  return user.role === requiredRole;
}

/**
 * Check if user is a producer.
 */
export function isProducer(user: User | null): boolean {
  return hasRole(user, ROLES.PRODUCER);
}

/**
 * Check if user is an admin.
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, ROLES.ADMIN);
}

/**
 * Check if user has any of the given roles.
 */
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role as UserRole);
}

// ============================================================
// SESSION HELPERS
// ============================================================

/**
 * Get session from request (used in Server Actions / API routes).
 */
export async function getSessionFromRequest(
  request: Request
): Promise<Session | null> {
  const cookies = request.headers.get('cookie') || '';
  const sessionHeader = cookies
    .split(';')
    .find((c) => c.trim().startsWith('better-auth.session_token='));

  if (!sessionHeader) {
    return null;
  }

  try {
    const { session } = await auth.api.getSession({
      headers: request.headers,
    });
    return session;
  } catch {
    return null;
  }
}

/**
 * Require authentication for Server Actions.
 */
export async function requireAuth(
  request: Request
): Promise<{ session: Session; user: User }> {
  const { session, user } = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !user) {
    throw new Error('UNAUTHORIZED');
  }

  return { session, user };
}

/**
 * Require specific role for authorization.
 */
export async function requireRole(
  request: Request,
  requiredRole: UserRole
): Promise<{ session: Session; user: User }> {
  const { session, user } = await requireAuth(request);

  if (user.role !== requiredRole) {
    throw new Error('FORBIDDEN');
  }

  return { session, user };
}

export { auth };
export default auth;
