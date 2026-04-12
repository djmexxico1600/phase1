/**
 * @file schema/users.ts
 * @description User schema — producers, buyers, and admins.
 * Better Auth manages the core auth fields (authUsers table);
 * this table holds marketplace profile and business data.
 */
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { beats } from "./beats";
import { follows } from "./follows";
import { transactions } from "./transactions";
import { payouts } from "./payouts";
import { notifications } from "./notifications";
import { subscriptions } from "./subscriptions";
import { playlists } from "./playlists";

export const userRoleEnum = pgEnum("user_role", ["producer", "buyer", "admin"]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "unverified",
  "pending",
  "verified",
  "rejected",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    name: varchar("name", { length: 100 }).notNull(),
    username: varchar("username", { length: 50 }).unique(),
    avatarUrl: text("avatar_url"),
    bannerUrl: text("banner_url"),
    bio: text("bio"),
    role: userRoleEnum("role").notNull().default("buyer"),
    // Producer profile fields
    displayName: varchar("display_name", { length: 100 }),
    customDomain: varchar("custom_domain", { length: 255 }).unique(),
    websiteUrl: text("website_url"),
    twitterHandle: varchar("twitter_handle", { length: 50 }),
    instagramHandle: varchar("instagram_handle", { length: 50 }),
    youtubeUrl: text("youtube_url"),
    // Identity verification
    verificationStatus: verificationStatusEnum("verification_status")
      .notNull()
      .default("unverified"),
    verificationRequestedAt: timestamp("verification_requested_at"),
    verificationReviewedAt: timestamp("verification_reviewed_at"),
    verificationReviewedBy: uuid("verification_reviewed_by"),
    // Human-made badge (granted after content review)
    humanMadeBadge: boolean("human_made_badge").notNull().default(false),
    humanMadeBadgeGrantedAt: timestamp("human_made_badge_granted_at"),
    // Revenue tracking
    totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 })
      .notNull()
      .default("0.00"),
    pendingEarnings: decimal("pending_earnings", { precision: 12, scale: 2 })
      .notNull()
      .default("0.00"),
    // Stripe integration
    stripeCustomerId: varchar("stripe_customer_id", { length: 100 }).unique(),
    stripeAccountId: varchar("stripe_account_id", { length: 100 }).unique(),
    // Notification preferences
    notificationPreferences: jsonb("notification_preferences")
      .$type<{
        email: {
          sales: boolean;
          comments: boolean;
          follows: boolean;
          newsletter: boolean;
        };
        inApp: {
          sales: boolean;
          comments: boolean;
          follows: boolean;
        };
      }>()
      .default({
        email: { sales: true, comments: true, follows: true, newsletter: true },
        inApp: { sales: true, comments: true, follows: true },
      }),
    // Denormalized counters — updated via background jobs
    followerCount: integer("follower_count").notNull().default(0),
    followingCount: integer("following_count").notNull().default(0),
    beatCount: integer("beat_count").notNull().default(0),
    totalSales: integer("total_sales").notNull().default(0),
    // Account state
    isActive: boolean("is_active").notNull().default(true),
    isBanned: boolean("is_banned").notNull().default(false),
    banReason: text("ban_reason"),
    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    usernameIdx: index("users_username_idx").on(table.username),
    roleIdx: index("users_role_idx").on(table.role),
    verificationIdx: index("users_verification_idx").on(table.verificationStatus),
    createdAtIdx: index("users_created_at_idx").on(table.createdAt),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  beats: many(beats),
  transactions: many(transactions),
  payouts: many(payouts),
  notifications: many(notifications),
  subscriptions: many(subscriptions),
  playlists: many(playlists),
  followers: many(follows, { relationName: "following" }),
  following: many(follows, { relationName: "followers" }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
