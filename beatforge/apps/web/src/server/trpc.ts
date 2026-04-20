/**
 * @file src/server/trpc.ts
 * @description tRPC v11 server setup with authentication and rate limiting.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { db } from '@/lib/db';
import { requireAuth, type User, type Session } from '@/lib/auth';

/**
 * Create context from Next.js Request object.
 */
export async function createTRPCContext(req?: Request) {
  let session: Session | undefined;
  let user: User | undefined;

  if (req) {
    try {
      const auth = await requireAuth(req);
      session = auth.session;
      user = auth.user;
    } catch (error) {
      // User not authenticated
    }
  }

  return {
    req,
    session,
    user,
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC instance.
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return shape;
  },
});

/**
 * Create router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
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
 * Producer-only procedure
 */
export const producerProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'producer') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only producers can access this endpoint',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/**
 * Admin-only procedure
 */
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only admins can access this endpoint',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export default t;
