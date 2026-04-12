/**
 * @file packages/api/src/middleware/logger.ts
 * @description Logging middleware for Hono API.
 */

import { MiddlewareHandler } from 'hono';

export const logger: MiddlewareHandler = async (c, next) => {
  const startTime = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const duration = Date.now() - startTime;
  const status = c.res.status;

  console.log(`${method} ${path} ${status} +${duration}ms`);
};
