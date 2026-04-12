/**
 * @file src/server/routers/index.ts
 * @description Root tRPC router aggregating all sub-routers.
 */

import { createTRPCRouter } from '@/server/trpc';
import { beatsRouter } from './beats';
// import { usersRouter } from './users';
// import { subscriptionsRouter } from './subscriptions';
// import { notificationsRouter } from './notifications';

/**
 * Aggregate all routers.
 */
export const appRouter = createTRPCRouter({
  beats: beatsRouter,
  // users: usersRouter,
  // subscriptions: subscriptionsRouter,
  // notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
