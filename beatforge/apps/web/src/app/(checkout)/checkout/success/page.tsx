/**
 * @file src/app/(checkout)/checkout/success/page.tsx
 * @description Checkout success page.
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/stores/cart';
import { confirmPaymentAction } from '@/server-actions/payments';
import { CheckCircle2, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      confirmPayment();
    }
  }, [sessionId]);

  async function confirmPayment() {
    try {
      const result = await confirmPaymentAction(sessionId || '');

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        clearCart();
        toast({
          title: 'Success',
          description: 'Payment confirmed! Your beats are ready to download.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="border-accent/50">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>
          <CardTitle className="text-center text-2xl">Payment Successful!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Your beats are ready to download. Check your email for download links and license information.
            </p>
            <p className="text-xs text-muted-foreground">
              Transaction ID: {sessionId?.slice(0, 10)}...
            </p>
          </div>

          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/library">
                <Download className="w-4 h-4 mr-2" />
                View My Library
              </Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/marketplace/beats">
                Browse More Beats
              </Link>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Having trouble? <Link href="/support" className="text-primary hover:underline">Contact support</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
