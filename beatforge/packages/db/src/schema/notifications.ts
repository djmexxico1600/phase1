/**
 * @file schema/notifications.ts
 * @description In-app notification records — sales, follows, comments, system alerts.
 */
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const notificationTypeEnum = pgEnum("notification_type", [
  "sale",
  "follow",
  "comment",
  "system",
  "payout",
  "verification",
  "exclusive_sold",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    // Optional link to a resource
    resourceType: text("resource_type"), // "beat" | "transaction" | "user" | null
    resourceId: uuid("resource_id"),
    // Extra structured data
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("notifications_user_idx").on(table.userId),
    isReadIdx: index("notifications_is_read_idx").on(table.isRead),
    typeIdx: index("notifications_type_idx").on(table.type),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
  })
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
