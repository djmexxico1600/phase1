/**
 * @file src/app/(checkout)/checkout/page.tsx
 * @description Checkout page.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/stores/cart';
import { createCheckoutSessionAction } from '@/server-actions/payments';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, getTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button asChild>
          <Link href="/marketplace/beats">Browse Beats</Link>
        </Button>
      </div>
    );
  }

  async function handleCheckout() {
    try {
      setIsLoading(true);
      const result = await createCheckoutSessionAction(items);

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.sessionUrl;
      }
    } finally {
      setIsLoading(false);
    }
  }

  const total = getTotal();
  const platformFee = total * 0.2;
  const subtotal = total - platformFee;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Items */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Order Summary</h1>

        {items.map((item) => (
          <Card key={`${item.beatId}-${item.licenseId}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.producerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg">Order Total</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 border-b pb-3">
              {items.map((item) => (
                <div key={`${item.beatId}-${item.licenseId}`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.title}</span>
                  <span className="font-semibold">${item.price}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Platform Fee (20%)</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Proceed to Payment
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Secure payment powered by Stripe
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
