/**
 * @file types/payment.types.ts
 * @description Shared payment types for transactions, cart, checkout, payouts, and subscriptions.
 */

export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "disputed";

export type PayoutStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled";

export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "past_due"
  | "trialing"
  | "incomplete"
  | "incomplete_expired";

export type PaymentProvider = "stripe";

export interface CartItem {
  beatId: string;
  licenseId: string;
  beatTitle: string;
  beatSlug: string;
  coverArtUrl: string | null;
  producerName: string;
  licenseType: string;
  licenseName: string;
  price: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: string;
  platformFee: string;
  total: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  expiresAt: Date;
}

export interface Transaction {
  id: string;
  buyerId: string;
  producerId: string;
  beatId: string;
  licenseId: string;
  stripePaymentIntentId: string | null;
  stripeSessionId: string | null;
  amount: string;
  platformFee: string;
  producerEarnings: string;
  currency: string;
  status: TransactionStatus;
  downloadUrl: string | null;
  downloadExpiresAt: Date | null;
  downloadCount: number;
  refundedAt: Date | null;
  refundReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionSummary {
  id: string;
  beatTitle: string;
  beatSlug: string;
  coverArtUrl: string | null;
  licenseName: string;
  amount: string;
  status: TransactionStatus;
  downloadUrl: string | null;
  downloadExpiresAt: Date | null;
  createdAt: Date;
}

export interface PayoutRequest {
  id: string;
  producerId: string;
  amount: string;
  currency: string;
  status: PayoutStatus;
  stripeTransferId: string | null;
  stripePayoutId: string | null;
  failureReason: string | null;
  requestedAt: Date;
  processedAt: Date | null;
}

export interface ProducerEarningsSummary {
  totalEarnings: string;
  pendingBalance: string;
  availableBalance: string;
  lifetimeSales: number;
  thisMonthEarnings: string;
  lastPayoutAmount: string | null;
  lastPayoutDate: Date | null;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt: Date | null;
  trialEnd: Date | null;
  price: string;
  interval: "month" | "year";
}

export interface DownloadableAsset {
  transactionId: string;
  beatId: string;
  beatTitle: string;
  licenseType: string;
  mp3Url: string | null;
  wavUrl: string | null;
  stemsUrl: string | null;
  downloadExpiresAt: Date;
  downloadCount: number;
  maxDownloads: number;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
  created: number;
  livemode: boolean;
}
