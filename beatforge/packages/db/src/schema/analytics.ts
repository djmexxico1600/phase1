/**
 * @file schema/analytics.ts
 * @description Analytics event tracking — PostHog-compatible event store.
 * Captures plays, searches, purchases, profile views, and custom events.
 */
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Event identification
    eventName: varchar("event_name", { length: 100 }).notNull(),
    // Actor — nullable for anonymous events
    userId: uuid("user_id"),
    // Associated resources
    beatId: uuid("beat_id"),
    // Session tracking
    sessionId: varchar("session_id", { length: 100 }),
    // Privacy-preserving IP hash (SHA-256 of IP + salt)
    ipHash: varchar("ip_hash", { length: 64 }),
    // User-agent / device info
    userAgent: text("user_agent"),
    // Referrer
    referrer: text("referrer"),
    // Structured event properties (flexible)
    properties: jsonb("properties").$type<Record<string, unknown>>(),
    // Geo (country-level only for privacy)
    countryCode: varchar("country_code", { length: 2 }),
    // Timestamp
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    eventNameIdx: index("analytics_event_name_idx").on(table.eventName),
    userIdx: index("analytics_user_idx").on(table.userId),
    beatIdx: index("analytics_beat_idx").on(table.beatId),
    sessionIdx: index("analytics_session_idx").on(table.sessionId),
    createdAtIdx: index("analytics_created_at_idx").on(table.createdAt),
  })
);

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
