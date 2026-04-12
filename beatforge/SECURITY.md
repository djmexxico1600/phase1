# Security Policy

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in BeatForge, please disclose it responsibly by emailing:

**security@beatforge.io**

### What to include in your report

To help us triage and remediate quickly, please provide:

- **Description** — A clear description of the vulnerability and its potential impact
- **Affected component** — Which app, package, or API endpoint is affected
- **Steps to reproduce** — A minimal, reliable proof of concept (do not include live exploitation against production)
- **Severity assessment** — Your estimate of the CVSS score or impact level
- **Suggested fix** — If you have one (not required)

### Response timeline

| Stage | Target timeline |
|-------|----------------|
| Acknowledgement of receipt | Within **48 hours** |
| Initial triage & severity assessment | Within **5 business days** |
| Resolution or mitigation plan | Within **30 days** for critical/high |
| Public disclosure (coordinated) | After patch is released |

We follow **coordinated disclosure**: we ask that you give us a reasonable window to address the issue before any public disclosure. For critical vulnerabilities, we target a maximum of **90 days** before coordinated public release.

We will credit researchers in our release notes unless you prefer to remain anonymous.

---

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| `main` (latest) | ✅ Active support |
| Previous minor releases | Security patches only for **6 months** after next minor |
| EOL versions | ❌ No support |

Only the latest published release receives active security patches. We strongly encourage all users to stay on the latest version.

---

## Security Measures

BeatForge is designed with security as a first-class concern. Below is an overview of controls mapped to the **OWASP Top 10 (2021)**.

### A01 — Broken Access Control

- All API routes are protected by **Better Auth** session middleware
- Role-based access control (RBAC): `admin`, `producer`, `buyer` roles enforced at the tRPC and route handler layer
- Resources (beats, licenses, orders) are scoped to the authenticated user; cross-user access is explicitly denied
- Stripe webhooks are validated with HMAC signature verification (`stripe-signature` header) before any order fulfillment
- Cloudflare R2 presigned URLs are scoped per-user and expire after 15 minutes for uploads, 24 hours for downloads

### A02 — Cryptographic Failures

- All data in transit is encrypted via **TLS 1.3** (enforced at the Cloudflare edge)
- Database connections require `sslmode=require` via Neon Postgres
- `BETTER_AUTH_SECRET` must be a cryptographically random 32-byte value (enforced at startup)
- Passwords are hashed using **Argon2id** via Better Auth's default configuration
- Sensitive environment variables are never logged or exposed in client bundles (enforced via ESLint `no-console` + Turbo `env` allowlist)
- Payment card data never touches our servers — Stripe.js handles all PCI-sensitive input

### A03 — Injection

- All database queries use **Drizzle ORM** parameterized queries — raw SQL string interpolation is prohibited via lint rules
- Zod schema validation at all API boundaries (tRPC input schemas, form server actions)
- File uploads pass through content-type and magic-bytes validation before writing to R2
- Cloudflare Turnstile protects all public-facing forms against bot-driven injection attacks

### A04 — Insecure Design

- Threat modeling is conducted for each new feature involving payments, file handling, or auth
- The principle of least privilege is applied to all service accounts and API keys
- Rate limiting is enforced at the Cloudflare WAF layer and within tRPC middleware
- Beat file watermarking is applied on download to enable traceability

### A05 — Security Misconfiguration

- Security headers enforced via `next.config.ts`:
  - `Content-Security-Policy` with nonce-based script allowlist
  - `Strict-Transport-Security` (HSTS) max-age 1 year
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` restricting camera, microphone, geolocation
- CORS is explicitly configured; wildcard origins are not permitted
- `.env.example` documents all required variables; secrets are never committed
- `NODE_ENV=production` disables all development middleware and verbose error responses

### A06 — Vulnerable and Outdated Components

- Automated dependency updates via **Dependabot** (weekly PRs)
- `pnpm audit` runs in CI on every PR; high/critical findings block merge
- Lock file (`pnpm-lock.yaml`) is committed and verified in CI to prevent supply-chain substitution
- Container base images are pinned to specific digests and updated monthly

### A07 — Identification and Authentication Failures

- **Better Auth** handles all authentication with secure session management
- Sessions use opaque tokens stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies
- Email verification is required before account activation
- Password reset tokens are single-use and expire after 15 minutes
- Account lockout after 10 consecutive failed login attempts (with exponential backoff)
- Cloudflare Turnstile on all auth forms to prevent credential stuffing

### A08 — Software and Data Integrity Failures

- Stripe webhook payloads are verified with HMAC-SHA256 before processing
- R2 file uploads include an expected content hash in the presigned URL parameters
- CI/CD pipeline uses pinned GitHub Actions (SHA-pinned, not tag-pinned) to prevent compromised action injection
- Changeset-based releases ensure every version bump is reviewed and intentional

### A09 — Security Logging and Monitoring Failures

- All authentication events (login, logout, failed attempts, password reset) are logged to the audit log table
- Payment events are logged with Stripe Event IDs for full reconciliation
- **Sentry** captures all unhandled errors with user context (PII is scrubbed before transmission)
- Critical alerts (failed webhook processing, unusual purchase volumes) trigger PagerDuty notifications
- Logs are retained for a minimum of 90 days

### A10 — Server-Side Request Forgery (SSRF)

- All outbound HTTP requests use an allowlist of permitted domains (Stripe, Neon, Resend, Cloudflare APIs)
- User-supplied URLs (e.g., artist website links) are validated against a strict allowlist and never fetched server-side
- Internal metadata endpoints (e.g., Cloudflare metadata service) are blocked at the network layer

---

## Scope

The following are **in scope** for security reports:

- `apps/web` — Next.js web application
- `packages/api` — tRPC API layer
- `packages/db` — Database schema and queries
- Authentication flows (sign-up, sign-in, OAuth, password reset)
- Payment processing (Stripe integration)
- File upload/download (Cloudflare R2)

The following are **out of scope**:

- Third-party services (Stripe, Neon, Cloudflare, Sentry infrastructure)
- Denial of service attacks requiring significant traffic volumes
- Social engineering attacks targeting BeatForge employees
- Security issues in using outdated browsers not supported by the app

---

## Bug Bounty

We do not currently operate a formal bug bounty program. However, we deeply appreciate responsible disclosure and will acknowledge researchers publicly (with permission) in our release notes for significant findings.

---

*This security policy was last updated: April 2026*
