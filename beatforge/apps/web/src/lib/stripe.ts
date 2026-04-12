/**
 * @file lib/stripe.ts
 * @description Stripe API client and webhook verification helpers.
 * Never trust client-side data; always verify with Stripe server.
 */

import Stripe from 'stripe';
import { getServerEnv } from './env';

const env = getServerEnv();

// ============================================================
// STRIPE CLIENT
// ============================================================

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-15' as const,
  appInfo: {
    name: 'BeatForge',
    version: '1.0.0',
  },
  telemetry: true, // Send usage telemetry to Stripe
});

// ============================================================
// WEBHOOK VERIFICATION
// ============================================================

/**
 * Verify Stripe webhook signature.
 * Must be called on every webhook endpoint.
 * @throws Error if signature is invalid
 */
export function verifyWebhookSignature(
  body: string,
  signature: string | undefined
): Stripe.Event {
  if (!signature) {
    throw new Error('Missing Stripe signature header');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    throw new Error(
      `Webhook signature verification failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// ============================================================
// CHECKOUT SESSION HELPERS
// ============================================================

/**
 * Create a Checkout Session for beat purchase or subscription.
 */
export async function createCheckoutSession(params: {
  customerId?: string;
  userEmail?: string;
  lineItems: Array<{
    priceId?: string;
    price?: number; // In cents
    quantity: number;
    name: string;
  }>;
  successUrl: string;
  cancelUrl: string;
  mode?: 'payment' | 'subscription';
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: params.userEmail,
    customer: params.customerId,
    line_items: params.lineItems.map((item) => ({
      price: item.priceId || undefined,
      price_data: item.priceId
        ? undefined
        : {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price,
          },
      quantity: item.quantity,
    })),
    mode: params.mode || 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });

  return session;
}

// ============================================================
// PAYMENT INTENT HELPERS
// ============================================================

/**
 * Retrieve a Payment Intent to verify payment status.
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Check if a payment was successful.
 */
export function isPaymentSuccessful(
  paymentIntent: Stripe.PaymentIntent
): boolean {
  return paymentIntent.status === 'succeeded';
}

// ============================================================
// CUSTOMER HELPERS
// ============================================================

/**
 * Create or retrieve a Stripe customer for a user.
 */
export async function getOrCreateCustomer(params: {
  customerId?: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  // Return existing customer
  if (params.customerId) {
    return stripe.customers.retrieve(params.customerId) as Promise<Stripe.Customer>;
  }

  // Create new customer
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  });
}

// ============================================================
// SUBSCRIPTION HELPERS
// ============================================================

/**
 * Create a subscription for a customer.
 */
export async function createSubscription(params: {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Subscription> {
  return stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
    metadata: params.metadata,
  });
}

/**
 * Cancel a subscription immediately or at period end.
 */
export async function cancelSubscription(
  subscriptionId: string,
  atPeriodEnd = false
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: atPeriodEnd,
  });
}

// ============================================================
// PAYOUT HELPERS (Connect)
// ============================================================

/**
 * Create a payout for a connected account (producer).
 */
export async function createPayout(params: {
  connectedAccountId: string;
  amount: number; // In cents
  currency?: string;
}): Promise<Stripe.Payout> {
  return stripe.payouts.create(
    {
      amount: params.amount,
      currency: params.currency || 'usd',
    },
    {
      stripeAccount: params.connectedAccountId,
    }
  );
}

// ============================================================
// TYPES & EXPORTS
// ============================================================

export type StripeEvent = Stripe.Event;
export type StripeCheckoutSession = Stripe.Checkout.Session;
export type StripePaymentIntent = Stripe.PaymentIntent;
export type StripeCustomer = Stripe.Customer;
export type StripeSubscription = Stripe.Subscription;

export default stripe;
