/**
 * @file schema/transactions.ts
 * @description Purchase transactions — beat leases, exclusive buys, and subscription payments.
 */
import { relations } from "drizzle-orm";
import {
  decimal,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { beats } from "./beats";
import { licenses } from "./licenses";

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
  "disputed",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "lease_purchase",
  "exclusive_purchase",
  "subscription",
  "payout",
  "refund",
]);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    buyerId: uuid("buyer_id")
      .notNull()
      .references(() => users.id),
    producerId: uuid("producer_id")
      .notNull()
      .references(() => users.id),
    beatId: uuid("beat_id").references(() => beats.id),
    licenseId: uuid("license_id").references(() => licenses.id),
    type: transactionTypeEnum("type").notNull(),
    status: transactionStatusEnum("status").notNull().default("pending"),
    // Amounts stored as decimal strings for precision
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    platformFee: decimal("platform_fee", { precision: 12, scale: 2 }).notNull(),
    producerEarnings: decimal("producer_earnings", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("usd"),
    // Stripe references
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 100 }).unique(),
    stripeCheckoutSessionId: varchar("stripe_checkout_session_id", { length: 100 }).unique(),
    stripeTransferId: varchar("stripe_transfer_id", { length: 100 }),
    // License contract (generated PDF stored in R2)
    licenseContractKey: text("license_contract_key"),
    // Flexible metadata
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    // Timestamps
    completedAt: timestamp("completed_at"),
    refundedAt: timestamp("refunded_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    buyerIdx: index("transactions_buyer_idx").on(table.buyerId),
    producerIdx: index("transactions_producer_idx").on(table.producerId),
    beatIdx: index("transactions_beat_idx").on(table.beatId),
    statusIdx: index("transactions_status_idx").on(table.status),
    stripeIntentIdx: index("transactions_stripe_intent_idx").on(table.stripePaymentIntentId),
    createdAtIdx: index("transactions_created_at_idx").on(table.createdAt),
  })
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  buyer: one(users, {
    fields: [transactions.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  producer: one(users, {
    fields: [transactions.producerId],
    references: [users.id],
    relationName: "producer",
  }),
  beat: one(beats, { fields: [transactions.beatId], references: [beats.id] }),
  license: one(licenses, { fields: [transactions.licenseId], references: [licenses.id] }),
}));

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
