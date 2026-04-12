#!/bin/bash

###############################################################################
# BeatForge GitHub Secrets Setup Script
# Automates the configuration of all required GitHub repository secrets
# Usage: bash SETUP_GITHUB_SECRETS.sh <repo_url> <cloudflare_token> <cloudflare_account_id> ...
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}BeatForge GitHub Secrets Setup${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed.${NC}"
    echo "Install from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Please authenticate with GitHub CLI:${NC}"
    gh auth login
    echo ""
fi

# Get repo from command or current directory
REPO="${1:-djmexxico1600/phase1}"

# Verify repo exists and user has access
echo -e "${YELLOW}Verifying repository access: ${REPO}${NC}"
if ! gh repo view "$REPO" &> /dev/null; then
    echo -e "${RED}Error: Cannot access repository ${REPO}${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Verified access to ${REPO}${NC}\n"

# Function to set a secret
set_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3

    if [[ -z "$secret_value" ]]; then
        echo -e "${YELLOW}⚠ Skipping ${secret_name}: No value provided${NC}"
        return
    fi

    echo -e "${YELLOW}Setting ${secret_name}...${NC}"
    echo "$secret_value" | gh secret set "$secret_name" --repo "$REPO" --body -
    echo -e "${GREEN}✓ ${secret_name} set${NC} (${description})"
}

# Interactive mode if no args passed beyond repo
if [[ $# -le 1 ]]; then
    echo -e "${YELLOW}Interactive Mode - Enter secret values (leave blank to skip)${NC}\n"

    read -p "1. Cloudflare API Token: " CF_API_TOKEN
    read -p "2. Cloudflare Account ID: " CF_ACCOUNT_ID
    read -p "3. Cloudflare Wrangler Token: " WRANGLER_TOKEN
    read -p "4. Neon Database URL (postgresql://...): " DATABASE_URL
    read -p "5. Stripe Secret Key: " STRIPE_SECRET
    read -p "6. Stripe Webhook Secret: " STRIPE_WEBHOOK
    read -p "7. Better Auth Secret (run: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\") [auto-generate? y/n]: " AUTO_AUTH_SECRET

    if [[ "$AUTO_AUTH_SECRET" == "y" ]]; then
        BETTER_AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
        echo -e "${GREEN}Generated: ${BETTER_AUTH_SECRET}${NC}"
    else
        read -p "   Better Auth Secret: " BETTER_AUTH_SECRET
    fi

    # Optional secrets
    echo ""
    read -p "8. (Optional) Resend API Key: " RESEND_API_KEY
    read -p "9. (Optional) Turnstile Secret Key: " TURNSTILE_SECRET
    read -p "10. (Optional) PostHog API Key: " POSTHOG_KEY

    echo ""
else
    # Parse from command line args
    CF_API_TOKEN="$2"
    CF_ACCOUNT_ID="$3"
    WRANGLER_TOKEN="$4"
    DATABASE_URL="$5"
    STRIPE_SECRET="$6"
    STRIPE_WEBHOOK="$7"
    BETTER_AUTH_SECRET="$8"
    RESEND_API_KEY="${9}"
    TURNSTILE_SECRET="${10}"
    POSTHOG_KEY="${11}"
fi

# Set all secrets
echo -e "\n${YELLOW}Setting repository secrets...${NC}\n"

set_secret "CLOUDFLARE_API_TOKEN" "$CF_API_TOKEN" "Production deployments"
set_secret "CLOUDFLARE_ACCOUNT_ID" "$CF_ACCOUNT_ID" "Pages configuration"
set_secret "WRANGLER_API_TOKEN" "$WRANGLER_TOKEN" "Workers deployments"
set_secret "DATABASE_URL" "$DATABASE_URL" "Neon Postgres connection"
set_secret "STRIPE_SECRET_KEY" "$STRIPE_SECRET" "Stripe API"
set_secret "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK" "Webhook verification"
set_secret "BETTER_AUTH_SECRET" "$BETTER_AUTH_SECRET" "Session encryption"

# Optional secrets
if [[ ! -z "$RESEND_API_KEY" ]]; then
    set_secret "RESEND_API_KEY" "$RESEND_API_KEY" "Email service"
fi

if [[ ! -z "$TURNSTILE_SECRET" ]]; then
    set_secret "TURNSTILE_SECRET_KEY" "$TURNSTILE_SECRET" "Bot protection"
fi

if [[ ! -z "$POSTHOG_KEY" ]]; then
    set_secret "NEXT_PUBLIC_POSTHOG_KEY" "$POSTHOG_KEY" "Analytics"
fi

# Verify secrets were set
echo -e "\n${YELLOW}Verifying secrets in ${REPO}...${NC}\n"

SECRETS=$(gh secret list --repo "$REPO" 2>/dev/null | wc -l)
echo -e "${GREEN}✓ Found ${SECRETS} secret(s) configured${NC}"

gh secret list --repo "$REPO"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Verify secrets: gh secret list --repo $REPO"
echo "2. Trigger deployment: gh workflow run deploy.yml --repo $REPO"
echo "3. Monitor: gh run list --repo $REPO"
echo "4. View live site: https://beatforge.pages.dev"
echo ""
