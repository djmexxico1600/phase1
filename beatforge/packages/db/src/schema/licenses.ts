/**
 * @file schema/licenses.ts
 * @description License types for beats (Basic, Premium, Trackout, Exclusive).
 * Each beat can have multiple license tiers at different price points.
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
import { transactions } from "./transactions";

export const licenseTypeEnum = pgEnum("license_type", [
  "basic",      // MP3 lease — limited distribution
  "premium",    // WAV lease — higher distribution
  "trackout",   // WAV + stems — full production control
  "unlimited",  // WAV + stems + unlimited distribution (non-exclusive)
  "exclusive",  // Full copyright transfer
]);

export const licenses = pgTable(
  "licenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    beatId: uuid("beat_id")
      .notNull()
      .references(() => beats.id, { onDelete: "cascade" }),
    type: licenseTypeEnum("type").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    // Included file formats
    includesMp3: boolean("includes_mp3").notNull().default(true),
    includesWav: boolean("includes_wav").notNull().default(false),
    includesStems: boolean("includes_stems").notNull().default(false),
    // Distribution limits (null = unlimited)
    distributionLimit: integer("distribution_limit"),
    audioStreamsLimit: integer("audio_streams_limit"),
    musicVideoLimit: integer("music_video_limit"),
    broadcastingRightsIncluded: boolean("broadcasting_rights_included").notNull().default(false),
    profitLimit: decimal("profit_limit", { precision: 12, scale: 2 }),
    // Legal terms
    termsUrl: text("terms_url"),
    customTerms: text("custom_terms"),
    // License contract template stored as structured JSON
    contractTemplate: jsonb("contract_template").$type<{
      version: string;
      clauses: Array<{ key: string; text: string }>;
    }>(),
    // Availability flag (can disable a tier without deleting)
    isAvailable: boolean("is_available").notNull().default(true),
    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    beatIdx: index("licenses_beat_idx").on(table.beatId),
    typeIdx: index("licenses_type_idx").on(table.type),
  })
);

export const licensesRelations = relations(licenses, ({ one, many }) => ({
  beat: one(beats, { fields: [licenses.beatId], references: [beats.id] }),
  transactions: many(transactions),
}));

export type License = typeof licenses.$inferSelect;
export type NewLicense = typeof licenses.$inferInsert;
