/**
 * @file schema/payouts.ts
 * @description Producer payout requests and Stripe transfer tracking.
 */
import { relations } from "drizzle-orm";
import {
  decimal,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const payoutStatusEnum = pgEnum("payout_status", [
  "requested",
  "processing",
  "completed",
  "failed",
  "cancelled",
]);

export const payouts = pgTable(
  "payouts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    producerId: uuid("producer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("usd"),
    status: payoutStatusEnum("status").notNull().default("requested"),
    stripeTransferId: varchar("stripe_transfer_id", { length: 100 }).unique(),
    stripePayoutId: varchar("stripe_payout_id", { length: 100 }).unique(),
    notes: text("notes"),
    processedAt: timestamp("processed_at"),
    processedBy: uuid("processed_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    producerIdx: index("payouts_producer_idx").on(table.producerId),
    statusIdx: index("payouts_status_idx").on(table.status),
  })
);

export const payoutsRelations = relations(payouts, ({ one }) => ({
  producer: one(users, { fields: [payouts.producerId], references: [users.id] }),
}));

export type Payout = typeof payouts.$inferSelect;
export type NewPayout = typeof payouts.$inferInsert;
