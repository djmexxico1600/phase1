/**
 * @file schemas/payment.schemas.ts
 * @description Zod validation schemas for payment and checkout operations.
 */
import { z } from "zod";

export const checkoutSchema = z.object({
  beatId: z.string().min(1, "Beat ID is required"),
  licenseId: z.string().min(1, "License ID is required"),
  successUrl: z
    .string()
    .url("successUrl must be a valid URL"),
  cancelUrl: z
    .string()
    .url("cancelUrl must be a valid URL"),
});

export const webhookSchema = z.object({
  stripeSignature: z.string().min(1, "Stripe-Signature header is required"),
  payload: z.string().min(1, "Webhook payload is required"),
});

export const payoutRequestSchema = z.object({
  amount: z
    .number()
    .min(10, "Minimum payout amount is $10.00")
    .multipleOf(0.01, "Amount must have at most 2 decimal places"),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter ISO code")
    .toUpperCase()
    .default("USD"),
});

export const subscriptionSchema = z.object({
  planId: z.enum(["buyer_pro", "buyer_unlimited"]),
  successUrl: z.string().url("successUrl must be a valid URL"),
  cancelUrl: z.string().url("cancelUrl must be a valid URL"),
});

export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  cancelAtPeriodEnd: z.boolean().default(true),
});

export const downloadSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  assetType: z.enum(["mp3", "wav", "stems"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type WebhookInput = z.infer<typeof webhookSchema>;
export type PayoutRequestInput = z.infer<typeof payoutRequestSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
export type DownloadInput = z.infer<typeof downloadSchema>;
