/**
 * @file src/server-actions/auth.ts
 * @description Authentication Server Actions.
 * Register, login, logout, verify email, password reset.
 */

'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { registerSchema, loginSchema } from '@beatforge/shared';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Register new user.
 */
export async function registerAction(formData: unknown) {
  try {
    const data = registerSchema.parse(formData);

    const { user, session } = await auth.api.signUpEmail({
      email: data.email,
      password: data.password,
      name: data.name,
      body: {
        role: data.role || 'buyer',
      },
    });

    if (!user) {
      throw new Error('User creation failed');
    }

    // Redirect to verify email
    redirect('/auth/verify-email');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return { error: message };
  }
}

/**
 * Sign in existing user.
 */
export async function loginAction(formData: unknown) {
  try {
    const data = loginSchema.parse(formData);

    const { user, session } = await auth.api.signInEmail({
      email: data.email,
      password: data.password,
    });

    if (!user || !session) {
      throw new Error('Invalid credentials');
    }

    // Check if MFA is enabled
    if (user.twoFactorEnabled) {
      redirect('/auth/mfa?sessionId=' + session.id);
    }

    // Redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return { error: message };
  }
}

/**
 * Logout current user.
 */
export async function logoutAction() {
  try {
    await auth.api.signOut({
      fetchOptions: {
        credentials: 'include',
      },
    });

    redirect('/');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    return { error: message };
  }
}

/**
 * Verify email address.
 */
export async function verifyEmailAction(token: string) {
  try {
    const { user } = await auth.api.verifyEmail({
      token,
    });

    if (!user) {
      throw new Error('Email verification failed');
    }

    redirect('/dashboard');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email verification failed';
    return { error: message };
  }
}

/**
 * Request email verification resend.
 */
export async function resendVerificationEmailAction(email: string) {
  try {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }

    // Better Auth will send verification email
    await auth.api.sendVerificationEmail({
      email,
    });

    return { success: true, message: 'Verification email sent' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to resend email';
    return { error: message };
  }
}

/**
 * Request password reset.
 */
export async function requestPasswordResetAction(email: string) {
  try {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }

    await auth.api.forgetPassword({
      email,
    });

    return { success: true, message: 'Password reset link sent to your email' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send reset email';
    return { error: message };
  }
}

/**
 * Reset password with token.
 */
export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    const schema = z.object({
      password: z.string().min(8, 'Password must be at least 8 characters'),
    });

    schema.parse({ password: newPassword });

    await auth.api.resetPassword({
      token,
      newPassword,
    });

    redirect('/auth/login?reset=success');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Password reset failed';
    return { error: message };
  }
}
