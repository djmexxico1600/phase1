/**
 * @file lib/auth-client.ts
 * @description Better Auth client hooks and utilities.
 * Use in client components to access auth state, sign up, sign in, sign out.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// ============================================================
// TYPES
// ============================================================

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  role: 'buyer' | 'producer' | 'admin';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  image: string | null;
  createdAt: Date;
}

export interface AuthSession {
  user: AuthUser;
  expiresAt: Date;
  token: string;
}

// ============================================================
// HOOKS
// ============================================================

/**
 * useAuth: Get current user and auth state.
 * Automatically syncs across tabs/windows via storage events.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/auth/get-session', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
          setUser(data.user);
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-session') {
        fetchSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { user, session, isLoading, error, isAuthenticated: !!user };
}

/**
 * useSignUp: Register new user.
 */
export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signUp = useCallback(
    async (data: {
      email: string;
      password: string;
      name: string;
      role: 'buyer' | 'producer';
    }) => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('/api/auth/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Sign up failed');
        }

        // Sync auth state
        window.localStorage.setItem('auth-session', Date.now().toString());

        router.push('/auth/verify-email');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign up failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return { signUp, isLoading, error };
}

/**
 * useSignIn: Authenticate existing user.
 */
export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('/api/auth/sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Sign in failed');
        }

        // Sync auth state
        window.localStorage.setItem('auth-session', Date.now().toString());

        router.push('/dashboard');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign in failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return { signIn, isLoading, error };
}

/**
 * useSignOut: Logout current user.
 */
export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);

      await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });

      // Clear auth state
      window.localStorage.removeItem('auth-session');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return { signOut, isLoading };
}

/**
 * useProtected: Require authentication for a page/component.
 */
export function useProtected(requiredRole?: 'buyer' | 'producer' | 'admin') {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Wait for session check

    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [isLoading, isAuthenticated, user, requiredRole, pathname, router]);

  return { user, isLoading, isAuthenticated };
}

/**
 * useSession: Low-level session access (SSR-compatible when wrapped in Suspense).
 */
export async function getSessionServer() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/get-session`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

export default {
  useAuth,
  useSignUp,
  useSignIn,
  useSignOut,
  useProtected,
};
