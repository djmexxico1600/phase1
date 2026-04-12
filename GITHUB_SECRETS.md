# GitHub Secrets Configuration for BeatForge Deployment

## Overview
This document outlines all required secrets for production deployment on Cloudflare Pages + Workers.

## Required Secrets

### Cloudflare Deployment Secrets
```
CLOUDFLARE_API_TOKEN
  - Description: API token for Cloudflare Pages deployment
  - Type: Sensitive
  - Where to get: https://dash.cloudflare.com/profile/api-tokens
    - Create token: "Edit Cloudflare Workers" template
    - Scopes: Account.Workers KV Storage, Account.Workers Routes, Zone.Workers
  - Add as Repository Secret: Settings → Secrets and variables → Actions → New repository secret

CLOUDFLARE_ACCOUNT_ID
  - Description: Cloudflare account ID for Pages/Workers
  - Type: Non-sensitive (can be public)
  - Where to get: https://dash.cloudflare.com/
    - Click account name (top right) → Account ID
  - Add as Repository Secret: Settings → Secrets and variables → Actions → New repository secret

WRANGLER_API_TOKEN
  - Description: API token for wrangler CLI (Worker deployments)
  - Type: Sensitive
  - Where to get: https://dash.cloudflare.com/profile/api-tokens
    - Create token: "Edit Cloudflare Workers" template
  - Add as Repository Secret: Settings → Secrets and variables → Actions → New repository secret
```

### Database Secrets
```
DATABASE_URL
  - Description: Neon Postgres connection string
  - Format: postgresql://user:password@host/database?sslmode=require
  - Type: Sensitive (contains credentials)
  - Where to get: https://console.neon.tech
    - Project → Connection Details → Copy connection string
  - Add as Repository Secret + Environment Variable
  - Required for: Migrations, seed script

NEON_API_KEY (Optional for preview branches)
  - Description: Neon API key for programmatic branch creation
  - Type: Sensitive
  - Where to get: https://console.neon.tech/app/settings/api-keys
  - Add as Repository Secret: If implementing automatic preview databases
```

### Stripe Secrets
```
STRIPE_SECRET_KEY
  - Description: Stripe secret API key for backend
  - Type: Sensitive
  - Where to get: https://dashboard.stripe.com/apikeys
    - Complete registration as Test account first
    - Copy Secret key (starts with "sk_test_" for development)
  - Add as Repository Secret
  - Used for payment processing, webhook verification
  - **DO NOT expose to client** — use STRIPE_PUBLISHABLE_KEY for frontend

STRIPE_WEBHOOK_SECRET
  - Description: Signing secret for Stripe webhooks
  - Type: Sensitive
  - Where to get: https://dashboard.stripe.com/webhooks
    - Create endpoint: POST /api/webhooks/stripe
    - Signing secret displayed after endpoint creation
  - Add as Repository Secret
  - Used to verify webhook authenticity in /api/webhooks/stripe/route.ts
```

### Authentication Secrets
```
BETTER_AUTH_SECRET
  - Description: Encryption key for Better Auth sessions
  - Type: Sensitive
  - Generate: `openssl rand -base64 32`
  - Add as Repository Secret
  - Add to .env.production: BETTER_AUTH_SECRET=<value>

BETTER_AUTH_TRUST_HOST
  - Description: Domain to trust for auth redirects
  - Type: Non-sensitive
  - Value: Your production domain (e.g., beatforge.example.com)
  - Add as GitHub Variable (not secret): Settings → Variables
```

### Email Service Secrets (Optional)
```
RESEND_API_KEY (Optional)
  - Description: API key for email service (Resend)
  - Type: Sensitive
  - Where to get: https://resend.com/api-keys
  - Used for transactional emails (verification, payouts, etc)
  - Add as Repository Secret: If implementing email queues
```

### Feature Flag Keys (Optional)
```
TURNSTILE_SECRET_KEY
  - Description: Cloudflare Turnstile secret for bot protection
  - Type: Sensitive
  - Where to get: https://dash.cloudflare.com/turnstile
  - Add as Repository Secret
  - Already present in env validation (but optional)
```

### PostHog Analytics (Optional)
```
NEXT_PUBLIC_POSTHOG_KEY
  - Description: PostHog API key for analytics
  - Type: Non-sensitive (public key, safe to expose)
  - Where to get: https://posthog.com/
  - Add as GitHub Variable
```

## Setup Instructions

### Step 1: Gather Secrets
1. **Cloudflare**:
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create API token with "Edit Cloudflare Workers" permissions
   - Note your Account ID from https://dash.cloudflare.com/

2. **Stripe**:
   - Go to https://dashboard.stripe.com/apikeys
   - Copy Secret key (test or live)
   - Create webhook endpoint at https://dashboard.stripe.com/webhooks
   - Copy signing secret

3. **Neon**:
   - Go to https://console.neon.tech
   - Select project → Connection Details
   - Copy full connection string

4. **Generate Secrets**:
   ```bash
   # Better Auth Secret
   openssl rand -base64 32
   
   # Or use Node:
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

### Step 2: Add to GitHub
1. Go to repository: https://github.com/djmexxico1600/phase1
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with exact name (case-sensitive):

| Name | Value | Source |
|------|-------|--------|
| CLOUDFLARE_API_TOKEN | `sk_live_...` | Cloudflare console |
| CLOUDFLARE_ACCOUNT_ID | `abc123def456` | Cloudflare console |
| WRANGLER_API_TOKEN | `v1.xxx` | Cloudflare console |
| DATABASE_URL | `postgresql://user:pass@host/db` | Neon console |
| STRIPE_SECRET_KEY | `sk_test_xxxx` | Stripe console |
| STRIPE_WEBHOOK_SECRET | `whsec_xxxx` | Stripe webhooks |
| BETTER_AUTH_SECRET | `base64-encoded-string` | Generated locally |

### Step 3: Add GitHub Variables (Non-sensitive)
1. Go to **Settings** → **Secrets and variables** → **Variables**
2. Click **New repository variable**

| Name | Value |
|------|-------|
| BETTER_AUTH_TRUST_HOST | beatforge.example.com |

### Step 4: Verify Configuration
1. Go to **Actions** tab
2. Manually trigger `Deploy` workflow: **Run workflow**
3. Watch logs for successful deployment

## Environment File Reference

### `.env.production` (DO NOT COMMIT)
```
# Cloudflare
CLOUDFLARE_API_TOKEN=${{ secrets.CLOUDFLARE_API_TOKEN }}
CLOUDFLARE_ACCOUNT_ID=${{ secrets.CLOUDFLARE_ACCOUNT_ID }}

# Database
DATABASE_URL=${{ secrets.DATABASE_URL }}

# Stripe
STRIPE_SECRET_KEY=${{ secrets.STRIPE_SECRET_KEY }}
STRIPE_WEBHOOK_SECRET=${{ secrets.STRIPE_WEBHOOK_SECRET }}
STRIPE_PUBLISHABLE_KEY=pk_live_xxxx (set manually or in .env.local)

# Auth
BETTER_AUTH_SECRET=${{ secrets.BETTER_AUTH_SECRET }}
BETTER_AUTH_TRUST_HOST=${{ vars.BETTER_AUTH_TRUST_HOST }}

# Optional
RESEND_API_KEY=${{ secrets.RESEND_API_KEY }}
TURNSTILE_SECRET_KEY=${{ secrets.TURNSTILE_SECRET_KEY }}
NEXT_PUBLIC_POSTHOG_KEY=${{ vars.NEXT_PUBLIC_POSTHOG_KEY }}
```

## CI/CD Workflow Usage

The following workflows require these secrets:

### `.github/workflows/ci.yml`
- **Runs on**: PR to main/develop
- **Requires**: None (local tests only)
- **Output**: Test coverage reports

### `.github/workflows/preview.yml`
- **Runs on**: PR to main/develop
- **Requires**: 
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
  - `DATABASE_URL` (for preview branch)
- **Output**: Cloudflare Pages preview URL in PR comment

### `.github/workflows/deploy.yml`
- **Runs on**: Push to main
- **Requires**: 
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
  - `WRANGLER_API_TOKEN`
  - `DATABASE_URL` (production)
- **Output**: Live deployment at beatforge.pages.dev

## Sensitive Data Best Practices

1. **Never commit secrets** — All secrets in `.github/workflows/` must use `${{ secrets.SECRET_NAME }}`
2. **Rotate regularly** — Update tokens quarterly
3. **Least privilege** — Each token should have minimum required permissions
4. **Monitor access** — Check GitHub audit log for secret access
5. **Revoke immediately** — If compromised, regenerate token in source service

## Troubleshooting

### "Workflow file is invalid"
- Check secret names are exact case match
- Verify `${{ secrets.SECRET_NAME }}` syntax in workflow files

### "Unauthorized: 401"
- Verify API token has correct permissions
- Check token hasn't expired (Cloudflare tokens expire after 1 year)
- Ensure token is added to correct repository

### "Database connection failed"
- Verify DATABASE_URL is correct format
- Check Neon connection limit (Hyperdrive pooling helps)
- Ensure SSL mode is enabled (`?sslmode=require`)

### "Stripe webhook signature mismatch"
- Verify `STRIPE_WEBHOOK_SECRET` matches endpoint (not API key)
- Each webhook endpoint has unique signing secret
- Re-generate if uncertain

## Next Steps After Setup

1. **Trigger workflows**:
   ```bash
   git commit --allow-empty -m "chore: trigger workflows"
   git push origin main
   ```

2. **Check Actions tab** for successful deployment

3. **Test deployment**:
   - Visit https://beatforge.pages.dev
   - Test auth flow
   - Test beat upload
   - Verify Stripe webhook (use Stripe dashboard webhook testing)

4. **Monitor production**:
   - Enable Sentry error tracking
   - Enable PostHog analytics
   - Set up Cloudflare Analytics
