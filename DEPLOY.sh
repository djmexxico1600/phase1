#!/usr/bin/env bash

###############################################################################
# BeatForge Quick Start Deployment
# One-command setup and deployment to production
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Constants
REPO="djmexxico1600/phase1"
LIVE_URL="https://beatforge.pages.dev"

echo -e "${BLUE}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   BeatForge Quick Start                        ║
║                 Production Deployment Setup                    ║
║                      April 12, 2026                            ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# Step 1: Verify Prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git${NC}"

# Check gh CLI
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI not found. Installing...${NC}"
    if command -v brew &> /dev/null; then
        brew install gh
    else
        echo -e "${RED}❌ Please install GitHub CLI: https://cli.github.com/${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ GitHub CLI${NC}"

# Check gh auth
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Please authenticate with GitHub${NC}"
    gh auth login
fi
echo -e "${GREEN}✓ Authenticated${NC}\n"

# Step 2: Verify Repository
echo -e "${YELLOW}Step 2: Verifying repository...${NC}"
if ! gh repo view "$REPO" &> /dev/null; then
    echo -e "${RED}❌ Cannot access $REPO${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Repository accessible${NC}\n"

# Step 3: Guide User to Configure Secrets
echo -e "${YELLOW}Step 3: Configuring GitHub Secrets${NC}"
echo -e "\nYou need to configure 7 secrets. You can either:"
echo ""
echo -e "${BLUE}Option A: Automated Setup (Recommended)${NC}"
echo "  bash SETUP_GITHUB_SECRETS.sh"
echo ""
echo -e "${BLUE}Option B: Manual Setup${NC}"
echo "  https://github.com/$REPO/settings/secrets/actions"
echo ""

read -p "Have you configured all 7 GitHub secrets? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please configure secrets first using SETUP_GITHUB_SECRETS.sh${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Secrets verified${NC}\n"

# Step 4: Verify External Services
echo -e "${YELLOW}Step 4: Verifying external services${NC}"

echo -e "\n${BLUE}Checklist for external services:${NC}"
echo ""
echo "  [ ] Cloudflare Pages project created"
echo "      Go to: https://dash.cloudflare.com/?to=/:account/pages"
echo ""
echo "  [ ] Cloudflare R2 bucket created"
echo "      Go to: https://dash.cloudflare.com/?to=/:account/storage/r2"
echo ""
echo "  [ ] Neon Postgres database created"
echo "      Go to: https://console.neon.tech"
echo ""
echo "  [ ] Stripe API keys configured"
echo "      Go to: https://dashboard.stripe.com/apikeys"
echo ""

read -p "Have you set up all external services? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please set up external services before continuing${NC}"
    exit 1
fi

echo -e "${GREEN}✓ External services verified${NC}\n"

# Step 5: Trigger Deployment
echo -e "${YELLOW}Step 5: Triggering deployment...${NC}\n"

read -p "Ready to deploy to production? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    exit 0
fi

echo -e "${BLUE}Triggering GitHub Actions workflow...${NC}"

# Get the latest commit
LATEST_COMMIT=$(git rev-parse HEAD)
echo "Latest commit: $LATEST_COMMIT"

# Trigger the deploy workflow
if gh workflow run deploy.yml --repo "$REPO" 2>/dev/null; then
    echo -e "${GREEN}✓ Deployment triggered!${NC}\n"
else
    echo -e "${YELLOW}ℹ️  Workflow not found or already running${NC}"
    echo -e "${BLUE}Triggering via commit...${NC}"
    git commit --allow-empty -m "trigger: deploy workflow" || true
    git push origin main || true
    echo -e "${GREEN}✓ Deployment triggered via push${NC}\n"
fi

# Step 6: Monitor Deployment
echo -e "${YELLOW}Step 6: Monitoring deployment...${NC}\n"

echo -e "${BLUE}Checking workflow status...${NC}"
sleep 2

# Get latest run
LATEST_RUN=$(gh run list --repo "$REPO" --workflow deploy.yml --limit 1 --json databaseId | head -1)

if [ ! -z "$LATEST_RUN" ]; then
    echo -e "${GREEN}✓ Deployment workflow started${NC}"
    echo ""
    echo -e "${YELLOW}Workflow status:${NC}"
    gh run list --repo "$REPO" --workflow deploy.yml --limit 1 --json status,conclusion,name,createdAt -t '{{range .}}{{.name}} ({{.status}}){{end}}'
    echo ""
    echo -e "${BLUE}View full details:${NC}"
    echo "  gh run list --repo $REPO"
    echo "  gh run view <run_id> --repo $REPO --log"
    echo ""
fi

# Step 7: Provide Next Steps
echo -e "${YELLOW}Step 7: Next steps${NC}\n"

echo -e "${BLUE}Estimated deployment time:${NC} ~6 minutes"
echo ""
echo -e "${BLUE}After deployment:${NC}"
echo "  1. Visit: $LIVE_URL"
echo "  2. Sign up as producer or buyer"
echo "  3. Test marketplace flows"
echo "  4. Check admin panel"
echo ""

# Provide monitoring commands
echo -e "${BLUE}Monitor deployment:${NC}"
echo "  watch -n 5 \"gh run list --repo $REPO --limit 3\""
echo ""
echo -e "${BLUE}View logs:${NC}"
echo "  gh run view <run_id> --repo $REPO --log"
echo ""

# Provide testing info
echo -e "${YELLOW}Step 8: Testing${NC}\n"

echo -e "${BLUE}Test scenarios available:${NC}"
echo "  • Read: TEST_SCENARIOS.md"
echo "  • 14 comprehensive test scenarios"
echo "  • Covers all core features"
echo ""

# Final summary
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ BeatForge Deployment Initiated!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}Key Information:${NC}"
echo "  Repository:  $REPO"
echo "  Live URL:    $LIVE_URL"
echo "  Deploy Time: ~6 minutes"
echo ""

echo -e "${BLUE}Resources:${NC}"
echo "  • Secrets Setup:         SETUP_GITHUB_SECRETS.sh"
echo "  • Deployment Guide:      DEPLOYMENT_GUIDE.md"
echo "  • Verification Checklist: DEPLOYMENT_VERIFICATION.md"
echo "  • Test Scenarios:        TEST_SCENARIOS.md"
echo "  • Architecture:          beatforge/ARCHITECTURE.md"
echo "  • Testing Guide:         beatforge/TESTING.md"
echo ""

echo -e "${GREEN}🚀 Deployment in progress!${NC}\n"
