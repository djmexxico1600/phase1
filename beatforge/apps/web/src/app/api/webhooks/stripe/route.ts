/**
 * @file src/app/api/webhooks/stripe/route.ts
 * @description Stripe webhook handler for payment events.
 */

import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import Stripe from 'stripe';

/**
 * Webhook events we handle:
 * - payment_intent.succeeded: Payment completed, create transaction
 * - charge.refunded: Refund processed
 * - customer.subscription.*: Subscription events
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
      logger.error('Webhook signature verification failed', { error });
      return new Response('Invalid signature', { status: 400 });
    }

    // Handle events
    switch (event.type) {
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        logger.info('Charge succeeded', { chargeId: charge.id, amount: charge.amount });
        // TODO: Create transaction record
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge;
        logger.warn('Charge failed', { chargeId: charge.id, reason: charge.failure_message });
        // TODO: Log failed payment
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        logger.info('Charge refunded', { chargeId: charge.id, amount: charge.amount_refunded });
        // TODO: Create refund record, process return licenses
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        logger.info('Subscription created', { subscriptionId: subscription.id });
        // TODO: Create subscription record
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        logger.info('Subscription updated', { subscriptionId: subscription.id });
        // TODO: Update subscription record
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        logger.info('Subscription cancelled', { subscriptionId: subscription.id });
        // TODO: Mark subscription as cancelled
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        logger.info('Invoice payment succeeded', { invoiceId: invoice.id });
        // TODO: Handle subscription renewal
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        logger.warn('Invoice payment failed', { invoiceId: invoice.id });
        // TODO: Send notification to user
        break;
      }

      default:
        logger.debug('Unhandled webhook event', { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Webhook handler error', { error });
    return new Response('Internal server error', { status: 500 });
  }
}
