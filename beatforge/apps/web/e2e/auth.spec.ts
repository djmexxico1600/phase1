/**
 * @file apps/web/e2e/auth.spec.ts
 * @description End-to-end tests for authentication flow.
 */

import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('should register new producer', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Select producer role
    await page.click('button:has-text("Producer")');
    
    // Fill form
    await page.fill('input[placeholder*="name"]', 'John Producer');
    await page.fill('input[type="email"]', 'producer@example.com');
    await page.fill('input[type="password"]', 'SecurePass123!');
    
    // Submit
    await page.click('button:has-text("Create Account")');
    
    // Should redirect to email verification
    await expect(page).toHaveURL('/auth/verify-email');
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'producer@example.com');
    await page.fill('input[type="password"]', 'SecurePass123!');
    
    await page.click('button:has-text("Sign In")');
    
    // Should redirect to dashboard on successful login
    await expect(page).toHaveURL(/\/(dashboard|library)/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'WrongPassword');
    
    await page.click('button:has-text("Sign In")');
    
    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
