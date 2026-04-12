/**
 * @file schema/beats.ts
 * @description Beats schema — the core product of the marketplace.
 * Includes all metadata for discovery, licensing, and streaming.
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
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { licenses } from "./licenses";
import { transactions } from "./transactions";

export const beatStatusEnum = pgEnum("beat_status", [
  "draft",
  "processing",
  "published",
  "archived",
  "rejected",
]);

export const beatGenreEnum = pgEnum("beat_genre", [
  "hip_hop",
  "trap",
  "rnb",
  "pop",
  "drill",
  "afrobeats",
  "dancehall",
  "reggaeton",
  "electronic",
  "house",
  "techno",
  "jazz",
  "soul",
  "gospel",
  "country",
  "rock",
  "other",
]);

export const beatMoodEnum = pgEnum("beat_mood", [
  "dark",
  "happy",
  "sad",
  "aggressive",
  "romantic",
  "chill",
  "epic",
  "motivational",
  "mysterious",
  "playful",
  "other",
]);

export const beatKeyEnum = pgEnum("beat_key", [
  "c_major", "c_minor", "c_sharp_major", "c_sharp_minor",
  "d_major", "d_minor", "d_sharp_major", "d_sharp_minor",
  "e_major", "e_minor",
  "f_major", "f_minor", "f_sharp_major", "f_sharp_minor",
  "g_major", "g_minor", "g_sharp_major", "g_sharp_minor",
  "a_major", "a_minor", "a_sharp_major", "a_sharp_minor",
  "b_major", "b_minor",
  "unknown",
]);

export const beats = pgTable(
  "beats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    producerId: uuid("producer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 250 }).notNull().unique(),
    description: text("description"),
    status: beatStatusEnum("status").notNull().default("draft"),
    // Audio files (Cloudflare R2 object keys)
    audioFileKey: text("audio_file_key"),         // Full WAV/MP3 (protected)
    previewFileKey: text("preview_file_key"),     // 30s watermarked preview (public)
    stemsFileKey: text("stems_file_key"),         // Optional stems ZIP
    waveformData: jsonb("waveform_data").$type<number[]>(), // Pre-computed waveform peaks
    // Cover art
    coverArtKey: text("cover_art_key"),
    // Musical metadata
    bpm: integer("bpm"),
    key: beatKeyEnum("key").default("unknown"),
    genre: beatGenreEnum("genre").notNull(),
    mood: beatMoodEnum("mood"),
    durationSeconds: integer("duration_seconds"),
    // Human-made verification
    isHumanMade: boolean("is_human_made").notNull().default(false),
    humanMadeVerifiedAt: timestamp("human_made_verified_at"),
    humanMadeVerifiedBy: uuid("human_made_verified_by"),
    // AI detection (0.0 = definitely human, 1.0 = definitely AI)
    aiDetectionScore: real("ai_detection_score"),
    aiDetectionRunAt: timestamp("ai_detection_run_at"),
    // Discovery
    tagIds: uuid("tag_ids").array(), // Denormalized for fast filtering
    searchVector: text("search_vector"),           // tsvector for full-text search
    // Stats — updated via triggers/background jobs
    playCount: integer("play_count").notNull().default(0),
    downloadCount: integer("download_count").notNull().default(0),
    likeCount: integer("like_count").notNull().default(0),
    salesCount: integer("sales_count").notNull().default(0),
    // License pricing — denormalized lowest price for sorting
    lowestPrice: decimal("lowest_price", { precision: 10, scale: 2 }),
    // Flags
    isFeatured: boolean("is_featured").notNull().default(false),
    isFree: boolean("is_free").notNull().default(false),
    allowedForFreeDownload: boolean("allowed_for_free_download").notNull().default(false),
    // Exclusivity tracking
    isExclusive: boolean("is_exclusive").notNull().default(false),
    exclusiveSoldAt: timestamp("exclusive_sold_at"),
    exclusiveSoldTo: uuid("exclusive_sold_to"),
    // SEO / Open Graph
    metaTitle: varchar("meta_title", { length: 200 }),
    metaDescription: text("meta_description"),
    // Timestamps
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    producerIdx: index("beats_producer_idx").on(table.producerId),
    statusIdx: index("beats_status_idx").on(table.status),
    genreIdx: index("beats_genre_idx").on(table.genre),
    slugIdx: index("beats_slug_idx").on(table.slug),
    publishedAtIdx: index("beats_published_at_idx").on(table.publishedAt),
    playCountIdx: index("beats_play_count_idx").on(table.playCount),
    featuredIdx: index("beats_featured_idx").on(table.isFeatured),
  })
);

export const beatsRelations = relations(beats, ({ one, many }) => ({
  producer: one(users, { fields: [beats.producerId], references: [users.id] }),
  licenses: many(licenses),
  transactions: many(transactions),
}));

export type Beat = typeof beats.$inferSelect;
export type NewBeat = typeof beats.$inferInsert;
