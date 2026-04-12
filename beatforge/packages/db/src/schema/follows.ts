/**
 * @file schema/follows.ts
 * @description Producer-to-producer and buyer-to-producer follow relationships.
 */
import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  timestamp,
  uuid,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const follows = pgTable(
  "follows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    followerIdx: index("follows_follower_idx").on(table.followerId),
    followingIdx: index("follows_following_idx").on(table.followingId),
    uniqueFollow: unique("follows_unique").on(table.followerId, table.followingId),
  })
);

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "followers",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));

export type Follow = typeof follows.$inferSelect;
export type NewFollow = typeof follows.$inferInsert;
