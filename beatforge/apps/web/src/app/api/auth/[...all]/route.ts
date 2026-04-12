/**
 * @file src/app/api/auth/[...all]/route.ts
 * @description Better Auth API handler (catch-all for auth endpoints).
 */

import { auth } from '@/lib/auth';

export const { GET, POST } = auth.handler;
