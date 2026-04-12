# BeatForge Deployment Guide

## Status: ✅ Ready for Deployment

**Repository**: https://github.com/djmexxico1600/phase1
**Latest Commit**: Main branch updated with 140+ production files + CI/CD pipeline
**Deployment Target**: Cloudflare Pages (beatforge.pages.dev)

---

## Pre-Deployment Checklist

### ✅ Code Ready
- [x] All 140+ files committed to main branch
- [x] Loops 1-5 complete (config, libs, components, features, CI/CD)
- [x] Type-safe end-to-end (TypeScript strict, Zod validation)
- [x] GitHub Actions workflows configured (ci.yml, deploy.yml, preview.yml)
- [x] Database schema ready (13 tables, Drizzle ORM)
- [x] Security hardened (CSP, HSTS, rate-limiting)

### ✅ Infrastructure Ready
- [x] Cloudflare Pages project created
- [x] Neon Postgres database initialized
- [x] Stripe account configured (test or production)
- [x] Better Auth secrets generated
- [x] API tokens obtained from services

### ⏳ Required: Configure GitHub Secrets (15 minutes)
- [ ] CLOUDFLARE_API_TOKEN
- [ ] CLOUDFLARE_ACCOUNT_ID
- [ ] WRANGLER_API_TOKEN
- [ ] DATABASE_URL
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] BETTER_AUTH_SECRET

---

## Deployment Steps

### Step 1: Configure GitHub Secrets
1. Go to: https://github.com/djmexxico1600/phase1/settings/secrets/actions
2. Click "New repository secret"
3. Add each of the 7 secrets from the checklist above
4. See [GITHUB_SECRETS_CHECKLIST.md](./GITHUB_SECRETS_CHECKLIST.md) for detailed instructions

### Step 2: Verify Workflows Are Ready
1. Go to: https://github.com/djmexxico1600/phase1/actions
2. Confirm you see 3 workflows:
   - ✅ CI (runs on PR)
   - ✅ Deploy (runs on main push)
   - ✅ Preview (runs on PR)

### Step 3: Trigger Deployment
**Option A: Via CLI** (recommended for testing)
```bash
# Ensure you're on main
git checkout main

# Create empty commit to trigger workflow
git commit --allow-empty -m "trigger: deploy to production"
git push origin main

# Then watch Actions tab for deployment
```

**Option B: Via GitHub UI**
1. Go to https://github.com/djmexxico1600/phase1/actions
2. Select "Deploy" workflow
3. Click "Run workflow" → "Run workflow"
4. Watch logs for success

### Step 4: Verify Live Deployment
1. Visit: https://beatforge.pages.dev (after ~5-10 minutes)
2. Test core flows:
   - [ ] Sign up as producer
   - [ ] Upload test beat (or see upload page)
   - [ ] Browse marketplace
   - [ ] Add beat to cart
   - [ ] View checkout page (Stripe test)
   - [ ] View admin panel (if admin user)

---

## Deployment Workflow Details

### CI Workflow (.github/workflows/ci.yml)
**Triggers**: Push to main/develop, Pull Requests
**Steps**:
1. Checkout code
2. Install pnpm + Node 20
3. Run `pnpm run lint` — Check code style
4. Run `pnpm run type-check` — TypeScript strict type checking
5. Run `pnpm run format:check` — Prettier code formatting
6. Run `pnpm run test:run` — Vitest unit tests
7. Run `pnpm run test:cov` — Generate coverage report

**Expected Time**: ~3-5 minutes
**Failure Recovery**: Fix linting/types, push new commit

### Deploy Workflow (.github/workflows/deploy.yml)
**Triggers**: Push to main branch only
**Steps**:
1. Checkout code
2. Install dependencies (`pnpm install`)
3. Build web app for Cloudflare Pages (`pnpm --filter @beatforge/web run build`)
   - Outputs to `apps/web/.vercel/output/static`
   - Uses all required environment variables
4. Verify Pages artifact exists
5. Deploy to Cloudflare Pages via GitHub Actions
   - Uses `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
   - Publishes `apps/web/.vercel/output/static`
6. Build and deploy Hono Workers API (`pnpm run deploy:api`)
   - Uses `WRANGLER_API_TOKEN`
7. Run database migrations (`pnpm run db:migrate:prod`)
   - Uses `DATABASE_URL`

**Important**: Do NOT manually run `npx wrangler deploy` from the repo root
- The root `wrangler.toml` is a guard file (intentionally not deployable)
- GitHub Actions handles all deployments via the Pages API and Wrangler

**Expected Time**: ~5-10 minutes
**Automatic**: Database migrations run after successful deployment

### Preview Workflow (.github/workflows/preview.yml)
**Triggers**: Pull Requests to main/develop
**Steps**:
1. Deploy preview to Cloudflare Pages (branch URL)
2. Comment PR with preview link
3. Run E2E tests (`pnpm run test:e2e`)

**Use Case**: Test changes on live URL before merging

---

## Monitoring Deployment

### GitHub Actions Dashboard
Check: https://github.com/djmexxico1600/phase1/actions

**Green ✅**: All steps passed
**Red ❌**: One or more steps failed (check logs)
**Yellow ⏳**: Currently running

### Common Deployment Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Could not detect a directory containing static files" | Cloudflare Pages is configured to run custom build instead of GitHub Actions | Go to Cloudflare Pages Settings > Builds & deployments: Clear "Build command" field, leave blank. Let GitHub Actions handle deployment. See CLOUDFLARE_PAGES_CONFIG.md |
| "Unauthorized 401" | Invalid/missing API token | Re-check Cloudflare/Wrangler tokens in GitHub Secrets |
| "Secret not found" | Secret name typo | Verify exact secret names (case-sensitive) |
| "Database connection failed" | Bad DATABASE_URL | Verify Neon connection string format |
| "Stripe webhook mismatch" | Using API key instead of webhook secret | Use webhook signing secret, not API key |
| "Build failed: missing module" | Dependency issue | Run `pnpm install` locally and commit lock file |

### Logs
1. Go to Actions → Click failing workflow
2. Click failing job (e.g., "Deploy")
3. Expand step with error
4. Read full error message and fix

---

## Post-Deployment Checklist

### ✅ Verify Production
- [ ] Visit https://beatforge.pages.dev
- [ ] Page loads without errors
- [ ] All assets load (CSS, images, fonts)
- [ ] Hero section responsive (mobile + desktop)

### ✅ Test Core Flows
- [ ] Auth flow: Sign up → Email verification → Login
- [ ] Marketplace: Browse beats with filters/search
- [ ] Producer dashboard: Upload beat or view dashboard
- [ ] Cart: Add beat → View cart → See checkout
- [ ] Admin: View admin panel (if admin account created)

### ✅ Verify Integrations
- [ ] Stripe Checkout appears in cart → checkout
- [ ] Webhook signing in place (test via Stripe dashboard)
- [ ] Environment variables loaded (check console logs for no undefined)
- [ ] Database queries work (producer list, beat browsing)

### ✅ Monitoring
- [ ] Sentry configured and receiving errors (if enabled)
- [ ] PostHog tracking events (if enabled)
- [ ] Cloudflare Analytics active
- [ ] Error boundaries working (test 404 page)

---

## Rollback Procedure

If deployment fails and you need to revert:

```bash
# View commit history
git log --oneline

# Revert to previous working commit
git revert <commit-hash>

# Push (will trigger deploy of previous version)
git push origin main
```

Cloudflare will automatically re-deploy the previous version.

---

## Maintenance

### Weekly
- [ ] Monitor GitHub Actions dashboard for failed deployments
- [ ] Check Sentry for new errors

### Monthly
- [ ] Review Cloudflare analytics
- [ ] Check database disk usage
- [ ] Review Stripe transactions (test mode)

### Quarterly
- [ ] Rotate API tokens
- [ ] Update dependencies (`pnpm update`)
- [ ] Run security audit (`pnpm audit`)

---

## Next Steps After Deployment

### 1. Domain Setup
```bash
# Add custom domain to Cloudflare Pages project
# Then update:
- BETTER_AUTH_TRUST_HOST to your domain
- NEXT_PUBLIC_APP_URL to your domain
- All environment variables referencing domain
```

### 2. SSL/TLS
- Enabled automatically on Cloudflare Pages
- HSTS headers configured in middleware

### 3. Email Setup (Optional)
```bash
# If using Resend for transactional emails:
1. Add RESEND_API_KEY to secrets
2. Update email templates in packages/api/src/routes/queues.ts
3. Deploy workers: pnpm run deploy:api
```

### 4. Monitoring & Alerts
```bash
# Set up error tracking
1. Create Sentry project
2. Add SENTRY_DSN to secrets
3. Errors automatically reported

# Set up analytics
1. Create PostHog project
2. Add NEXT_PUBLIC_POSTHOG_KEY
3. Track user behavior
```

### 5. Production Stripe
- [ ] Upgrade Stripe to live account
- [ ] Update STRIPE_SECRET_KEY (sk_live_...)
- [ ] Update STRIPE_PUBLISHABLE_KEY (pk_live_...)
- [ ] Update Stripe webhook signing secret
- [ ] Test payment flow end-to-end

---

## Troubleshooting

### "Workflow didn't trigger after commit"
1. Make sure you're on main branch
2. Wait 1-2 minutes
3. Check Actions tab for recent runs
4. If nothing, manually trigger: Actions → Deploy → Run workflow

### "Deploy succeeded but site is blank"
1. Check Cloudflare build directory: should be `apps/web/.next`
2. Verify build step executed successfully
3. Check browser console for JavaScript errors
4. Clear browser cache: Cmd+Shift+Delete (Chrome) or Cmd+Option+E (Safari)

### "Database connection timeout"
1. Verify DATABASE_URL is correct
2. Check Neon connection limit
3. Verify SSL mode: `?sslmode=require`
4. Test locally: `psql $DATABASE_URL -c "SELECT 1"`

### "Stripe webhook not receiving events"
1. Go to https://dashboard.stripe.com/webhooks
2. Check endpoint is active and responding
3. Get signing secret from webhook details page
4. Verify secret in STRIPE_WEBHOOK_SECRET matches exactly
5. Test webhook: Dashboard → Webhooks → Select → Send test event

---

## Support

- **GitHub Issues**: Create issue in https://github.com/djmexxico1600/phase1
- **Documentation**: See [ARCHITECTURE.md](./beatforge/ARCHITECTURE.md) and [TESTING.md](./beatforge/TESTING.md)
- **Secrets Guide**: See [GITHUB_SECRETS.md](./GITHUB_SECRETS.md)

---

**Last Updated**: April 12, 2026
**Status**: ✅ Ready for deployment (pending GitHub secrets configuration)
