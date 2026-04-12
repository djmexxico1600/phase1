/**
 * @file lib/rate-limit.ts
 * @description Cloudflare KV-based sliding window rate limiter.
 * Per-IP, per-user, per-endpoint rate limiting.
 */

// ============================================================
// RATE LIMIT CONFIGURATION
// ============================================================

export const RATE_LIMITS = {
  // API endpoints
  API_DEFAULT: { requests: 100, window: 60 }, // 100 req/min
  API_AUTH: { requests: 5, window: 60 }, // 5 attempts/min for login/signup
  API_UPLOAD: { requests: 10, window: 3600 }, // 10 uploads/hour
  API_PAYMENT: { requests: 10, window: 3600 }, // 10 payments/hour
  API_SEARCH: { requests: 30, window: 60 }, // 30 searches/min

  // Specific endpoints
  EXPORT_BEAT: { requests: 5, window: 3600 }, // 5 exports/hour
  DOWNLOAD: { requests: 50, window: 3600 }, // 50 downloads/hour
} as const;

// ============================================================
// TYPES
// ============================================================

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

// ============================================================
// RATE LIMITER (Client-side variant for demo)
// ============================================================

/**
 * In-memory rate limiter for development.
 * Production should use Cloudflare KV or Redis.
 */
class InMemoryRateLimiter {
  private store = new Map<string, Array<number>>();

  async check(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;

    // Get existing requests in window
    let requests = this.store.get(key) || [];
    requests = requests.filter((timestamp) => timestamp > windowStart);

    if (requests.length >= limit) {
      const oldestRequest = requests[0];
      const resetAt = oldestRequest + windowSeconds * 1000;
      return {
        success: false,
        limit,
        remaining: 0,
        resetAt: Math.floor(resetAt / 1000),
        retryAfter: Math.ceil((resetAt - now) / 1000),
      };
    }

    // Record this request
    requests.push(now);
    this.store.set(key, requests);

    return {
      success: true,
      limit,
      remaining: limit - requests.length,
      resetAt: Math.floor((now + windowSeconds * 1000) / 1000),
    };
  }
}

const memoryLimiter = new InMemoryRateLimiter();

// ============================================================
// RATE LIMIT MIDDLEWARE HELPERS
// ============================================================

/**
 * Get rate limit key from request.
 * Prefer user ID, fall back to IP.
 */
export function getRateLimitKey(
  request: Request,
  userId?: string,
  endpoint?: string
): string {
  if (userId) {
    return `user:${userId}:${endpoint || 'api'}`;
  }

  // Extract client IP from headers
  const ip =
    request.headers.get('cf-connecting-ip') || // Cloudflare
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() || // Proxy
    request.headers.get('x-real-ip') || // Nginx
    'unknown';

  return `ip:${ip}:${endpoint || 'api'}`;
}

/**
 * Check rate limit for a request.
 */
export async function checkRateLimit(
  request: Request,
  limitKey: keyof typeof RATE_LIMITS,
  userId?: string,
  endpoint?: string
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[limitKey];
  const key = getRateLimitKey(request, userId, endpoint);

  return memoryLimiter.check(key, config.requests, config.window);
}

/**
 * Require rate limit check (throw if exceeded).
 */
export async function requireRateLimit(
  request: Request,
  limitKey: keyof typeof RATE_LIMITS,
  userId?: string,
  endpoint?: string
): Promise<void> {
  const result = await checkRateLimit(request, limitKey, userId, endpoint);

  if (!result.success) {
    const error = new Error('Rate limit exceeded');
    (error as any).statusCode = 429;
    (error as any).retryAfter = result.retryAfter;
    throw error;
  }
}

// ============================================================
// RESPONSE HEADERS
// ============================================================

/**
 * Add rate limit headers to response.
 */
export function addRateLimitHeaders(
  headers: Headers,
  result: RateLimitResult
): void {
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', result.resetAt.toString());

  if (!result.success && result.retryAfter) {
    headers.set('Retry-After', result.retryAfter.toString());
  }
}

/**
 * Create 429 Too Many Requests response.
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  const body = JSON.stringify({
    error: 'Too Many Requests',
    retryAfter: result.retryAfter,
    resetAt: new Date(result.resetAt * 1000).toISOString(),
  });

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  addRateLimitHeaders(headers, result);

  return new Response(body, {
    status: 429,
    headers,
  });
}

export default {
  RATE_LIMITS,
  getRateLimitKey,
  checkRateLimit,
  requireRateLimit,
  addRateLimitHeaders,
  createRateLimitResponse,
};
