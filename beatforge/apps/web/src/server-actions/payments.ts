/**
 * @file src/server-actions/payments.ts
 * @description Payment-related Server Actions.
 */

'use server';

import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

/**
 * Create Stripe Checkout Session.
 */
export async function createCheckoutSessionAction(items: any[]) {
  try {
    const { user } = await auth.api.getSession();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const platformFee = Math.round(total * 0.2 * 100); // 20% platform fee in cents
    const producerEarnings = Math.round(total * 0.8 * 100);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            metadata: {
              beatId: item.beatId,
              licenseId: item.licenseId,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        userId: user.id,
        itemCount: items.length.toString(),
      },
    });

    return { success: true, sessionId: session.id, sessionUrl: session.url };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return { error: message };
  }
}

/**
 * Confirm payment and create transaction.
 */
export async function confirmPaymentAction(sessionId: string) {
  try {
    const { user } = await auth.api.getSession();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }

    // TODO: Create transaction record in DB
    // const transaction = await db.insert(transactions).values({...});

    return { success: true, transactionId: 'txn-id' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to confirm payment';
    return { error: message };
  }
}

/**
 * Request payout from producer earnings.
 */
export async function requestPayoutAction(amount: number) {
  try {
    const { user } = await auth.api.getSession();
    if (!user || user.role !== 'producer') {
      throw new Error('Unauthorized');
    }

    // Get producer stripe account
    // TODO: Verify user has connected Stripe account
    // TODO: Create payout request in db
    // const payoutRequest = await db.insert(payoutRequests).values({...});

    return { success: true, payoutId: 'payout-id' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to request payout';
    return { error: message };
  }
}
