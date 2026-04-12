/**
 * @file schema/playlists.ts
 * @description User-curated playlists with beat membership via junction table.
 */
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { beats } from "./beats";

export const playlists = pgTable(
  "playlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    coverArtKey: text("cover_art_key"),
    isPublic: boolean("is_public").notNull().default(true),
    beatCount: integer("beat_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("playlists_user_idx").on(table.userId),
    isPublicIdx: index("playlists_is_public_idx").on(table.isPublic),
  })
);

export const playlistBeats = pgTable(
  "playlist_beats",
  {
    playlistId: uuid("playlist_id")
      .notNull()
      .references(() => playlists.id, { onDelete: "cascade" }),
    beatId: uuid("beat_id")
      .notNull()
      .references(() => beats.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    addedAt: timestamp("added_at").notNull().defaultNow(),
  },
  (table) => ({
    uniquePlaylistBeat: unique("playlist_beats_unique").on(table.playlistId, table.beatId),
    playlistIdx: index("playlist_beats_playlist_idx").on(table.playlistId),
    beatIdx: index("playlist_beats_beat_idx").on(table.beatId),
  })
);

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
  user: one(users, { fields: [playlists.userId], references: [users.id] }),
  playlistBeats: many(playlistBeats),
}));

export const playlistBeatsRelations = relations(playlistBeats, ({ one }) => ({
  playlist: one(playlists, { fields: [playlistBeats.playlistId], references: [playlists.id] }),
  beat: one(beats, { fields: [playlistBeats.beatId], references: [beats.id] }),
}));

export type Playlist = typeof playlists.$inferSelect;
export type NewPlaylist = typeof playlists.$inferInsert;
export type PlaylistBeat = typeof playlistBeats.$inferSelect;
export type NewPlaylistBeat = typeof playlistBeats.$inferInsert;
