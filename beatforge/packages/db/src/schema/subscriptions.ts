/**
 * @file schema/subscriptions.ts
 * @description Buyer subscription plans with Stripe subscription tracking.
 */
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "pro",
  "unlimited",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "cancelled",
  "past_due",
  "trialing",
  "paused",
  "incomplete",
]);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plan: subscriptionPlanEnum("plan").notNull().default("free"),
    status: subscriptionStatusEnum("status").notNull().default("active"),
    // Stripe
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 100 }).unique(),
    stripePriceId: varchar("stripe_price_id", { length: 100 }),
    stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
    // Billing period
    currentPeriodStart: timestamp("current_period_start"),
    currentPeriodEnd: timestamp("current_period_end"),
    trialStart: timestamp("trial_start"),
    trialEnd: timestamp("trial_end"),
    cancelledAt: timestamp("cancelled_at"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    // Feature limits
    monthlyDownloadsLimit: integer("monthly_downloads_limit").notNull().default(0),
    monthlyDownloadsUsed: integer("monthly_downloads_used").notNull().default(0),
    // For tracking resets
    downloadsResetAt: timestamp("downloads_reset_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("subscriptions_user_idx").on(table.userId),
    statusIdx: index("subscriptions_status_idx").on(table.status),
    stripeSubIdx: index("subscriptions_stripe_sub_idx").on(table.stripeSubscriptionId),
  })
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
