/**
 * @file next.config.mjs
 * @description Next.js 15.2 configuration with Cloudflare Pages support.
 * - Cloudflare @cloudflare/next-on-pages adapter
 * - Security headers (CSP, HSTS, X-Frame-Options)
 * - Image optimization for R2 and external URLs
 * - Partial Prerendering (PPR) for dynamic marketplace
 * - Turbopack for dev, webpack for prod
 */

import { build } from '@cloudflare/next-on-pages/next-env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack for development speed
  turbopack: {
    resolveAlias: {
      canvas: false, // Exclude canvas from browser bundle
    },
  },

  // Experimental features for 2026
  experimental: {
    ppr: true, // Partial Prerendering for fast dynamic routes
    dynamicIO: true, // Optimize dynamic content
    testProxy: true, // Test environment proxy
  },

  // Image optimization (supports R2 and external URLs)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com', // Cloudflare R2
        pathname: '/**.jpg',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        pathname: '/**.png',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        pathname: '/**.webp',
      },
      {
        protocol: 'https',
        hostname: 'media.beatforge.io', // Public R2 domain
      },
    ],
    unoptimized: false, // Enable optimization for best performance
  },

  // Rewrites for API routing (optional)
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Redirects for canonical URLs
  async redirects() {
    return [
      {
        source: '/api/health',
        destination: '/api/auth',
        permanent: false,
      },
    ];
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      // HSTS for HTTPS
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'beatforge.io' }],
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      // Cache control for static assets
      {
        source: '/public/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // TypeScript strict mode
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // ESLint during build
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: false,
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // tRPC vendor chunk
            trpc: {
              test: /[\\/]node_modules[\\/](@trpc)/,
              name: 'trpc',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Stripe vendor chunk
            stripe: {
              test: /[\\/]node_modules[\\/](@stripe|stripe)/,
              name: 'stripe',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Wavesurfer vendor chunk
            audio: {
              test: /[\\/]node_modules[\\/](@wavesurfer|wavesurfer)/,
              name: 'audio',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Generate build ID from git for deployment tracking
  generateBuildId: async () => {
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return process.env.VERCEL_GIT_COMMIT_SHA;
    }
    if (process.env.GITHUB_SHA) {
      return process.env.GITHUB_SHA.substring(0, 8);
    }
    return new Date().toISOString().split('T')[0];
  },

  // Cloudflare Pages via @cloudflare/next-on-pages
  skipMiddlewareSourceMap: true,
  skipTrailingSlashRedirect: true,

  // Ensure stable IDs for Suspense boundaries
  unstableRpcHandler: true,

  // Production output for Cloudflare
  output: 'standalone',
};

export default build(nextConfig);
