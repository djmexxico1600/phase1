/**
 * @file beatforge/ARCHITECTURE.md
 * @description BeatForge architecture documentation.
 */

# BeatForge Architecture

## Overview

BeatForge is a next-generation beat marketplace built on the Cloudflare edge with a focus on security, scalability, and developer experience.

### Tech Stack (2026)

- **Framework**: Next.js 15.2 (App Router, React 19, PPR)
- **Deployment**: Cloudflare Pages + Workers
- **Database**: Neon Postgres + Hyperdrive pooling
- **Auth**: Better Auth 1.2 with RBAC
- **Payments**: Stripe 17.4
- **Storage**: Cloudflare R2 (S3-compatible)
- **Validation**: Zod 3.24
- **API**: tRPC 11.0 + Server Actions
- **State**: Zustand for client state
- **Observability**: Pino + Sentry
- **UI**: Tailwind CSS 4.0 + shadcn/ui

## System Architecture

### Edge-First Rendering

```
User → Cloudflare CDN → Cloudflare Pages (Next.js)
                             ↓
                      Middleware (CSP, rate-limit, auth)
                             ↓
                    Neon Postgres (via Hyperdrive)
                             ↓
                    Stripe / R2 / External APIs
```

### Data Flow

1. **Client** (Browser/Mobile)
   - React 19 Server Components
   - Zustand for audio player + cart state
   - tRPC hooks for real-time queries

2. **Edge** (Cloudflare Pages)
   - Middleware: CSP nonces, security headers, rate-limiting
   - Next.js app router with PPR (Partial Prerendering)
   - Server Actions for mutations (upload, payments, admin)

3. **Database** (Neon Postgres)
   - Hyperdrive connection pooling
   - Drizzle ORM with type-safe queries
   - 13 tables: users, beats, licenses, transactions, payouts, etc.

4. **Background Jobs** (Hono Workers)
   - Email notifications (Resend)
   - Analytics aggregation
   - Royalty calculations
   - Queue-driven processing

## Database Schema

### Core Tables

- **users**: Producers and buyers with role-based access
- **beats**: Audio content with metadata (genre, BPM, key, mood)
- **licenses**: Tiered license types (Basic, Standard, Exclusive, Lease)
- **transactions**: Purchase records with status tracking
- **payouts**: Producer earnings and payout requests
- **subscriptions**: Monthly subscription plans
- **notifications**: In-app notification system
- **analytics**: Play counts, downloads, revenue metrics

### Relationships

```
users (1) ──→ (many) beats
beats (1) ──→ (many) licenses
beats (1) ──→ (many) transactions
users (1) ──→ (many) transactions
users (1) ──→ (many) payouts
users (1) ──→ (many) subscriptions
```

## Security Model

### Authentication

- Better Auth with email/password + social (Discord, GitHub, Google)
- 2FA support (TOTP)
- Passkeys for webauthn
- HTTP-only cookies with SameSite=Strict
- Session validation on every request

### Authorization

- RBAC: `admin`, `producer`, `buyer` roles
- Producer route guards for dashboard/upload
- Admin guards for moderation panel
- Middleware auth checks for protected routes

### Data Protection

- **API Layer**: tRPC + Server Actions with Zod validation
- **Transport**: HTTPS everywhere, CSP with nonces
- **Secrets**: Environment variables, no secrets in code
- **Payments**: Stripe webhook signature verification
- **Storage**: Signed R2 URLs with 1-hour expiry
- **Rate Limiting**: Sliding-window per endpoint (API_AUTH 5/min, API_UPLOAD 10/hour)

## File Organization

```
beatforge/
├── .github/workflows/          # CI/CD: ci.yml, deploy.yml, preview.yml
├── apps/web/
│   ├── src/
│   │   ├── app/               # Next.js pages (routing)
│   │   ├── components/        # React components (UI + layout)
│   │   ├── lib/               # Core utilities (auth, db, stripe, r2, etc)
│   │   ├── server-actions/   # Mutations (auth, beats, payments, admin)
│   │   ├── server/           # tRPC routers + context
│   │   └── __tests__/        # Unit tests
│   ├── e2e/                   # Playwright E2E tests
│   ├── next.config.mjs        # Cloudflare adapter config
│   └── wrangler.toml          # Edge config (R2, KV, Queues)
├── packages/
│   ├── db/                    # Drizzle schema + queries
│   ├── shared/                # Zod schemas, types, constants
│   └── api/                   # Hono Workers (background jobs)
└── turbo.json                 # Monorepo config
```

## API Layer

### tRPC (Query/Read)

- **Beats Router**: list, getBySlug, search, trending, infinite scroll
- **Users Router**: getProfile, topProducers, follow, unfollow
- **Subscriptions Router**: getUserSubscription, createCheckout
- **Notifications Router**: list, markRead

**Features**: Type-safe client, automatic caching, error handling

### Server Actions (Mutations/Write)

- **Auth**: register, login, logout, verify, resetPassword
- **Beats**: createBeat, updateBeat, publishBeat, deleteBeat
- **Payments**: createCheckoutSession, confirmPayment, requestPayout
- **Downloads**: generateDownloadUrl, incrementDownloadCount
- **Admin**: approveVerification, rejectVerification, removeBeat, blockUser

**Features**: Type safety, Zod validation, action-level auth checks

## Payment Flow

1. **Shopping Cart** (Client)
   - Zustand store persists to localStorage
   - Add/remove/clear items
   - Shows total + platform fee (20%)

2. **Checkout** (Server Action)
   - Create Stripe Checkout Session
   - Redirect to Stripe-hosted checkout

3. **Payment Confirmation** (Webhook)
   - Stripe sends `charge.succeeded` to `/api/webhooks/stripe`
   - Verify webhook signature
   - Create transaction in database
   - Send download link via email

4. **Payout** (Background Job)
   - Monthly royalty calculation (Hono Worker)
   - Create payout requests for producers (80% of sales)
   - Transfer funds via Stripe Connect

## Monitoring & Observability

### Logging

- Structured JSON logging with Pino
- Context loggers: auth events, API errors, payment events
- Redaction of sensitive data (tokens, passwords)

### Error Tracking

- Sentry integration for production errors
- Error boundaries at page + component level
- Detailed error messages in dev mode

### Analytics

- PostHog for user behavior + feature tracking
- Beat plays, downloads, sales events
- Conversion funnel tracking

## Deployment

### Preview (PR)

1. Trigger on PR creation
2. Build Next.js with optimizations
3. Deploy to Cloudflare Pages preview URL
4. Comment PR with live preview

### Production (Main)

1. Trigger on merge to main
2. CI: linting, type-checking, tests
3. Build and deploy to Cloudflare Pages
4. Run migrations on Neon
5. Deploy Hono Workers API
6. Monitor Sentry + PostHog for errors

## Performance

### Optimization Strategies

- **PPR**: Partial Prerendering for dynamic content
- **ISR**: Incremental Static Regeneration for beat listing
- **Image Optimization**: Cloudflare Image Resizing
- **Code Splitting**: tRPC + Stripe library chunks
- **Caching**: Browser cache (1 week), edge cache (1 day)

### Metrics

- Core Web Vitals: LCP < 1.5s, FID < 100ms, CLS < 0.1
- API response time: < 100ms (p95)
- Stripe checkout: < 2s roundtrip

## Scalability

### Horizontal

- Cloudflare Pages: Unlimited globally distributed instances
- Neon Postgres: Auto-scaling with read replicas
- R2: Unlimited storage and bandwidth
- Stripe: Handles 100K+ sales/day natively

### Vertical

- Connection pooling: Hyperdrive (100 concurrent)
- Rate limiting: KV-based sliding window per endpoint
- Queue workers: Separate Hono workers for email/analytics

## Future Enhancements

- [ ] Real-time notifications via WebSocket
- [ ] Machine learning for recommendations
- [ ] NFT/blockchain for provenance
- [ ] Marketplace for beats (peer-to-peer)
- [ ] Collaboration features (producer co-signs)
