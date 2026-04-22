/**
 * @file src/app/api/trpc/[trpc]/route.ts
 * @description tRPC HTTP handler for Next.js App Router.
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { appRouter } from '@/server/routers';
import { createTRPCContext } from '@/server/trpc';

/**
 * Handle tRPC requests.
 */
async function handle(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext(req),
    onError: ({ path, error }) => {
      console.error(`tRPC error on path [${path}]:`, error);
    },
  });
}

export { handle as GET, handle as POST };
