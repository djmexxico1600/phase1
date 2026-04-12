/**
 * @file packages/api/src/index.ts
 * @description Hono Workers API entry point.
 * Handles queue processing: email, analytics, notifications.
 */

import { Hono } from 'hono';
import { logger } from './middleware/logger';
import { queuesRouter } from './routes/queues';
import { workflowsRouter } from './routes/workflows';

const app = new Hono();

// Middleware
app.use('*', logger);

// Routes
app.route('/queues', queuesRouter);
app.route('/workflows', workflowsRouter);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err instanceof Error ? err.message : 'Unknown error',
  }, 500);
});

export default app;
