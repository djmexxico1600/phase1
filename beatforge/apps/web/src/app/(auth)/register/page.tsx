/**
 * @file src/app/(auth)/register/page.tsx
 * @description Registration page.
 */

import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up - BeatForge',
  description: 'Create a new BeatForge account',
};

export default function RegisterPage() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Get Started</h1>
        <p className="text-muted-foreground">Create your BeatForge account today</p>
      </div>
      <RegisterForm />
    </div>
  );
}
