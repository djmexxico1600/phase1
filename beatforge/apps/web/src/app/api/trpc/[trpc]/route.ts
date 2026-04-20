/**
 * @file src/app/api/trpc/[trpc]/route.ts
 * @description tRPC HTTP handler for Next.js App Router.
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers';
import { createTRPCContext } from '@/server/trpc';

/**
 * tRPC route handlers for Next.js App Router.
 */
export async function GET(req: Request) {
  return fetchRequestHandler({
    req,
    router: appRouter,
    createContext: () => createTRPCContext(req as any),
    onError: ({ path, error }) => {
      console.error(`tRPC error on path [${path}]:`, error);
    },
  });
}

export async function POST(req: Request) {
  return GET(req);
}
