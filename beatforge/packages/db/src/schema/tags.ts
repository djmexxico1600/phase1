/**
 * @file schema/tags.ts
 * @description Taxonomy tags for beats — genre, mood, instrument, and theme categories.
 * Includes beat_tags junction table for many-to-many.
 */
import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { beats } from "./beats";

export const tagCategoryEnum = pgEnum("tag_category", [
  "genre",
  "mood",
  "instrument",
  "theme",
  "custom",
]);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    slug: varchar("slug", { length: 60 }).notNull().unique(),
    category: tagCategoryEnum("category").notNull().default("custom"),
    description: text("description"),
    usageCount: integer("usage_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: index("tags_slug_idx").on(table.slug),
    categoryIdx: index("tags_category_idx").on(table.category),
    usageIdx: index("tags_usage_count_idx").on(table.usageCount),
  })
);

export const beatTags = pgTable(
  "beat_tags",
  {
    beatId: uuid("beat_id")
      .notNull()
      .references(() => beats.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    beatTagUnique: unique("beat_tags_unique").on(table.beatId, table.tagId),
    beatIdx: index("beat_tags_beat_idx").on(table.beatId),
    tagIdx: index("beat_tags_tag_idx").on(table.tagId),
  })
);

export const tagsRelations = relations(tags, ({ many }) => ({
  beatTags: many(beatTags),
}));

export const beatTagsRelations = relations(beatTags, ({ one }) => ({
  beat: one(beats, { fields: [beatTags.beatId], references: [beats.id] }),
  tag: one(tags, { fields: [beatTags.tagId], references: [tags.id] }),
}));

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type BeatTag = typeof beatTags.$inferSelect;
export type NewBeatTag = typeof beatTags.$inferInsert;
