/**
 * @file src/app/(checkout)/checkout/cancel/page.tsx
 * @description Checkout cancelled page.
 */

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-amber-500" />
          </div>
          <CardTitle className="text-center text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Your payment was cancelled. Your cart items have been saved.
          </p>

          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/checkout">
                Return to Checkout
              </Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/marketplace/beats">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
