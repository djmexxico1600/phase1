# Contributing to BeatForge

Thank you for your interest in contributing to BeatForge! This document outlines the conventions and workflows that keep our codebase consistent and our collaboration productive.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Repository Structure](#repository-structure)
4. [Branch Naming](#branch-naming)
5. [Commit Messages](#commit-messages)
6. [Pull Request Process](#pull-request-process)
7. [Code Style](#code-style)
8. [Testing Requirements](#testing-requirements)
9. [Database Migrations](#database-migrations)
10. [Semantic Versioning & Changesets](#semantic-versioning--changesets)
11. [Environment Variables](#environment-variables)

---

## Code of Conduct

All contributors are expected to adhere to our Code of Conduct. Be respectful, inclusive, and constructive in all interactions.

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0 (`npm install -g pnpm@9.15.0`)
- **Docker** (for local Postgres if not using Neon)
- A `.env.local` file — copy from `.env.example` and fill in values

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/beatforge/beatforge.git
cd beatforge

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Run database migrations
pnpm db:migrate

# 5. Seed the database (optional)
pnpm db:seed

# 6. Start the development server
pnpm dev
```

The web app will be available at `http://localhost:3000`.

---

## Repository Structure

```
beatforge/
├── apps/
│   └── web/          # Next.js 15 frontend + API routes
├── packages/
│   ├── db/           # Drizzle ORM schema, migrations, queries
│   ├── shared/       # Shared types, utilities, constants
│   └── api/          # tRPC router definitions
├── turbo.json        # Turborepo pipeline config
├── pnpm-workspace.yaml
└── package.json
```

---

## Branch Naming

Branches must follow this pattern: `<type>/<short-description>`

| Type      | When to use                                   |
|-----------|-----------------------------------------------|
| `feature/` | New features or enhancements                 |
| `fix/`     | Bug fixes                                    |
| `docs/`    | Documentation-only changes                   |
| `chore/`   | Tooling, CI, dependency updates              |
| `refactor/`| Code restructuring without behavior change   |
| `perf/`    | Performance improvements                     |
| `test/`    | Adding or updating tests only                |
| `ci/`      | CI/CD pipeline changes                       |

**Examples:**
```
feature/beat-upload-waveform
fix/stripe-webhook-signature-validation
docs/api-authentication-guide
chore/update-drizzle-orm-0.38
```

---

## Commit Messages

We use **Conventional Commits** enforced by `commitlint`.

### Format

```
<type>(<optional scope>): <subject>

[optional body]

[optional footer(s)]
```

### Rules

- **type** must be one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `ci`
- **subject** must be ≤ 100 characters, written in **imperative mood**, **lowercase**, **no trailing period**
- **body** is optional but encouraged for non-trivial changes
- **footer** should reference issues: `Closes #123` or `BREAKING CHANGE: <description>`

### Examples

```
feat(auth): add OAuth2 GitHub provider via Better Auth

fix(stripe): handle webhook race condition on order fulfillment

docs(contributing): add database migration workflow

chore(deps): upgrade turbo to 2.3.0

feat!: rename BeatPack to SoundKit

BREAKING CHANGE: The `BeatPack` entity has been renamed to `SoundKit`.
Update all API consumers accordingly.
```

---

## Pull Request Process

### 1. Draft PRs (work in progress)

- Open a **Draft PR** as soon as you push your first commit to get early feedback
- Prefix the title with `[WIP]` while work is in progress
- Use the PR description template to document intent, approach, and any open questions

### 2. Ready for Review

- Remove the draft status and drop the `[WIP]` prefix when ready
- Ensure your branch is **up to date** with `main`: `git rebase origin/main`
- All CI checks must pass:
  - `pnpm lint` — zero ESLint errors
  - `pnpm type-check` — zero TypeScript errors
  - `pnpm test` — all Vitest unit/integration tests pass
  - `pnpm build` — production build succeeds

### 3. Code Review

- At least **one approved review** from a core maintainer is required
- Address all reviewer comments before requesting re-review
- Use **resolve** only after the concern has been addressed (not just acknowledged)
- Prefer small, focused PRs — large PRs take longer to review and are more likely to introduce merge conflicts

### 4. Merging

- We use **Squash and Merge** for feature branches into `main`
- The squash commit message must follow the Conventional Commits format
- Delete the source branch after merging

### PR Description Template

```markdown
## Summary
<!-- What does this PR do? Why? -->

## Changes
- 

## Testing
<!-- How was this tested? What scenarios were covered? -->

## Screenshots / Recordings
<!-- For UI changes, please include before/after screenshots -->

## Checklist
- [ ] Tests added / updated
- [ ] Types pass (`pnpm type-check`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Changeset added (`pnpm changeset`) if this is a user-facing change
- [ ] `.env.example` updated if new env vars were added
- [ ] Drizzle migration generated if schema changed
```

---

## Code Style

### Linting

We use **ESLint** with `@typescript-eslint/strict-type-checked` rules. Run:

```bash
pnpm lint           # check all packages
pnpm lint --fix     # auto-fix where possible
```

Key enforced rules:
- No `any` types — use `unknown` and narrow
- No `console.log` (only `console.warn` and `console.error`)
- Consistent type imports (`import type { Foo }`)
- Import ordering (builtins → externals → internals)
- Exhaustive switch statements on union types

### Formatting

We use **Prettier** with `prettier-plugin-tailwindcss` for automatic class sorting. Run:

```bash
pnpm format         # format all files
```

Configuration lives in `.prettierrc.json`. Do **not** override Prettier settings at the file level.

### TypeScript

- Enable `strict` mode — all new code must be type-safe
- Prefer `satisfies` over `as` for type assertions
- Use `unknown` in catch blocks, narrow before use
- Never use `@ts-ignore`; use `@ts-expect-error` with a justification comment if unavoidable

---

## Testing Requirements

### Unit & Integration Tests (Vitest)

All new business logic must have test coverage. Run:

```bash
pnpm test           # run all Vitest tests
pnpm test -- --coverage  # with coverage report
```

Coverage thresholds (enforced in CI):
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 75%

### End-to-End Tests (Playwright)

Critical user flows must have corresponding E2E tests in `apps/web/e2e/`. Run:

```bash
pnpm test:e2e               # run all Playwright tests
pnpm test:e2e --ui          # open interactive UI mode
```

Required E2E coverage for:
- Authentication (sign-up, sign-in, sign-out)
- Beat upload workflow
- Purchase & download flow
- License selection

### Test File Conventions

- Unit tests: co-located as `*.test.ts` / `*.test.tsx`
- Integration tests: `src/__tests__/*.test.ts`
- E2E tests: `apps/web/e2e/*.e2e.ts`

---

## Database Migrations

Schema changes must go through the Drizzle migration workflow:

```bash
# 1. Edit schema files in packages/db/src/schema/
# 2. Generate the migration SQL
pnpm db:generate

# 3. Review the generated SQL in packages/db/src/migrations/
# 4. Apply to your local / dev database
pnpm db:migrate

# 5. Commit both the schema changes AND the migration file
git add packages/db/src/schema/ packages/db/src/migrations/
```

**Never** manually edit generated migration files. If a migration needs adjustment, generate a new one.

---

## Semantic Versioning & Changesets

We use **Changesets** (`@changesets/cli`) to manage versioning and changelogs.

### When to add a changeset

Add a changeset for any user-facing change: new features, bug fixes, breaking changes. Skip for `docs`, `chore`, `ci` commits that don't affect package consumers.

```bash
# Add a changeset (interactive wizard)
pnpm changeset

# Version packages (run by CI on release)
pnpm changeset version

# Publish (run by CI on release)
pnpm changeset publish
```

### Semver guidance

| Change type   | Version bump |
|---------------|-------------|
| Breaking API change | `major` |
| New feature (backward-compatible) | `minor` |
| Bug fix | `patch` |

---

## Environment Variables

If your PR introduces new environment variables:

1. Add them to `.env.example` with a descriptive comment
2. Add them to the `globalEnv` or task `env` array in `turbo.json`
3. Document them in the relevant service's README
4. **Never** hardcode secrets or commit `.env.local`

For Cloudflare Worker bindings (KV, Queues, D1), add them to `wrangler.toml` — do not use environment variables.

---

## Questions?

Open a [GitHub Discussion](https://github.com/beatforge/beatforge/discussions) or reach out in the `#engineering` channel on Discord.
