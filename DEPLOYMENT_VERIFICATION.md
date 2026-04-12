## BeatForge Deployment Verification Guide

This guide helps you verify each step of the deployment process and test the live BeatForge application.

---

## Pre-Deployment Checklist ✓

### Step 1: GitHub Secrets Configuration

All 7 required secrets must be set before deployment:

```bash
# View configured secrets
gh secret list --repo djmexxico1600/phase1

# Expected output (7 secrets):
BETTER_AUTH_SECRET
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
DATABASE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
WRANGLER_API_TOKEN
```

**Setup with script:**
```bash
bash SETUP_GITHUB_SECRETS.sh djmexxico1600/phase1
```

**Or manual setup:** https://github.com/djmexxico1600/phase1/settings/secrets/actions

---

## Step 2: Verify External Services

### Cloudflare Account
- [ ] API Token created at https://dash.cloudflare.com/profile/api-tokens
- [ ] Account ID visible at https://dash.cloudflare.com/
- [ ] Pages project created: https://dash.cloudflare.com/?to=/:account/pages
- [ ] R2 bucket configured for uploads

### Neon Postgres Database
- [ ] Project created at https://console.neon.tech
- [ ] Connection string obtained (DATABASE_URL format: `postgresql://user:password@host/dbname`)
- [ ] Database initialized (migrations will run on first deploy)

### Stripe Account
- [ ] API Keys obtained: https://dashboard.stripe.com/apikeys
- [ ] Webhook endpoint configured: `/api/webhooks/stripe`
- [ ] Webhook signing secret copied to STRIPE_WEBHOOK_SECRET

### Better Auth Secret
Generate a random secret:
```bash
# On your machine
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Copy output to BETTER_AUTH_SECRET
```

---

## Step 3: Trigger Deployment

### Via GitHub CLI
```bash
# Trigger the deploy workflow
gh workflow run deploy.yml --repo djmexxico1600/phase1

# Monitor deployment
gh run list --repo djmexxico1600/phase1 --workflow deploy.yml
```

### Via GitHub Web UI
1. Go to: https://github.com/djmexxico1600/phase1/actions
2. Select "Deploy" workflow
3. Click "Run workflow"
4. Select "main" branch and click "Run workflow"

### Via Git Command
```bash
# Trigger via empty commit
git commit --allow-empty -m "trigger: deploy workflow"
git push origin main
```

---

## Deployment Timeline

| Stage | Duration | Status |
|-------|----------|--------|
| Trigger | Immediate | Workflow queued |
| Checkout Code | ~30s | Pulling repository |
| Install Dependencies | ~90s | pnpm install |
| Lint & Type Check | ~60s | Catching errors |
| Build Next.js | ~120s | Compiling app |
| Build Hono API | ~30s | Cloudflare Worker |
| Deploy to Pages | ~60s | Live at beatforge.pages.dev |
| Run Migrations | ~30s | Database schema setup |
| Deploy Workers | ~30s | Background jobs online |
| **Total** | **~6 minutes** | 🎉 **Live** |

---

## Post-Deployment Verification

### 1. Verify Deployment Success

```bash
# Check latest workflow run
gh run list --repo djmexxico1600/phase1 --limit 1

# View detailed logs
gh run view <run_id> --repo djmexxico1600/phase1 --log
```

### 2. Access Live Site

**Production URL**: https://beatforge.pages.dev

**Expected to see:**
- [ ] BeatForge logo + hero section loads
- [ ] Navigation bar fully responsive
- [ ] No console errors (open DevTools F12)

### 3. Test Core Routes

**Public Routes (no auth required):**
```
✓ GET  /                          → Hero landing page
✓ GET  /marketplace/beats         → Beat listing (empty initially)
✓ GET  /auth/login                → Login form
✓ GET  /auth/register             → Registration form
```

Test each by visiting in browser. Should receive 200 status.

### 4. Test Authentication Flow

**Step 1: Sign Up**
1. Go to: https://beatforge.pages.dev/auth/register
2. Select "Producer" role
3. Enter:
   - Name: "Test Producer"
   - Email: `test+beatforge@example.com`
   - Password: `SecurePass123!`
4. Click "Create Account"

**Expected:**
- [ ] Redirect to `/auth/verify-email`
- [ ] Success message displays
- [ ] No database errors in browser console

**Step 2: Login**
1. Go to: https://beatforge.pages.dev/auth/login
2. Enter test email + password
3. Click "Sign In"

**Expected:**
- [ ] Redirect to `/dashboard` (if producer)
- [ ] Session cookie set (check DevTools → Application → Cookies)
- [ ] User name displays in header

### 5. Test Protected Routes

Once logged in as producer:

```
✓ GET  /dashboard                 → Overview + stats
✓ GET  /dashboard/beats           → Beat management
✓ GET  /dashboard/analytics       → Analytics page
✓ GET  /dashboard/earnings        → Earnings page
✓ GET  /dashboard/settings        → Profile settings
```

### 6. Test UI Components

Visit various pages and verify:
- [ ] Button components respond to clicks
- [ ] Forms accept input (no console errors)
- [ ] Modals open/close smoothly
- [ ] Responsive design (check mobile via DevTools)
- [ ] Dark mode toggles (if implemented)

### 7. Test API Routes

```bash
# Health check
curl https://beatforge.pages.dev/api/health

# Expected: {"status":"ok"}
```

### 8. Database Connection Verification

Check that database is connected by visiting dashboard:
- Dashboard should load with empty stats (0 beats, 0 sales)
- No "Database Error" messages should appear
- Navigation works smoothly

---

## Common Deployment Issues

### Issue: 502 Bad Gateway

**Cause**: Database connection failed or migration didn't run

**Fix**:
```bash
# Check workflow logs for migration errors
gh run view <run_id> --log | grep -A 10 "migrate"

# Manually trigger migrations (if Neon CLI available)
pnpm migrate:prod
```

### Issue: Secrets Not Found

**Cause**: Secrets weren't configured before deployment

**Fix**:
```bash
# View secret list
gh secret list --repo djmexxico1600/phase1

# Add missing secrets
gh secret set STRIPE_SECRET_KEY --repo djmexxico1600/phase1
```

### Issue: Build Fails with TypeScript Errors

**Cause**: Type errors introduced in code

**Fix**:
```bash
# Run locally to debug
pnpm type-check

# View detailed build error in workflow logs
gh run view <run_id> --log
```

### Issue: Cloudflare Pages Project Not Found

**Cause**: Pages project wasn't created in Cloudflare dashboard

**Fix**:
1. Go to https://dash.cloudflare.com/?to=/:account/pages
2. Create new Pages project
3. Connect to GitHub repo `djmexxico1600/phase1`
4. Select branch: `main`
5. Build settings: Auto-detect
6. Deploy

---

## Performance Verification

### Lighthouse Score Check

```bash
# Using npx
npx lighthouse https://beatforge.pages.dev --view

# Expected scores:
# Performance: 75+
# Accessibility: 95+
# Best Practices: 90+
# SEO: 100
```

### Core Web Vitals

Open https://beatforge.pages.dev in Chrome and check:
- **LCP** (Largest Contentful Paint): < 1.5s ✓
- **FID** (First Input Delay): < 100ms ✓
- **CLS** (Cumulative Layout Shift): < 0.1 ✓

### Page Load Time

```bash
curl -w "Total: %{time_total}s\n" https://beatforge.pages.dev
```

Expected: < 2 seconds for first load

---

## Monitoring & Observability

### GitHub Actions Monitoring

```bash
# Watch deployments in real-time
watch -n 5 "gh run list --repo djmexxico1600/phase1 --limit 3"

# Get specific run info
gh run view <run_id> --repo djmexxico1600/phase1

# View all commits with deployment status
gh api repos/djmexxico1600/phase1/commits --jq '.[] | {sha: .sha, message: .commit.message, status: .commit.verification.verified}'
```

### Sentry Error Tracking

If Sentry is configured:
1. Go to: https://sentry.io/organizations/your-org/issues/
2. Should show 0 errors initially
3. Errors will appear after user interactions

### PostHog Analytics

If PostHog is configured:
1. Go to: https://app.posthog.com
2. Events should appear as users interact
3. Dashboard shows real-time usage

---

## Rollback Procedure

If deployment fails:

```bash
# Disable Pages deployment (revert to previous)
gh api repos/djmexxico1600/phase1/pages/builds/latest/status

# Or manually revert commit
git revert <deployment_commit_sha>
git push origin main
```

---

## Success Criteria ✓

Deployment is successful when:

- [x] All 7 GitHub secrets configured
- [x] No auth failures in workflow logs
- [x] Build completes with 0 errors
- [x] Live site loads at beatforge.pages.dev
- [x] Hero page renders correctly
- [x] Auth routes work (sign up, login)
- [x] Database migrations completed
- [x] Core Web Vitals are healthy
- [x] No Sentry errors showing

---

## Next Steps After Deployment

1. **Seed Test Data**
   ```bash
   pnpm seed
   ```
   Adds 3 producers, 5 buyers, 10 sample beats

2. **Test Full User Flows**
   - Producer: Upload beat → Monitor dashboard
   - Buyer: Browse → Buy license → Download
   - Admin: Verify producer → Approve

3. **Configure Email Notifications** (Optional)
   - Set `RESEND_API_KEY` for transactional emails
   - Test sign-up confirmation email

4. **Setup Stripe Webhook Testing**
   - Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
   - Forward events: `stripe listen --forward-to beatforge.pages.dev/api/webhooks/stripe`

5. **Monitor Production**
   - Watch Sentry for errors
   - Check PostHog for usage metrics
   - Review CloudFlare analytics

---

## Support & Troubleshooting

**For detailed help:**
- See [GITHUB_SECRETS.md](GITHUB_SECRETS.md)
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- See [ARCHITECTURE.md](beatforge/ARCHITECTURE.md)

**Report issues:**
```bash
# Create issue on GitHub
gh issue create --repo djmexxico1600/phase1 --title "Deployment Issue: [description]"
```

---

**Last Updated**: April 12, 2026
**Status**: Ready for Production Deployment 🚀
