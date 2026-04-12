#!/bin/bash

###############################################################################
# BeatForge Pre-Deployment Verification Script
# Checks if all prerequisites are in place for production deployment
###############################################################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║        BeatForge Pre-Deployment Verification                  ║
║              Checking All Prerequisites                        ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

PASSED=0
FAILED=0
WARNINGS=0

check_pass() {
    echo -e "${GREEN}✓ $1${NC}"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗ $1${NC}"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNINGS++))
}

# 1. Check Git Repository
echo -e "${BLUE}1. Git Repository${NC}"
if [ -d ".git" ]; then
    check_pass "Git repository initialized"
else
    check_fail "Not in a git repository"
fi

# 2. Check Working Tree
echo -e "\n${BLUE}2. Working Tree${NC}"
if [ -z "$(git status --porcelain 2>/dev/null)" ]; then
    check_pass "Working tree clean"
else
    check_warn "Uncommitted changes detected"
fi

# 3. Check Project Files
echo -e "\n${BLUE}3. Project Files${NC}"
[ -d "beatforge/apps/web/src/app" ] && check_pass "Next.js app structure" || check_fail "App structure missing"
[ -d "beatforge/packages/db" ] && check_pass "Database package" || check_fail "Database package missing"
[ -d "beatforge/.github/workflows" ] && check_pass "GitHub Actions" || check_fail "Workflows missing"

# 4. Check Workflows
echo -e "\n${BLUE}4. CI/CD Workflows${NC}"
[ -f "beatforge/.github/workflows/ci.yml" ] && check_pass "CI workflow" || check_fail "CI missing"
[ -f "beatforge/.github/workflows/deploy.yml" ] && check_pass "Deploy workflow" || check_fail "Deploy missing"
[ -f "beatforge/.github/workflows/preview.yml" ] && check_pass "Preview workflow" || check_fail "Preview missing"

# 5. Check Documentation
echo -e "\n${BLUE}5. Deployment Tools${NC}"
[ -f "QUICK_START.md" ] && check_pass "QUICK_START.md" || check_fail "QUICK_START missing"
[ -f "DEPLOY.sh" ] && check_pass "DEPLOY.sh" || check_fail "DEPLOY.sh missing"
[ -f "SETUP_GITHUB_SECRETS.sh" ] && check_pass "SETUP_GITHUB_SECRETS.sh" || check_fail "Setup script missing"
[ -f "TEST_SCENARIOS.md" ] && check_pass "TEST_SCENARIOS.md" || check_fail "Tests missing"

# 6. Check GitHub CLI
echo -e "\n${BLUE}6. GitHub CLI${NC}"
if command -v gh &> /dev/null; then
    check_pass "GitHub CLI installed"
    if gh auth status &> /dev/null; then
        check_pass "GitHub authenticated"
    else
        check_warn "GitHub CLI not authenticated (run: gh auth login)"
    fi
else
    check_warn "GitHub CLI not installed (get it: https://cli.github.com/)"
fi

# 7. Check Source Files
echo -e "\n${BLUE}7. Source Files${NC}"
WEB_COUNT=$(find beatforge/apps/web/src -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
if [ "$WEB_COUNT" -gt 50 ]; then
    check_pass "Web app files ($WEB_COUNT)"
else
    check_fail "Missing web files ($WEB_COUNT)"
fi

DB_COUNT=$(find beatforge/packages -name "*.ts" 2>/dev/null | wc -l)
if [ "$DB_COUNT" -gt 20 ]; then
    check_pass "Package files ($DB_COUNT)"
else
    check_fail "Missing package files ($DB_COUNT)"
fi

# 8. Summary
echo -e "\n${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Passed: $PASSED${NC} | ${RED}✗ Failed: $FAILED${NC} | ${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}\n"
    echo -e "${BLUE}Ready for deployment:${NC}"
    echo "1. Configure secrets:  bash SETUP_GITHUB_SECRETS.sh"
    echo "2. Deploy to prod:     bash DEPLOY.sh"
    echo "3. Run tests:          See TEST_SCENARIOS.md"
    exit 0
else
    echo -e "${RED}✗ Some checks failed - please fix issues${NC}"
    exit 1
fi
