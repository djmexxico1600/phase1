#!/usr/bin/env bash
# This file is to prevent accidental wrangler deployments from the root
# 
# BeatForge deployment is handled by GitHub Actions, not direct wrangler commands
# 
# To deploy correctly:
# 1. Push to main branch
# 2. GitHub Actions automatically deploys both Pages and Workers
# 
# See: CLOUDFLARE_DEPLOYMENT.md for complete deployment guide
#
# The actual wrangler config for the API is at:
#   packages/api/wrangler.toml

echo "ERROR: Direct wrangler deployment not supported at root level"
echo ""
echo "This is a GitHub Actions project. Deploy by:"
echo "  git push origin main"
echo ""
echo "For manual API-only deployment:"
echo "  pnpm run deploy:api"
echo ""
echo "See CLOUDFLARE_DEPLOYMENT.md for details"
exit 1
