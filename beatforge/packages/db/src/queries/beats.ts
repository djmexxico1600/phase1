/**
 * @file queries/beats.ts
 * @description Production-grade Drizzle queries for beats.
 */
import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "../client";
import {
  beats,
  type Beat,
  type NewBeat,
  beatGenreEnum,
  beatMoodEnum,
  beatKeyEnum,
} from "../schema/beats";
import { licenses } from "../schema/licenses";
import { users } from "../schema/users";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BeatGenre = (typeof beatGenreEnum.enumValues)[number];
type BeatMood = (typeof beatMoodEnum.enumValues)[number];
type BeatKey = (typeof beatKeyEnum.enumValues)[number];

export interface BeatFilters {
  genre?: BeatGenre;
  mood?: BeatMood;
  key?: BeatKey;
  bpmMin?: number;
  bpmMax?: number;
  priceMin?: number;
  priceMax?: number;
  isHumanMade?: boolean;
  isFree?: boolean;
  tagIds?: string[];
  producerId?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface SortOptions {
  field?: "publishedAt" | "playCount" | "salesCount" | "lowestPrice" | "createdAt";
  direction?: "asc" | "desc";
}

// ---------------------------------------------------------------------------
// Read queries
// ---------------------------------------------------------------------------

/**
 * Paginated list of published beats with optional filters and sorting.
 */
export async function getPublishedBeats(
  filters: BeatFilters = {},
  pagination: PaginationOptions = {},
  sort: SortOptions = {}
) {
  const { page = 1, limit = 24 } = pagination;
  const { field = "publishedAt", direction = "desc" } = sort;
  const offset = (page - 1) * limit;

  const conditions = [eq(beats.status, "published")];

  if (filters.genre) conditions.push(eq(beats.genre, filters.genre));
  if (filters.mood) conditions.push(eq(beats.mood, filters.mood));
  if (filters.key) conditions.push(eq(beats.key, filters.key));
  if (filters.isHumanMade !== undefined)
    conditions.push(eq(beats.isHumanMade, filters.isHumanMade));
  if (filters.isFree !== undefined) conditions.push(eq(beats.isFree, filters.isFree));
  if (filters.producerId) conditions.push(eq(beats.producerId, filters.producerId));
  if (filters.bpmMin !== undefined) conditions.push(gte(beats.bpm, filters.bpmMin));
  if (filters.bpmMax !== undefined) conditions.push(lte(beats.bpm, filters.bpmMax));
  if (filters.priceMin !== undefined)
    conditions.push(gte(beats.lowestPrice, String(filters.priceMin)));
  if (filters.priceMax !== undefined)
    conditions.push(lte(beats.lowestPrice, String(filters.priceMax)));
  if (filters.tagIds && filters.tagIds.length > 0) {
    // Overlap operator for array column
    conditions.push(
      sql`${beats.tagIds} && ${sql`ARRAY[${sql.join(
        filters.tagIds.map((id) => sql`${id}::uuid`),
        sql`, `
      )}]::uuid[]`}`
    );
  }

  const orderColumn = {
    publishedAt: beats.publishedAt,
    playCount: beats.playCount,
    salesCount: beats.salesCount,
    lowestPrice: beats.lowestPrice,
    createdAt: beats.createdAt,
  }[field] ?? beats.publishedAt;

  const orderFn = direction === "asc" ? asc : desc;

  const rows = await db
    .select({
      beat: beats,
      producer: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        humanMadeBadge: users.humanMadeBadge,
        verificationStatus: users.verificationStatus,
      },
    })
    .from(beats)
    .innerJoin(users, eq(beats.producerId, users.id))
    .where(and(...conditions))
    .orderBy(orderFn(orderColumn))
    .limit(limit)
    .offset(offset);

  return rows;
}

/**
 * Full beat detail by slug — includes producer profile and all license tiers.
 */
export async function getBeatBySlug(slug: string) {
  const rows = await db
    .select({
      beat: beats,
      producer: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        bannerUrl: users.bannerUrl,
        bio: users.bio,
        humanMadeBadge: users.humanMadeBadge,
        verificationStatus: users.verificationStatus,
        followerCount: users.followerCount,
        totalSales: users.totalSales,
      },
      license: licenses,
    })
    .from(beats)
    .innerJoin(users, eq(beats.producerId, users.id))
    .leftJoin(licenses, and(eq(licenses.beatId, beats.id), eq(licenses.isAvailable, true)))
    .where(and(eq(beats.slug, slug), eq(beats.status, "published")));

  if (rows.length === 0) return null;

  // Pivot licenses onto the beat row
  const firstRow = rows[0];
  if (!firstRow) return null;

  const { beat, producer } = firstRow;
  const beatLicenses = rows
    .map((r) => r.license)
    .filter((l): l is NonNullable<typeof l> => l !== null);

  return { beat, producer, licenses: beatLicenses };
}

/**
 * All beats for a given producer, optionally filtered by status.
 */
export async function getProducerBeats(
  producerId: string,
  status?: Beat["status"]
) {
  const conditions = [eq(beats.producerId, producerId)];
  if (status) conditions.push(eq(beats.status, status));

  return db
    .select()
    .from(beats)
    .where(and(...conditions))
    .orderBy(desc(beats.createdAt));
}

/**
 * Trending beats — highest play counts in the last 7 days.
 * Uses publishedAt as a proxy since we don't store play timestamps.
 */
export async function getTrendingBeats(limit = 10) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return db
    .select({
      beat: beats,
      producer: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        humanMadeBadge: users.humanMadeBadge,
      },
    })
    .from(beats)
    .innerJoin(users, eq(beats.producerId, users.id))
    .where(
      and(
        eq(beats.status, "published"),
        gte(beats.publishedAt, sevenDaysAgo)
      )
    )
    .orderBy(desc(beats.playCount))
    .limit(limit);
}

/**
 * Editor-featured beats.
 */
export async function getFeaturedBeats(limit = 12) {
  return db
    .select({
      beat: beats,
      producer: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        humanMadeBadge: users.humanMadeBadge,
      },
    })
    .from(beats)
    .innerJoin(users, eq(beats.producerId, users.id))
    .where(and(eq(beats.status, "published"), eq(beats.isFeatured, true)))
    .orderBy(desc(beats.publishedAt))
    .limit(limit);
}

/**
 * Full-text search beats by title, description, or producer name.
 */
export async function searchBeats(
  query: string,
  filters: BeatFilters = {},
  pagination: PaginationOptions = {}
) {
  const { page = 1, limit = 24 } = pagination;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(beats.status, "published"),
    or(
      ilike(beats.title, `%${query}%`),
      ilike(beats.description, `%${query}%`),
      ilike(users.displayName, `%${query}%`),
      ilike(users.username, `%${query}%`)
    ),
  ];

  if (filters.genre) conditions.push(eq(beats.genre, filters.genre));
  if (filters.mood) conditions.push(eq(beats.mood, filters.mood));
  if (filters.isHumanMade !== undefined)
    conditions.push(eq(beats.isHumanMade, filters.isHumanMade));

  return db
    .select({
      beat: beats,
      producer: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        humanMadeBadge: users.humanMadeBadge,
      },
    })
    .from(beats)
    .innerJoin(users, eq(beats.producerId, users.id))
    .where(and(...conditions))
    .orderBy(desc(beats.playCount))
    .limit(limit)
    .offset(offset);
}

/**
 * Beats by multiple IDs (e.g. playlist lookup).
 */
export async function getBeatsByIds(ids: string[]) {
  if (ids.length === 0) return [];

  return db
    .select()
    .from(beats)
    .where(and(inArray(beats.id, ids), eq(beats.status, "published")))
    .orderBy(asc(beats.title));
}

// ---------------------------------------------------------------------------
// Write queries
// ---------------------------------------------------------------------------

/**
 * Atomically increment a beat's play count.
 */
export async function incrementPlayCount(beatId: string) {
  await db
    .update(beats)
    .set({ playCount: sql`${beats.playCount} + 1` })
    .where(eq(beats.id, beatId));
}

/**
 * Atomically increment a beat's download count.
 */
export async function incrementDownloadCount(beatId: string) {
  await db
    .update(beats)
    .set({ downloadCount: sql`${beats.downloadCount} + 1` })
    .where(eq(beats.id, beatId));
}

/**
 * Create a new beat record.
 */
export async function createBeat(data: NewBeat): Promise<Beat> {
  const [row] = await db.insert(beats).values(data).returning();
  if (!row) throw new Error("Failed to create beat");
  return row;
}

/**
 * Update beat fields.
 */
export async function updateBeat(
  id: string,
  data: Partial<NewBeat>
): Promise<Beat> {
  const [row] = await db
    .update(beats)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(beats.id, id))
    .returning();
  if (!row) throw new Error(`Beat ${id} not found`);
  return row;
}

/**
 * Soft-delete a beat by setting status to archived.
 */
export async function deleteBeat(id: string): Promise<void> {
  await db
    .update(beats)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(beats.id, id));
}
