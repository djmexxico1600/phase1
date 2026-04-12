/**
 * @file apps/web/src/__tests__/setup.ts
 * @description Vitest setup file.
 */

import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_STRIPE_KEY = 'pk_test_xxx';
process.env.NEXT_PUBLIC_TURNSTILE_KEY = 'test-key';
