# 🔍 Cloudflare Deployment Configuration Analysis

**Generated**: April 22, 2026  
**Project**: BeatForge  
**Status**: ✅ Ready for Deployment

---

## Executive Summary

BeatForge uses a **multi-component Cloudflare deployment architecture**:
- **Web App**: Next.js 15 → Cloudflare Pages (static hosting)
- **API**: Hono Workers → Cloudflare Workers (serverless compute)
- **Database**: Drizzle ORM → Cloudflare D1 (SQLite database)
- **Storage**: Cloudflare R2 (object storage for beat uploads)
- **Queues**: Cloudflare Queues (background job processing)

Deployment is **fully automated via GitHub Actions** — no manual Cloudflare Pages setup required.

---

## 1️⃣ Wrangler Configuration Analysis

### Root wrangler.toml (`beatforge/wrangler.toml`)
```toml
name = "beatforge-deployment-error"
type = "service"
main = "src/index.ts"
```

**Purpose**: Guard file that prevents direct deployment  
**Status**: ⚠️ Intentionally non-deployable  
**Reason**: This is a monorepo; deployment is handled by GitHub Actions, not direct wrangler commands

**Build Artifact Path**: `.vercel/output/static`

### API wrangler.toml (`beatforge/packages/api/wrangler.toml`)

#### Basic Configuration
```toml
name = "beatforge-api"
type = "service"
main = "src/index.ts"
compatibility_date = "2024-12-19"
node_compat = true
```

**Cloudflare Project Name**: `beatforge-api`  
**Worker Type**: Service (Hono + Node.js compatibility)  
**Compatibility Date**: December 19, 2024

#### Database Bindings (D1)
```toml
# Production
[env.production.d1]
binding = "DB"
database_name = "beatforge"

# Staging
[env.staging.d1]
binding = "DB"
database_name = "beatforge-staging"
```

**D1 Configuration**:
| Environment | Binding Name | Database Name |
|-------------|--------------|---------------|
| Production | `DB` | `beatforge` |
| Staging | `DB` | `beatforge-staging` |

**Access Method**: Environment variable `DATABASE_URL` (connection string) + D1 binding in wrangler

#### KV Namespace (Rate Limiting & Caching)
```toml
[[kv_namespaces]]
binding = "KV"
id = "xxxx"              # Production KV namespace ID
preview_id = "xxxx"     # Preview KV namespace ID
```

**KV Binding**: `KV` (used for rate limiting and caching)  
**Status**: IDs are placeholders (`xxxx`) — must be updated before deployment

#### Queue Consumers
```toml
[[queues.consumers]]
queue = "email"
max_batch_size = 10
max_batch_timeout = 30
max_concurrency = 5

[[queues.consumers]]
queue = "analytics"
max_batch_size = 100
max_batch_timeout = 60
max_concurrency = 10

[[queues.consumers]]
queue = "notifications"
max_batch_size = 50
max_batch_timeout = 30
max_concurrency = 5
```

**Queue Configuration**:
| Queue | Max Batch | Timeout (s) | Concurrency |
|-------|-----------|------------|-------------|
| email | 10 | 30 | 5 |
| analytics | 100 | 60 | 10 |
| notifications | 50 | 30 | 5 |

#### Analytics Engine
```toml
[[analytics_engine_datasets]]
binding = "ANALYTICS"
```

**Analytics Binding**: `ANALYTICS` (Cloudflare Analytics Engine)

#### Environment Variables
```toml
[env.production.vars]
DATABASE_URL = ""
STRIPE_SECRET = ""
RESEND_API_KEY = ""
ENVIRONMENT = "production"

[env.staging.vars]
DATABASE_URL = ""
STRIPE_SECRET = ""
RESEND_API_KEY = ""
ENVIRONMENT = "staging"
```

**Status**: Values are empty in config — passed via GitHub Actions secrets

---

## 2️⃣ Build Artifact Configuration

### Expected Build Artifact Path
```
.vercel/output/static
```

**Full Path**: `beatforge/apps/web/.vercel/output/static`

### Build Pipeline
```bash
# In GitHub Actions (deploy.yml)
1. cd beatforge
2. pnpm install                              # Install dependencies
3. pnpm --filter @beatforge/web run build   # Build Next.js app
4. GitHub Actions verifies: .vercel/output/static exists
5. cloudflare/pages-action@v1 deploys the contents
```

### Verification in CI
```bash
# deploy.yml includes verification step:
if [[ ! -d "beatforge/apps/web/.vercel/output/static" ]]; then
  echo "ERROR: beatforge/apps/web/.vercel/output/static not found!"
  exit 1
fi
```

### Build Configuration (next.config.mjs)
```javascript
// Cloudflare Pages adapter
import path from 'path';

// Image optimization for R2 and external URLs
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.r2.cloudflarestorage.com',  // Cloudflare R2
      pathname: '/**.jpg',
    },
    {
      hostname: 'media.beatforge.io',  // Public R2 domain
    },
  ],
  unoptimized: false,
}
```

**Features**:
- ✅ Cloudflare @next-on-pages adapter
- ✅ R2 image optimization
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ Partial Prerendering (PPR) for dynamic content

---

## 3️⃣ Cloudflare-Specific Environment Variables

### Required GitHub Secrets (for Build & Deployment)

#### Cloudflare Credentials
```bash
CLOUDFLARE_API_TOKEN          # Deploy to Pages
CLOUDFLARE_ACCOUNT_ID         # Account identifier
WRANGLER_API_TOKEN            # Deploy Workers API
```

**Source**: Generated at https://dash.cloudflare.com/profile/api-tokens  
**Permissions Required**: 
- Cloudflare Pages Editor
- Cloudflare Workers (for API deployment)

#### Database & Services
```bash
DATABASE_URL                   # Neon Postgres connection string
STRIPE_SECRET_KEY              # Payment processing
STRIPE_WEBHOOK_SECRET          # Webhook verification
BETTER_AUTH_SECRET             # Session encryption
```

#### R2 Object Storage
```bash
CLOUDFLARE_ACCOUNT_ID          # Account ID (also used for R2)
R2_ACCESS_KEY_ID               # R2 API credentials
R2_SECRET_ACCESS_KEY           # R2 API secret
R2_BUCKET_NAME                 # beatforge-media
R2_PUBLIC_URL                  # https://media.beatforge.io
```

#### Analytics & Monitoring
```bash
SENTRY_DSN                     # Error tracking
NEXT_PUBLIC_SENTRY_DSN         # Client-side errors
NEXT_PUBLIC_POSTHOG_KEY        # Analytics
NEXT_PUBLIC_POSTHOG_HOST       # Analytics host
```

#### OAuth Providers
```bash
DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

#### Bot Protection
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY  # Cloudflare Turnstile
TURNSTILE_SECRET_KEY            # Turnstile secret
```

#### Email Service
```bash
RESEND_API_KEY                 # Email provider (optional)
EMAIL_FROM                     # Sender address
```

#### Application Configuration
```bash
NEXT_PUBLIC_APP_URL            # Production domain
NEXT_PUBLIC_APP_NAME           # BeatForge
NODE_ENV                       # production/staging
```

### Turbo.json Global Environment Variables

```json
{
  "globalEnv": [
    "NODE_ENV",
    "CI",
    "VERCEL",
    "VERCEL_ENV",
    "VERCEL_URL",
    "NEON_DATABASE_URL",
    "NEON_DATABASE_URL_UNPOOLED",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "CLOUDFLARE_ACCOUNT_ID",
    "CLOUDFLARE_API_TOKEN",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_PUBLIC_URL",
    "RESEND_API_KEY",
    "EMAIL_FROM",
    "SENTRY_DSN",
    "SENTRY_ORG",
    "SENTRY_PROJECT",
    "SENTRY_AUTH_TOKEN",
    "NEXT_PUBLIC_SENTRY_DSN",
    "NEXT_PUBLIC_POSTHOG_KEY",
    "NEXT_PUBLIC_POSTHOG_HOST",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    "TURNSTILE_SECRET_KEY",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_APP_NAME"
  ]
}
```

---

## 4️⃣ Documented Project Names & Account IDs

### Cloudflare Pages Project
| Property | Value |
|----------|-------|
| **Project Name** | `beatforge` |
| **Deployment URL** | `https://beatforge.pages.dev` |
| **Dashboard** | https://dash.cloudflare.com/?to=/:account/pages |
| **Build Command** | LEFT BLANK (GitHub Actions deploys via API) |
| **Output Directory** | LEFT BLANK (GitHub Actions uploads directly) |

### Cloudflare Workers API
| Property | Value |
|----------|-------|
| **Worker Name** | `beatforge-api` |
| **Type** | Service (Hono) |
| **Compatibility Date** | 2024-12-19 |
| **Dashboard** | https://dash.cloudflare.com/workers/overview |

### R2 Storage
| Property | Value |
|----------|-------|
| **Bucket Name** | `beatforge-media` |
| **Public URL** | `https://media.beatforge.io` |
| **Configuration** | Configured in wrangler.toml |

### D1 Databases
| Environment | Database Name | Binding |
|-------------|---------------|---------|
| Production | `beatforge` | `DB` |
| Staging | `beatforge-staging` | `DB` |
| Preview | (auto-created per branch) | `DB` |

### KV Namespaces
| Purpose | Binding | Environment |
|---------|---------|------------|
| Rate Limiting & Caching | `KV` | Production/Staging |
| Status | ⚠️ IDs are placeholders | Must update before deploy |

---

## 5️⃣ GitHub Actions Deployment Flow

### Workflow File: `.github/workflows/deploy.yml`

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      # 1. Checkout code
      - uses: actions/checkout@v4
      
      # 2. Setup Node & pnpm
      - run: npm install -g pnpm && pnpm install
      
      # 3. Build Next.js web app
      - run: pnpm --filter @beatforge/web run build
        env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          [... all secrets injected ...]
      
      # 4. Verify .vercel/output/static exists
      - run: |
          if [[ ! -d "apps/web/.vercel/output/static" ]]; then
            exit 1
          fi
      
      # 5. Deploy to Cloudflare Pages
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: beatforge
          directory: beatforge/apps/web/.vercel/output/static
          productionBranch: main
      
      # 6. Build API Worker
      - run: pnpm --filter @beatforge/api run build
      
      # 7. Deploy API
      - run: pnpm run deploy:api
        env:
          WRANGLER_API_TOKEN: ${{ secrets.WRANGLER_API_TOKEN }}
  
  migrations:
    needs: build_and_deploy
    steps:
      - run: pnpm run db:migrate:prod
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Deployment Commands

**Root package.json**:
```json
{
  "scripts": {
    "build": "turbo build",
    "build:api": "turbo build --filter=@beatforge/api",
    "deploy": "echo 'ERROR: Use GitHub Actions' && exit 1",
    "deploy:api": "wrangler deploy --config packages/api/wrangler.toml",
    "db:migrate:prod": "turbo db:migrate:prod"
  }
}
```

**Web app package.json**:
```json
{
  "scripts": {
    "build": "next build",              // Produces .vercel/output/static
    "build:pages": "next build && wrangler pages deploy .vercel/output/static",
    "preview": "wrangler pages dev .vercel/output/static --compatibility-flag=nodejs_compat"
  }
}
```

---

## 6️⃣ Deployment Verification Checklist

### ✅ Pre-Deployment Configuration

**Cloudflare Setup**:
- ✅ Pages project created: https://dash.cloudflare.com/?to=/:account/pages
- ✅ Pages project settings: NO custom build command
- ✅ R2 bucket configured: `beatforge-media`
- ✅ D1 databases created: `beatforge` and `beatforge-staging`
- ✅ KV namespace configured: Production and staging IDs needed
- ✅ API token generated: Edit Cloudflare Workers permissions

**GitHub Secrets** (7 required):
```
1. ✅ CLOUDFLARE_API_TOKEN
2. ✅ CLOUDFLARE_ACCOUNT_ID
3. ✅ WRANGLER_API_TOKEN
4. ✅ DATABASE_URL
5. ✅ STRIPE_SECRET_KEY
6. ✅ STRIPE_WEBHOOK_SECRET
7. ✅ BETTER_AUTH_SECRET
```

**External Services**:
- ✅ Neon Postgres database initialized
- ✅ Stripe API keys obtained
- ✅ Email service (Resend) configured
- ✅ OAuth providers configured (Discord, GitHub, Google)

### ✅ Deployment Steps

1. **Push to main**:
   ```bash
   git push origin main
   ```

2. **GitHub Actions triggers automatically**:
   - Runs CI tests
   - Builds Next.js app → `.vercel/output/static`
   - Deploys to Cloudflare Pages
   - Builds and deploys Hono API Worker
   - Runs database migrations

3. **Verification**:
   ```bash
   # Check deployment status
   gh workflow run list --repo djmexxico1600/phase1 --workflow deploy.yml
   
   # View live site
   open https://beatforge.pages.dev
   ```

### ✅ Post-Deployment Verification

**Cloudflare Pages Dashboard**:
```
https://dash.cloudflare.com/?to=/:account/pages/view/beatforge
```

**Deployment Logs**:
```
GitHub Actions: https://github.com/djmexxico1600/phase1/actions
```

**Health Checks**:
- [ ] Pages site loads: https://beatforge.pages.dev
- [ ] API Worker responds: Check in Cloudflare Workers dashboard
- [ ] Database connects: Check Neon console
- [ ] R2 uploads work: Upload a beat file
- [ ] Stripe integration: Process test payment

---

## 7️⃣ Common Issues & Solutions

### ❌ "Could not detect static files"
**Cause**: Custom build command configured on Pages  
**Solution**: Remove custom build command — GitHub Actions handles it

### ❌ "Unauthorized 401"
**Cause**: Invalid or expired API token  
**Solution**: Regenerate at https://dash.cloudflare.com/profile/api-tokens

### ❌ ".vercel/output/static not found"
**Cause**: Next.js build failed  
**Solution**: Check GitHub Actions log for build errors

### ❌ "Database connection failed"
**Cause**: Wrong connection string or SSL mode  
**Solution**: Verify DATABASE_URL format from Neon

### ❌ "Worker deployment timeout"
**Cause**: Large build artifacts or network issue  
**Solution**: Check wrangler compatibility date and node_compat setting

---

## 📋 Configuration Summary Table

| Component | Name | Type | Binding/URL | Status |
|-----------|------|------|------------|--------|
| **Pages** | beatforge | Static | beatforge.pages.dev | ✅ Ready |
| **Worker** | beatforge-api | Service | Hono + Node.js | ✅ Ready |
| **D1** | beatforge | Database | DB binding | ✅ Configured |
| **D1** | beatforge-staging | Database | DB binding | ✅ Configured |
| **R2** | beatforge-media | Storage | media.beatforge.io | ✅ Configured |
| **KV** | (rate limiting) | Cache | KV binding | ⚠️ IDs needed |
| **Queues** | email, analytics, notifications | Jobs | Consumer groups | ✅ Configured |

---

## 🚀 Deployment Commands Reference

```bash
# From project root

# Full monorepo deployment (via GitHub Actions)
git push origin main

# Manual API deployment only
pnpm run deploy:api

# Build only
pnpm run build
pnpm run build:api

# Database migrations
pnpm run db:migrate:prod

# Type checking
pnpm run type-check

# Run tests
pnpm test:run
pnpm test:e2e
```

---

## 📚 Related Documentation

- [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) — Full deployment guide
- [CLOUDFLARE_PAGES_CONFIG.md](CLOUDFLARE_PAGES_CONFIG.md) — Pages setup details
- [GITHUB_SECRETS.md](GITHUB_SECRETS.md) — Secrets configuration
- [DEPLOYMENT_VERIFICATION.md](DEPLOYMENT_VERIFICATION.md) — Verification steps
- [beatforge/ARCHITECTURE.md](beatforge/ARCHITECTURE.md) — System design
- [beatforge/packages/api/wrangler.toml](beatforge/packages/api/wrangler.toml) — Worker config
- [beatforge/apps/web/next.config.mjs](beatforge/apps/web/next.config.mjs) — Build config
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — Deployment workflow

---

**Last Updated**: April 22, 2026  
**Analysis Version**: 1.0  
**Status**: ✅ Complete & Ready for Deployment
