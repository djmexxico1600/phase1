# 🚀 COMPLETE BEATFORGE DEPLOYMENT CHECKLIST

## Phase 1: Code Fixes ✅
- [x] Fixed typo in `apps/web/src/server-actions/payments.ts`: `NEXT_PUBLIC_URL` → `NEXT_PUBLIC_APP_URL` (lines 46-47)
- [x] Verified environment variable schema in `apps/web/src/lib/env.ts`: All required vars defined
- [x] Build test confirms: App code is valid, only missing runtime environment variables

---

## Phase 2: GitHub Secrets Configuration 🔑

### 16 Required Secrets (GitHub → Settings → Secrets and Variables → Actions)

#### **Critical (Deployment Infrastructure)**
| Secret | Value | Source |
|--------|-------|--------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token | https://dash.cloudflare.com/profile/api-tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | https://dash.cloudflare.com/ (bottom left) |
| `WRANGLER_API_TOKEN` | Same as CLOUDFLARE_API_TOKEN (for wrangler CLI) | Same source |

#### **Database & Security**
| Secret | Value | Source |
|--------|-------|--------|
| `NEON_DATABASE_URL` | PostgreSQL connection string | https://console.neon.tech/ (create project) |
| `BETTER_AUTH_SECRET` | Random 32+ character string | Generate: `openssl rand -hex 32` |

#### **Stripe Payments**
| Secret | Value | Source |
|--------|-------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_*` (test) or `sk_live_*` (prod) | https://dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_*` | https://dashboard.stripe.com/webhooks (create endpoint) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_*` (test) or `pk_live_*` (prod) | https://dashboard.stripe.com/apikeys |

#### **Cloudflare R2 (Object Storage)**
| Secret | Value | Source |
|--------|-------|--------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | https://dash.cloudflare.com/ |
| `R2_ACCESS_KEY_ID` | R2 API token ID | https://dash.cloudflare.com/profile/api-tokens |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret | Same source |
| `R2_PUBLIC_URL` | https://pub.beatforge.com/ (or your R2 custom domain) | Set in R2 bucket settings |

#### **Email Service (Resend)**
| Secret | Value | Source |
|--------|-------|--------|
| `RESEND_API_KEY` | `re_*` | https://resend.com/api-keys |
| `EMAIL_FROM` | noreply@beatforge.io | Configure in Resend domain |

#### **OAuth (Optional, but recommended)**
| Secret | Value | Source |
|--------|-------|--------|
| `GITHUB_CLIENT_ID` | OAuth app ID | https://github.com/settings/developers |
| `GITHUB_CLIENT_SECRET` | OAuth app secret | Same source |
| `GOOGLE_CLIENT_ID` | OAuth client ID | https://console.cloud.google.com/ |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | Same source |

#### **Application URL (Post-Deployment)**
| Secret | Value | Source |
|--------|-------|--------|
| `NEXT_PUBLIC_APP_URL` | https://beatforge.pages.dev or your custom domain | Set after Pages deployment succeeds |

---

## Phase 3: Deploy to Cloudflare Pages

### 3.1 Prerequisites
- [ ] All 16 secrets configured in GitHub (or at least the 8 **Critical** ones)
- [ ] Cloudflare account created
- [ ] Pages project created: Go to https://dash.cloudflare.com → Pages → Create project

### 3.2 GitHub Workflow Deployment
**The workflow file is already in place at `.github/workflows/deploy.yml`**

1. **Trigger deployment:**
   ```bash
   git add -A
   git commit -m "fix: NEXT_PUBLIC_URL typo and configure env vars"
   git push origin main
   ```

2. **Monitor deployment:**
   - Go to your GitHub repo → Actions → Select the deployment workflow
   - Wait for build and deployment to complete
   - Expected artifact: `.vercel/output/static` directory

3. **Expected success output:**
   ```
   ✅ Build complete
   ✅ Pages deployment successful
   ✅ Available at: https://beatforge.pages.dev/
   ```

---

## Phase 4: Domain Configuration

### Option A: Use Auto-Generated Domain (Easiest)
- Once deployment succeeds, your app is live at:
  ```
  https://beatforge.pages.dev
  ```
- Set `NEXT_PUBLIC_APP_URL` secret to this URL
- Re-trigger workflow or manually run build

### Option B: Custom Domain (beatforge.io)
1. **Add to Cloudflare Pages:**
   - Pages project → Custom domains → Add
   - Enter: `beatforge.io`

2. **Update DNS at your registrar:**
   - Add CNAME record:
     ```
     Name: @
     Type: CNAME
     Value: beatforge.pages.dev
     ```

3. **Update GitHub secret:**
   - `NEXT_PUBLIC_APP_URL` = `https://beatforge.io`
   - Re-trigger deployment

### Option C: Subdomain (api.beatforge.io)
- Follow same process as Option B but use subdomain in DNS

---

## Phase 5: Verification Checklist

### Build Verification
- [ ] GitHub Actions workflow shows ✅ green check
- [ ] No build errors in workflow logs
- [ ] Deployment artifact generated

### Domain Verification
- [ ] Domain resolves: `curl -I https://beatforge.pages.dev`
  - Expected: `HTTP/2 200` or similar success code
- [ ] Site loads in browser without errors
- [ ] API endpoints responding (can test via dashboard)

### Application Verification
- [ ] Open: https://beatforge.pages.dev (or your domain)
- [ ] Check browser console for errors
- [ ] Test authentication flow (login/signup works)
- [ ] Test marketplace functionality (can browse beats)

### Stripe Integration Verification
- [ ] Checkout button appears on beat cards
- [ ] Checkout redirects to Stripe Payment page
- [ ] Webhook logs show successful payment events

---

## Phase 6: Troubleshooting

### Problem: "Domain not resolving"
**Causes & Fixes:**
1. Deployment hasn't completed → Check GitHub Actions workflow status
2. Domain not added to Pages → Add via Cloudflare dashboard
3. DNS not updated → Check registrar, wait 5-10 minutes for propagation
4. Wrong CNAME value → Verify points to `beatforge.pages.dev`

**Test:**
```bash
nslookup beatforge.io
# Should return Cloudflare IP address
```

### Problem: "Workflow fails during build"
**Causes & Fixes:**
1. Missing or incorrect GitHub secrets → Verify all 16 secrets in Actions settings
2. Invalid secret values (typos) → Test locally with dummy values first
3. Database URL invalid → Check Neon PostgreSQL connection string format

**Fix:**
1. Fix the secret
2. Re-run workflow from GitHub Actions tab
3. Check logs: Actions → Workflow → Failed step → View logs

### Problem: "Site loads but shows errors"
**Causes & Fixes:**
1. `NEXT_PUBLIC_APP_URL` not set → Update GitHub secret (post-deployment)
2. API endpoints failing → Check if Wrangler/Workers deployed
3. Database migrations not run → Run: `pnpm --filter @beatforge/db run migrate`

**Test endpoints:**
```bash
curl -X GET https://beatforge.pages.dev/api/beats \
  -H "Authorization: Bearer test"
```

---

## Phase 7: Post-Deployment

### Monitoring
- [ ] Set up Sentry error tracking: https://sentry.io/projects/
- [ ] Enable Cloudflare Analytics Engine
- [ ] Monitor uptime: https://status.io/ or similar

### Database
- [ ] Verify Neon dashboard shows production connection active
- [ ] Backup strategy set up (Neon auto-backup enabled)

### Security
- [ ] Run `git secret` to ensure no secrets in repo
- [ ] Review GitHub secret permissions (only deploy workflow needs access)
- [ ] Enable branch protection rules

---

## Quick Reference: ENV Var Validation

The app validates all environment variables at build-time. Missing vars will cause:
1. Build to fail in GitHub Actions
2. Error messages listing missing required variables

**Required during build:**
- NEON_DATABASE_URL
- BETTER_AUTH_SECRET
- BETTER_AUTH_URL
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- CLOUDFLARE_ACCOUNT_ID
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY
- R2_PUBLIC_URL
- RESEND_API_KEY
- EMAIL_FROM
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- NEXT_PUBLIC_APP_URL

---

## Complete Setup Command (For Reference)

If starting fresh, set all secrets at once (via GitHub CLI):

```bash
gh secret set NEON_DATABASE_URL --body "postgresql://..."
gh secret set BETTER_AUTH_SECRET --body "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
gh secret set BETTER_AUTH_URL --body "http://localhost:3000"
gh secret set STRIPE_SECRET_KEY --body "sk_test_..."
gh secret set STRIPE_WEBHOOK_SECRET --body "whsec_..."
gh secret set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY --body "pk_test_..."
gh secret set CLOUDFLARE_ACCOUNT_ID --body "xxxxxxxx"
gh secret set R2_ACCESS_KEY_ID --body "xxxxxxxx"
gh secret set R2_SECRET_ACCESS_KEY --body "xxxxxxxx"
gh secret set R2_PUBLIC_URL --body "https://pub.beatforge.com"
gh secret set RESEND_API_KEY --body "re_xxxxxxxx"
gh secret set EMAIL_FROM --body "noreply@beatforge.io"
gh secret set CLOUDFLARE_API_TOKEN --body "xxxxxxxx"
gh secret set WRANGLER_API_TOKEN --body "xxxxxxxx"
gh secret set GITHUB_CLIENT_ID --body "xxxxxxxx"  # Optional
gh secret set GITHUB_CLIENT_SECRET --body "xxxxxxxx"  # Optional
gh secret set GOOGLE_CLIENT_ID --body "xxxxxxxx"  # Optional
gh secret set GOOGLE_CLIENT_SECRET --body "xxxxxxxx"  # Optional
gh secret set NEXT_PUBLIC_APP_URL --body "https://beatforge.pages.dev"

# Then trigger deployment
git push origin main
```

---

## Questions?

Refer to:
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Next.js Deployment: https://nextjs.org/docs/deployment
- This project's DEPLOYMENT_GUIDE.md for additional context
- GitHub Actions logs for specific error messages

---

**Status:** ✅ Ready for Production Deployment  
**Updated:** April 22, 2026  
**Fixed Issues:** Typo in payments.ts, env var validation schema verified
