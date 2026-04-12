# BeatForge — Next-Generation Beat Marketplace Platform

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)

BeatForge is a modern, full-stack beat marketplace platform built with Next.js, Hono Workers, and Cloudflare infrastructure.

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/djmexxico1600/phase1
cd phase1/beatforge

# Install dependencies
pnpm install

# Start development
pnpm run dev

# Run tests
pnpm test:run
```

## 📋 Deployment

**🎯 Recommended:** Use GitHub Actions (fully automated)
- Push to `main` branch to trigger automatic deployment
- No manual steps required
- All tests run automatically

**📚 Full Guide:** See [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)

```bash
# Pre-deployment verification
bash PRE_DEPLOYMENT_CHECK.sh

# Setup GitHub secrets (one-time)
bash SETUP_GITHUB_SECRETS.sh

# View deployment status
# → https://github.com/djmexxico1600/phase1/actions
```

## 📁 Project Structure

```
beatforge/
├── apps/
│   └── web/                 # Next.js 15 web app (Pages)
├── packages/
│   ├── api/                 # Hono Workers API
│   ├── db/                  # Drizzle database layer
│   └── shared/              # Shared types & utilities
├── .github/workflows/       # CI/CD automation
└── pnpm-workspace.yaml      # Monorepo config
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TailwindCSS |
| **API** | Hono, tRPC, Zod |
| **Database** | Cloudflare D1, Drizzle ORM |
| **Deployment** | Cloudflare Pages, Workers |
| **Auth** | Better Auth, RBAC |
| **Payments** | Stripe |
| **Storage** | Cloudflare R2 |

## 📖 Documentation

- **[Quick Start Guide](QUICK_START.md)** — Setup and development
- **[Deployment Guide](CLOUDFLARE_DEPLOYMENT.md)** — Production deployment
- **[Test Scenarios](TEST_SCENARIOS.md)** — Testing procedures
- **[Architecture Guide](beatforge/ARCHITECTURE.md)** — System design
- **[Contributing Guide](beatforge/CONTRIBUTING.md)** — Development workflow

## ✅ Verification

Before deploying, verify everything is ready:

```bash
bash PRE_DEPLOYMENT_CHECK.sh
```

This checks:
- ✓ Git repository initialized
- ✓ Project files present
- ✓ CI/CD workflows configured
- ✓ GitHub CLI authenticated
- ✓ Source files present

## 📝 Available Commands

```bash
# Development
pnpm run dev          # Start dev server with hot reload
pnpm run type-check   # Type-check all packages

# Building & Testing
pnpm run build        # Build all packages
pnpm test:run         # Run all tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:e2e         # Run E2E tests with Playwright

# Database
pnpm run db:generate  # Generate DB schema
pnpm run db:migrate   # Run migrations
pnpm run db:seed      # Seed database

# Code Quality
pnpm run lint         # Run ESLint
pnpm run format       # Format code with Prettier

# Deployment
pnpm run build:api    # Build Hono API
pnpm run deploy:api   # Deploy API to Cloudflare Workers
```

## 🔐 Environment Variables

See [.env.example](beatforge/.env.example) for the complete list.

Key variables:
```bash
DATABASE_URL          # Cloudflare D1 connection
STRIPE_SECRET_KEY     # Stripe API key
BETTER_AUTH_SECRET    # Authentication secret
CLOUDFLARE_*          # Cloudflare API tokens
```

## 🐛 Troubleshooting

**Issue:** Build fails with "Could not detect static files"  
**Solution:** See [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md#troubleshooting)

**Issue:** Tests failing locally  
**Solution:** Run `pnpm install` and `pnpm run db:generate`

**Issue:** Can't authenticate with GitHub CLI  
**Solution:** Run `gh auth login` and select default settings

## 📊 Project Status

- ✅ Core infrastructure
- ✅ Database layer  
- ✅ Authentication system
- ✅ API routes
- ✅ Web UI components
- ✅ Testing suite
- ✅ CI/CD automation
- ✅ Production deployment

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/djmexxico1600/phase1/issues)
- **Discussions**: [GitHub Discussions](https://github.com/djmexxico1600/phase1/discussions)
- **Email**: contact@beatforge.io

## 📄 License

MIT — See [LICENSE](beatforge/LICENSE)