/**
 * @file queries/transactions.ts
 * @description Drizzle queries for purchase transactions and order history.
 */
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../client";
import {
  transactions,
  type Transaction,
  type NewTransaction,
  type transactionStatusEnum,
} from "../schema/transactions";
import { beats } from "../schema/beats";
import { licenses } from "../schema/licenses";
import { users } from "../schema/users";

type TransactionStatus = (typeof transactionStatusEnum.enumValues)[number];

// ---------------------------------------------------------------------------
// Read queries
// ---------------------------------------------------------------------------

/**
 * Look up a transaction by its Stripe Checkout Session ID.
 * Used in the payment webhook to fulfill orders.
 */
export async function getTransactionByStripeSession(
  sessionId: string
): Promise<Transaction | null> {
  const [row] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.stripeCheckoutSessionId, sessionId))
    .limit(1);
  return row ?? null;
}

/**
 * Look up a transaction by its Stripe Payment Intent ID.
 */
export async function getTransactionByStripeIntent(
  intentId: string
): Promise<Transaction | null> {
  const [row] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.stripePaymentIntentId, intentId))
    .limit(1);
  return row ?? null;
}

/**
 * Paginated transaction history for a producer's dashboard.
 */
export async function getProducerTransactions(
  producerId: string,
  page = 1,
  limit = 20
) {
  const offset = (page - 1) * limit;

  return db
    .select({
      transaction: transactions,
      beat: {
        id: beats.id,
        title: beats.title,
        slug: beats.slug,
        coverArtKey: beats.coverArtKey,
      },
      license: {
        id: licenses.id,
        type: licenses.type,
        name: licenses.name,
      },
      buyer: {
        id: users.id,
        name: users.name,
        username: users.username,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(transactions)
    .leftJoin(beats, eq(transactions.beatId, beats.id))
    .leftJoin(licenses, eq(transactions.licenseId, licenses.id))
    .innerJoin(users, eq(transactions.buyerId, users.id))
    .where(eq(transactions.producerId, producerId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * All beats a buyer has purchased — for the "My Library" page.
 */
export async function getBuyerPurchases(buyerId: string) {
  return db
    .select({
      transaction: transactions,
      beat: {
        id: beats.id,
        title: beats.title,
        slug: beats.slug,
        coverArtKey: beats.coverArtKey,
        genre: beats.genre,
        bpm: beats.bpm,
        key: beats.key,
        durationSeconds: beats.durationSeconds,
      },
      license: {
        id: licenses.id,
        type: licenses.type,
        name: licenses.name,
        includesMp3: licenses.includesMp3,
        includesWav: licenses.includesWav,
        includesStems: licenses.includesStems,
      },
      producer: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
      },
    })
    .from(transactions)
    .innerJoin(beats, eq(transactions.beatId, beats.id))
    .innerJoin(licenses, eq(transactions.licenseId, licenses.id))
    .innerJoin(users, eq(transactions.producerId, users.id))
    .where(
      and(
        eq(transactions.buyerId, buyerId),
        eq(transactions.status, "completed"),
        inArray(transactions.type, ["lease_purchase", "exclusive_purchase"])
      )
    )
    .orderBy(desc(transactions.completedAt));
}

/**
 * Check whether a buyer already owns a specific beat.
 * Used to prevent duplicate purchases of non-exclusive leases.
 */
export async function buyerOwnsLicense(
  buyerId: string,
  licenseId: string
): Promise<boolean> {
  const [row] = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(
      and(
        eq(transactions.buyerId, buyerId),
        eq(transactions.licenseId, licenseId),
        eq(transactions.status, "completed")
      )
    )
    .limit(1);
  return row !== undefined;
}

// ---------------------------------------------------------------------------
// Write queries
// ---------------------------------------------------------------------------

/**
 * Create a pending transaction record before Stripe checkout.
 */
export async function createTransaction(data: NewTransaction): Promise<Transaction> {
  const [row] = await db.insert(transactions).values(data).returning();
  if (!row) throw new Error("Failed to create transaction");
  return row;
}

/**
 * Update transaction status — called from Stripe webhooks.
 */
export async function updateTransactionStatus(
  id: string,
  status: TransactionStatus,
  extra?: Partial<NewTransaction>
): Promise<Transaction> {
  const now = new Date();
  const [row] = await db
    .update(transactions)
    .set({
      status,
      ...(status === "completed" ? { completedAt: now } : {}),
      ...(status === "refunded" ? { refundedAt: now } : {}),
      ...extra,
      updatedAt: now,
    })
    .where(eq(transactions.id, id))
    .returning();
  if (!row) throw new Error(`Transaction ${id} not found`);
  return row;
}

/**
 * Attach a Stripe transfer ID to a completed transaction (producer payout leg).
 */
export async function setTransactionTransferId(
  id: string,
  transferId: string
): Promise<void> {
  await db
    .update(transactions)
    .set({ stripeTransferId: transferId, updatedAt: new Date() })
    .where(eq(transactions.id, id));
}
