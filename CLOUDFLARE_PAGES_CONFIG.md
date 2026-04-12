📋 CLOUDFLARE PAGES CONFIGURATION GUIDE

This file explains how to properly configure Cloudflare Pages for BeatForge.

═══════════════════════════════════════════════════════════════════

❌ WHAT NOT TO DO:

1. Do NOT create a Cloudflare Pages project manually with a custom build command
   → Custom build commands cannot access the full app environment
   → Deployments will fail with "Could not detect static files"

2. Do NOT set deploy command to: "npx wrangler deploy"
   → This tries to deploy the entire monorepo as a Worker
   → The root wrangler.toml is intentionally a guard file (not deployable)

3. Do NOT use Cloudflare Pages direct git integration with a custom build
   → It doesn't have access to your environment variables for the Next.js build
   → Builds will fail due to missing dependencies and configuration

✅ CORRECT SETUP:

The deployment is handled entirely by GitHub Actions, NOT Cloudflare Pages direct integration.

GitHub Actions does:
  1. Install dependencies
  2. Build the web app with full environment setup
  3. Upload the static output to Cloudflare Pages via the Pages API

═══════════════════════════════════════════════════════════════════

🔧 CLOUDFLARE PAGES CONFIGURATION (ONE-TIME SETUP):

This setup assumes you have a Cloudflare Pages project created already.

Step 1: In the Cloudflare Dashboard (https://dash.cloudflare.com/):
   - Go to Pages > beatforge
   - Settings > Builds & deployments
   - Build command: LEAVE BLANK (GitHub Actions will deploy directly)
   - Build output directory: LEAVE BLANK
   - Environment variables: LEAVE BLANK (stored in GitHub Secrets)

Step 2: In GitHub (https://github.com/djmexxico1600/phase1):
   - Settings > Secrets and variables > Actions
   - Add the deployment secrets listed below

═══════════════════════════════════════════════════════════════════

📋 REQUIRED GITHUB SECRETS:

These secrets are used by GitHub Actions to deploy to Cloudflare Pages:

CLOUDFLARE_API_TOKEN
  - Description: Cloudflare API token for Pages deployment
  - How to get:
    - Cloudflare Dashboard > My Account > API Tokens
    - Create Custom Token
    - Permissions: Cloudflare Pages Editor
    - Add to GitHub as CLOUDFLARE_API_TOKEN

CLOUDFLARE_ACCOUNT_ID
  - Description: Your Cloudflare account ID
  - How to get:
    - Cloudflare Dashboard > Pages > beatforge
    - Copy account ID from the URL or Settings page
    - Add to GitHub as CLOUDFLARE_ACCOUNT_ID

Other required secrets (for the Next.js build):
  - STRIPE_SECRET_KEY: Stripe API secret key
  - STRIPE_WEBHOOK_SECRET: Stripe webhook secret
  - DATABASE_URL: PostgreSQL connection string (Neon)
  - BETTER_AUTH_SECRET: Random secret for authentication
  - NEXT_PUBLIC_APP_URL: Public app URL (e.g., https://beatforge.pages.dev)
  - NEXT_PUBLIC_POSTHOG_KEY: PostHog analytics key (optional)
  - NEXT_PUBLIC_POSTHOG_HOST: PostHog host URL (optional)
  - DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET: Discord OAuth credentials
  - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET: GitHub OAuth credentials
  - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET: Google OAuth credentials
  - WRANGLER_API_TOKEN: Cloudflare API token for Workers API deployment

═══════════════════════════════════════════════════════════════════

🚀 TROUBLESHOOTING: "Could not detect a directory containing static files"

This error means Cloudflare Pages is NOT using GitHub Actions for deployment.

Solution:
  1. Check the Cloudflare Pages project settings
  2. REMOVE any custom build command (should be blank)
  3. Make sure the Pages project is connected to GitHub AND
     Cloudflare Pages is configured to automatically deploy from GitHub Actions
  4. OR disable the Cloudflare Pages custom deployment and use GitHub Actions exclusively

Correct flow:
  1. Code pushed to main branch
  2. GitHub Actions workflow runs (deploy.yml)
  3. GitHub Actions builds the Next.js app with full environment
  4. GitHub Actions uploads the static output to Cloudflare Pages via API
  5. Cloudflare Pages serves the static site

═══════════════════════════════════════════════════════════════════

⚡ VERIFY CORRECT SETUP:

After configuring GitHub secrets and Cloudflare settings:

  git push origin main

Watch the deployment:
  - GitHub Actions: https://github.com/djmexxico1600/phase1/actions
  - Check the "Deploy" workflow for success
  - View logs if deployment fails

Cloudflare Pages dashboard (should show deployment from GitHub Actions):
  - https://dash.cloudflare.com/?to=/:account/pages/view/beatforge

═══════════════════════════════════════════════════════════════════

📝 MORE INFO:

- GitHub Actions Workflow: .github/workflows/deploy.yml
- Pages Documentation: https://developers.cloudflare.com/pages/get-started/guide/
- Pages GitHub Integration: https://developers.cloudflare.com/pages/get-started/guide/#connect-your-github-account
- Troubleshooting: ../DEPLOYMENT_GUIDE.md#troubleshooting

═══════════════════════════════════════════════════════════════════

