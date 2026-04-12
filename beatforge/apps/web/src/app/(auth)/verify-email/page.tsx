/**
 * @file src/app/(auth)/verify-email/page.tsx
 * @description Email verification page.
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { verifyEmailAction, resendVerificationEmailAction } from '@/server-actions/auth';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  // Auto-verify if token is present
  useEffect(() => {
    if (token && !isVerified) {
      verifyEmail();
    }
  }, [token, isVerified]);

  async function verifyEmail() {
    if (!token) {
      toast({
        title: 'Error',
        description: 'No verification token provided',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsVerifying(true);
      const result = await verifyEmailAction(token);
      setIsVerified(true);

      toast({
        title: 'Success',
        description: 'Email verified! Redirecting...',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Email verification failed',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function onResendEmail() {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsResending(true);
      const result = await resendVerificationEmailAction(email);

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: result.message,
        });
      }
    } finally {
      setIsResending(false);
    }
  }

  if (isVerified) {
    return (
      <Card className="border-accent/50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-accent" />
            <CardTitle>Email Verified!</CardTitle>
          </div>
          <CardDescription>Your email has been successfully verified</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            You're all set. You'll be redirected to your dashboard momentarily.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-6 h-6 text-primary" />
          <CardTitle>Verify Your Email</CardTitle>
        </div>
        <CardDescription>
          We've sent a verification link to your email. Click the link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {token ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Verifying your email... {isVerifying && 'Please wait...'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <Button
              onClick={onResendEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
