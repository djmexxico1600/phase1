/**
 * @file beatforge/TESTING.md
 * @description Testing strategy and coverage guide.
 */

# BeatForge Testing Guide

## Testing Strategy

### Test Pyramid

```
      /\
     /  \  E2E (Playwright)
    /----\
   /      \ Integration (API + DB)
  /--------\
 /          \ Unit (Vitest)
/____________\
```

### Coverage Goals

- **Unit Tests**: 80% coverage for utilities, hooks, components
- **Integration Tests**: All API routes and Server Actions
- **E2E Tests**: Critical user flows (auth, marketplace, checkout)
- **Overall Target**: 80%+ coverage

## Unit Tests (Vitest)

### Setup

```bash
pnpm run test            # Watch mode
pnpm run test:run        # Single run
pnpm run test:cov        # Coverage report
```

### Examples

**`src/__tests__/lib/auth.test.ts`**
```typescript
describe('Auth Utilities', () => {
  it('should validate email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('should hash passwords securely', () => {
    const password = 'TestPass123!';
    const hash = hashPassword(password);
    expect(hash).not.toBe(password);
    expect(verifyPassword(password, hash)).toBe(true);
  });
});
```

**`src/__tests__/lib/r2.test.ts`**
```typescript
describe('R2 Client', () => {
  it('should generate signed URLs', async () => {
    const url = await r2.getPresignedUrl('beat.mp3');
    expect(url).toContain('X-Amz-Signature');
    expect(url).toContain('X-Amz-Date');
  });

  it('should handle multipart uploads', async () => {
    const multipart = new MultipartUpload('large-file.mp3');
    expect(multipart.parts.length).toBeGreaterThan(0);
  });
});
```

### Test Files Locations

```
src/
├── lib/__tests__/
│   ├── auth.test.ts
│   ├── r2.test.ts
│   └── stripe.test.ts
├── server/__tests__/
│   └── routers/beats.test.ts
└── server-actions/__tests__/
    ├── auth.test.ts
    ├── beats.test.ts
    └── payments.test.ts
```

## Integration Tests

### Test Database

Use Neon preview branches:

```bash
# Run migrations on test branch
pnpm run migrate:test

# Seed test data
pnpm run seed:test

# Run integration tests
pnpm run test:integration
```

### API Testing

```typescript
describe('Beats Router', () => {
  it('should list published beats', async () => {
    const beats = await caller.beats.list({
      limit: 10,
      offset: 0,
    });
    expect(beats).toHaveLength(10);
    expect(beats[0]).toHaveProperty('title');
  });

  it('should require auth for protected routes', async () => {
    expect(() =>
      caller.beats.create({ title: 'Test' })
    ).toThrowError('Unauthorized');
  });
});
```

### Server Actions Testing

```typescript
describe('Payment Actions', () => {
  it('should create checkout session', async () => {
    const result = await createCheckoutSessionAction([
      { beatId: '1', licenseId: 'std', price: 99 },
    ]);
    expect(result.success).toBe(true);
    expect(result.sessionUrl).toBeTruthy();
  });
});
```

## End-to-End Tests (Playwright)

### Setup

```bash
pnpm run test:e2e          # Run E2E tests
pnpm run test:e2e --debug  # Debug mode
pnpm run test:e2e:ui       # Interactive UI
```

### Critical Paths

**`e2e/auth.spec.ts`**
```typescript
test('complete auth flow', async ({ page }) => {
  // Register
  await page.goto('/auth/register');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'SecurePass123!');
  await page.click('button:has-text("Create Account")');
  await expect(page).toHaveURL('/auth/verify-email');

  // Verify email (mocked)
  // TODO: Use test email provider

  // Login
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'SecurePass123!');
  await page.click('button:has-text("Sign In")');
  await expect(page).toHaveURL(/\/(dashboard|library)/);
});
```

**`e2e/marketplace.spec.ts`**
```typescript
test('buy beat from marketplace', async ({ page }) => {
  // Browse marketplace
  await page.goto('/marketplace/beats');
  await expect(page.locator('[class*="BeatCard"]')).toHaveCount(12);

  // Filter beats
  await page.selectOption('select[name="genre"]', 'Trap');
  await page.click('button:has-text("Apply Filters")');

  // View beat detail
  await page.click('[class*="BeatCard"]:first-child');
  await expect(page).toHaveURL(/\/marketplace\/beats\/[\w-]+/);

  // Select license and add to cart
  await page.click('button:has-text("Add to Cart")');
  await expect(page.locator('text=Added to cart')).toBeVisible();

  // Checkout
  await page.click('button[aria-label="Cart"]');
  await page.click('button:has-text("Proceed to Payment")');

  // Stripe Checkout
  await expect(page).toHaveURL(/stripe\.com|test\.stripe/i);
});
```

**`e2e/upload.spec.ts`**
```typescript
test('producer uploads beat', async ({ page }) => {
  // Login as producer
  await loginAsProducer(page);

  // Upload beat
  await page.goto('/dashboard/beats/upload');
  
  // Drag file or select
  await page.setInputFiles('input[type="file"]', 'test-beat.mp3');
  await expect(page.locator('text=test-beat.mp3')).toBeVisible();

  // Fill metadata
  await page.fill('input[name="title"]', 'Test Beat');
  await page.selectOption('select[name="genre"]', 'Trap');
  await page.fill('input[name="bpm"]', '95');
  await page.click('button:has-text("Publish")');

  // Redirect to dashboard
  await expect(page).toHaveURL('/dashboard/beats');
  await expect(page.locator('text=Test Beat')).toBeVisible();
});
```

## Running Tests

### Local Development

```bash
# Watch mode (all tests)
pnpm run test

# Specific test file
pnpm run test src/__tests__/lib/auth.test.ts

# Unit + integration
pnpm run test:ci

# E2E tests
pnpm run test:e2e

# Coverage report
pnpm run test:cov
```

### CI/CD

See `.github/workflows/ci.yml`:

```yaml
- run: pnpm run lint
- run: pnpm run type-check
- run: pnpm run test --run
- run: pnpm run test:cov
- run: pnpm run test:e2e
```

## Mocking Strategies

### Database Mocking

```typescript
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import * as db from '@/lib/db';

jest.mock('@/lib/db');

const mockDb = db as unknown as DeepMockProxy<typeof db>;

it('should fetch beat', async () => {
  mockDb.query.beats.findFirst.mockResolvedValue({
    id: '1',
    title: 'Test Beat',
    // ... other fields
  });

  const beat = await getBeat('1');
  expect(beat.title).toBe('Test Beat');
});
```

### API Mocking

```typescript
import { http, HttpResponse, server } from 'msw';

server.use(
  http.post('https://api.stripe.com/v1/checkout/sessions', () => {
    return HttpResponse.json({ id: 'cs_test_xxx', url: 'https://checkout.stripe.com' });
  })
);

it('should create checkout session', async () => {
  const result = await createCheckoutSession([]);
  expect(result.sessionUrl).toBeTruthy();
});
```

## Performance Testing

### Load Testing

```bash
# Using k6 or artillery
k6 run load-test.js
```

### Lighthouse CI

```bash
# Run Lighthouse on critical pages
lhci autorun --config=lighthouserc.json
```

## Coverage Reporting

View HTML coverage report:

```bash
pnpm run test:cov
open coverage/index.html
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: `it('should create beat with valid metadata')`
3. **AAA Pattern**: Arrange, Act, Assert
4. **Mock Sparingly**: Use real DB when possible in integration tests
5. **Snapshot Testing**: Use sparingly for UI rendering
6. **Avoid Flakiness**: Mock timers, avoid hard waits
7. **API-Level Testing**: Test tRPC + Server Actions, not just components

## Debugging

```bash
# Debug specific test
node --inspect-brk node_modules/vitest/vitest.mjs run

# Playwright debug
pnpm run test:e2e --debug

# Generate trace
pnpm run test:e2e --trace on
```
