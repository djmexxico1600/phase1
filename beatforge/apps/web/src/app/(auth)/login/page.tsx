/**
 * @file src/app/(auth)/login/page.tsx
 * @description Login page.
 */

import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In - BeatForge',
  description: 'Sign in to your BeatForge account',
};

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your BeatForge account</p>
      </div>
      <LoginForm />
    </div>
  );
}
