/**
 * @file lib/trpc.ts
 * @description tRPC server and client setup for BeatForge.
 * Typed, real-time marketplace API with React Query integration.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { type NextRequest } from 'next/server';
import superjson from 'superjson';
import { db } from './db';
import { requireAuth, User } from './auth';
import type { Session } from './auth';

// ============================================================
// CONTEXT DEFINITION
// ============================================================

export interface Context {
  req?: NextRequest;
  session?: Session;
  user?: User;
  db: typeof db;
}

/**
 * Create context for tRPC call.
 * Used in Server Actions and API routes.
 */
export async function createTRPCContext(req?: NextRequest): Promise<Context> {
  let session: Session | undefined;
  let user: User | undefined;

  if (req) {
    try {
      const auth = await requireAuth(req);
      session = auth.session;
      user = auth.user;
    } catch {
      // User not authenticated; continue with public access
    }
  }

  return {
    req,
    session,
    user,
    db,
  };
}

// ============================================================
// TRPC INSTANCE
// ============================================================

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error && error.cause.name === 'ZodError'
            ? (error.cause as any).flatten?.()
            : null,
      },
    };
  },
});

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * Middleware: Require authentication.
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session,
    },
  });
});

/**
 * Middleware: Require producer role.
 */
const isProducer = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'producer') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/**
 * Middleware: Require admin role.
 */
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// ============================================================
// PROCEDURES
// ============================================================

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const producerProcedure = t.procedure.use(isProducer);
export const adminProcedure = t.procedure.use(isAdmin);

// ============================================================
// ROUTER BUILDER
// ============================================================

export const createTRPCRouter = t.router;

// ============================================================
// APP ROUTER AGGREGATION
// ============================================================

/**
 * This will be populated by importing from individual routers.
 * Example:
 * export const appRouter = createTRPCRouter({
 *   beats: beatsRouter,
 *   users: usersRouter,
 *   subscriptions: subscriptionsRouter,
 * });
 */

// Placeholder for app router (populated in routers/index.ts)
export type AppRouter = ReturnType<typeof createTRPCRouter>;

// ============================================================
// DIRECT CALL (Next.js App Router only)
// ============================================================

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export async function handleTRPCRequest(req: NextRequest): Promise<Response> {
  // Import dynamically to avoid circular dependency
  const { appRouter } = await import('@/server/routers');

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => createTRPCContext(req),
    onError({ error, path }) {
      console.error(`Error in tRPC handler [${path}]:`, error);
    },
  });
}

export default t;
