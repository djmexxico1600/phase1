/**
 * @file middleware.ts
 * @description Next.js middleware for auth, rate-limiting, security headers, CSP.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from './lib/env';
import {
  checkRateLimit,
  createRateLimitResponse,
} from './lib/rate-limit';

const env = getServerEnv();
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/api/auth',
  '/api/upload/presigned', // Will be rate-limited instead
];

// ============================================================
// SECURITY HEADERS CSP NONCE
// ============================================================

function generateNonce(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================================
// MIDDLEWARE
// ============================================================

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // ============================================================
  // CSP NONCE FOR INLINE SCRIPTS
  // ============================================================

  const nonce = generateNonce();
  response.headers.set('X-Nonce', nonce);

  // ============================================================
  // SECURITY HEADERS
  // ============================================================

  // Strict Transport Security
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: https://*.r2.cloudflarestorage.com https://media.beatforge.io https://cdn.beatforge.io;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://api.stripe.com https://*.stripe.com wss://*.posthog.com https://*.posthog.com https://challenges.cloudflare.com;
      media-src 'self' https://*.r2.cloudflarestorage.com https://media.beatforge.io https://cdn.beatforge.io;
      frame-src https://challenges.cloudflare.com;
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ')
  );

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Referrer-Policy
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );

  // Permissions-Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=()'
  );

  // ============================================================
  // RATE LIMITING (Per IP)
  // ============================================================

  // Skip rate limiting for static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$/)
  ) {
    return response;
  }

  // Apply stricter rate limits to auth endpoints
  if (pathname === '/api/auth/sign-up' || pathname === '/api/auth/sign-in') {
    const result = await checkRateLimit(request, 'API_AUTH', undefined, pathname);
    if (!result.success) {
      return createRateLimitResponse(result);
    }
  }

  // Apply upload rate limits
  if (pathname.startsWith('/api/upload')) {
    const result = await checkRateLimit(request, 'API_UPLOAD', undefined, pathname);
    if (!result.success) {
      return createRateLimitResponse(result);
    }
  }

  // General API rate limiting
  if (pathname.startsWith('/api')) {
    const result = await checkRateLimit(request, 'API_DEFAULT', undefined, pathname);
    if (!result.success) {
      return createRateLimitResponse(result);
    }
  }

  // ============================================================
  // AUTH REDIRECTS
  // ============================================================

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  // If accessing protected routes without auth, redirect to login
  if (!isPublicRoute && !pathname.startsWith('/api')) {
    // Check if user has session cookie
    const sessionToken = request.cookies.get('better-auth.session_token');

    if (!sessionToken) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${returnUrl}`, request.url)
      );
    }
  }

  // ============================================================
  // CORS HEADERS (for API routes)
  // ============================================================

  if (pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', env.NEXT_PUBLIC_APP_URL);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

// ============================================================
// MATCHER CONFIGURATION
// ============================================================

export const config = {
  // Don't run middleware on static files and api routes that don't need it
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
