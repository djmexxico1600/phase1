# GitHub Secrets Checklist

## Quick Setup (5 minutes)

### ✅ Prerequisites
- [ ] GitHub repository access (djmexxico1600/phase1)
- [ ] Cloudflare account (https://dash.cloudflare.com)
- [ ] Stripe account (https://dashboard.stripe.com)
- [ ] Neon database (https://console.neon.tech)

### ✅ Step 1: Generate Secrets
```bash
# Generate BETTER_AUTH_SECRET
node -e "console.log('BETTER_AUTH_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
```

### ✅ Step 2: Gather from Services

**From Cloudflare (https://dash.cloudflare.com):**
- [ ] Account ID: `_____________________________`
- [ ] API Token: `_____________________________`
- [ ] Worker API Token: `_____________________________`

**From Stripe (https://dashboard.stripe.com/apikeys):**
- [ ] Secret Key (starts with sk_): `_____________________________`
- [ ] Webhook Signing Secret (from https://dashboard.stripe.com/webhooks): `_____________________________`

**From Neon (https://console.neon.tech):**
- [ ] Connection String: `_____________________________`

**Generated:**
- [ ] BETTER_AUTH_SECRET: `_____________________________`

### ✅ Step 3: Add to GitHub

Go to: https://github.com/djmexxico1600/phase1/settings/secrets/actions

Click **New repository secret** for each:

| # | Name | Value | Status |
|---|------|-------|--------|
| 1 | CLOUDFLARE_API_TOKEN | `sk_live_...` | ☐ |
| 2 | CLOUDFLARE_ACCOUNT_ID | `abc123...` | ☐ |
| 3 | WRANGLER_API_TOKEN | `v1.xxx...` | ☐ |
| 4 | DATABASE_URL | `postgresql://...` | ☐ |
| 5 | STRIPE_SECRET_KEY | `sk_test_...` | ☐ |
| 6 | STRIPE_WEBHOOK_SECRET | `whsec_...` | ☐ |
| 7 | BETTER_AUTH_SECRET | `base64...` | ☐ |

### ✅ Step 4: Verify Configuration

1. Go to **Actions** tab
2. See "CI" workflow status ✓
3. Manually run "Deploy" workflow
4. Watch logs — should complete in ~5 minutes

## Deployment Checklist

### Pre-Deployment
- [ ] All 7 secrets added to GitHub
- [ ] Local `.env.production` matches secrets (not committed)
- [ ] Cloudflare Pages project exists
- [ ] Neon database initialized
- [ ] Stripe webhook endpoint created

### Deploy
```bash
# Option 1: Manual (via GitHub UI)
- Go to Actions → Deploy → Run workflow

# Option 2: Via Git
git commit --allow-empty -m "trigger: deploy workflow"
git push origin main
```

### Post-Deployment
- [ ] Check Actions tab for successful deployment
- [ ] Visit https://beatforge.pages.dev
- [ ] Test sign-up flow
- [ ] Test beat upload
- [ ] Monitor Sentry/PostHog

### Troubleshooting

| Error | Solution |
|-------|----------|
| "Unauthorized 401" | Check Cloudflare API token permissions |
| "Database connection failed" | Verify DATABASE_URL and SSL mode |
| "Stripe webhook mismatch" | Use webhook signing secret, not API key |
| "Cannot find secrets" | Verify secret names are exact case match |

## Production Secrets Rotation

**Monthly**: Check Cloudflare Dashboard
**Quarterly**: Rotate API tokens
**Immediately if**: Suspect compromise

```bash
# To regenerate safely:
1. Create new token in service
2. Add as NEW secret in GitHub (e.g., STRIPE_SECRET_KEY_NEW)
3. Update workflow to use new secret
4. Test deployment
5. Delete old secret in GitHub
6. Revoke old token in service
```

## Security Notes

- ⚠️ Never log secrets in console output
- ⚠️ Never commit `.env.production` or `wrangler.toml` with real values
- ⚠️ Never share secrets in PRs or issues
- ✅ Always use `${{ secrets.NAME }}` in workflow files
- ✅ Rotate compromised tokens immediately

---

**Last Updated**: April 12, 2026
**Estimated Setup Time**: 15 minutes
