📋 CLOUDFLARE PAGES CONFIGURATION GUIDE

This file explains how to properly configure Cloudflare Pages for BeatForge.

═══════════════════════════════════════════════════════════════════

❌ WHAT NOT TO DO:

1. Do NOT create a Cloudflare Pages project manually
   → Manual deployment will fail with "Could not detect static files"

2. Do NOT set deploy command to: "npx wrangler deploy"
   → This tries to deploy the entire monorepo as a Worker

3. Do NOT use Cloudflare Pages direct git integration
   → It doesn't understand the monorepo + GitHub Actions setup

═══════════════════════════════════════════════════════════════════

✅ CORRECT SETUP:

The deployment is handled entirely by GitHub Actions:

File: .github/workflows/deploy.yml

Deployment flow:
  1. Push to main branch
  2. GitHub Actions triggered automatically
  3. Tests run: pnpm test:run
  4. Build Web App: pnpm run build
  5. Deploy to Pages: Using Pages API from GitHub Actions
  6. Deploy API: pnpm run deploy:api (to Cloudflare Workers)
  7. Run migrations: pnpm run db:migrate:prod

═══════════════════════════════════════════════════════════════════

🔧 ONE-TIME CLOUDFLARE SETUP:

1. Cloudflare Dashboard:
   https://dash.cloudflare.com

2. Create D1 Database:
   - Name: "beatforge"
   - Save the connection string to DATABASE_URL secret

3. Create GitHub Deploy Token:
   - Settings > API Tokens > Create Custom Token
   - Permissions: Account Cloudflare Pages:Edit
   - Save as CLOUDFLARE_API_TOKEN secret

4. Get Account ID:
   - Copy from: https://dash.cloudflare.com/sites
   - Save as CLOUDFLARE_ACCOUNT_ID secret

5. GitHub Secrets Setup:
   bash SETUP_GITHUB_SECRETS.sh

═══════════════════════════════════════════════════════════════════

🚀 FIRST DEPLOYMENT:

After configuring GitHub secrets:

  git push origin main

Then watch:
  https://github.com/djmexxico1600/phase1/actions

═══════════════════════════════════════════════════════════════════

📝 For Deployment Issues:

1. Check GitHub Actions logs:
   https://github.com/djmexxico1600/phase1/actions

2. Check Cloudflare Pages logs:
   https://dash.cloudflare.com/sites/beatforge

3. See troubleshooting:
   ../CLOUDFLARE_DEPLOYMENT.md#troubleshooting

═══════════════════════════════════════════════════════════════════

⚡ Quick Reference:

Production URL:     https://beatforge.pages.dev
Pages Dashboard:    https://dash.cloudflare.com/sites/beatforge
Workers Dashboard:  https://dash.cloudflare.com/workers
API Tokens:         https://dash.cloudflare.com/profile/api-tokens
GitHub Workflows:   .github/workflows/

═══════════════════════════════════════════════════════════════════
