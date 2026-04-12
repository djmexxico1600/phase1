#!/bin/bash
###############################################################################
# Cloudflare Pages Configuration Helper
# This script explains how to properly set up Cloudflare Pages for BeatForge
###############################################################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║     Cloudflare Pages Configuration Helper                     ║
║     Setup Instructions for BeatForge                          ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

echo -e "${YELLOW}ℹ️  This project uses GitHub Actions for deployment${NC}"
echo -e "${YELLOW}   Do NOT use Cloudflare Pages direct git integration${NC}\n"

echo -e "${BLUE}Step 1: Verify GitHub Secrets${NC}"
echo "These must be configured in GitHub:"
echo "  https://github.com/djmexxico1600/phase1/settings/secrets/actions"
echo ""
echo "  ✓ CLOUDFLARE_API_TOKEN"
echo "  ✓ CLOUDFLARE_ACCOUNT_ID" 
echo "  ✓ WRANGLER_API_TOKEN"
echo "  ✓ DATABASE_URL"
echo "  ✓ STRIPE_SECRET_KEY"
echo "  ✓ STRIPE_WEBHOOK_SECRET"
echo "  ✓ BETTER_AUTH_SECRET"
echo ""

if command -v gh &> /dev/null && gh auth status &> /dev/null; then
    echo -e "${GREEN}✓ GitHub CLI authenticated${NC}"
    echo ""
    echo -e "${BLUE}Step 2: Configure Secrets${NC}"
    read -p "Configure GitHub secrets now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        bash SETUP_GITHUB_SECRETS.sh
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI not configured${NC}"
    echo "    Run: gh auth login"
    exit 1
fi

echo -e "${BLUE}Step 3: Verify Cloudflare Setup${NC}"
echo ""
echo "3a. Create D1 Database at:"
echo "    https://dash.cloudflare.com/sites/beatforge?to=/databases/d1"
echo "    Name: beatforge"
echo "    Save connection string to DATABASE_URL secret"
echo ""
echo "3b. Verify Account ID at:"
echo "    https://dash.cloudflare.com/sites"
echo "    Copy Account ID to CLOUDFLARE_ACCOUNT_ID secret"
echo ""

echo -e "${BLUE}Step 4: Deploy${NC}"
echo ""
echo "Push to main branch to trigger automatic deployment:"
echo "  git push origin main"
echo ""
echo "Monitor deployment:"
echo "  https://github.com/djmexxico1600/phase1/actions"
echo ""

echo -e "${BLUE}Step 5: Verify Live Site${NC}"
echo ""
echo "  Production: https://beatforge.pages.dev"
echo ""

echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "For troubleshooting, see:"
echo "  CLOUDFLARE_DEPLOYMENT.md"
echo "  CLOUDFLARE_PAGES_CONFIG.md"
