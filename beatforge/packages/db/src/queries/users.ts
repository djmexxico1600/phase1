/**
 * @file queries/users.ts
 * @description Drizzle queries for user profiles and producer discovery.
 */
import { desc, eq, sql } from "drizzle-orm";
import { db } from "../client";
import { users, type User, type NewUser } from "../schema/users";

// ---------------------------------------------------------------------------
// Read queries
// ---------------------------------------------------------------------------

/**
 * Fetch a user by their UUID — includes role for authorization.
 */
export async function getUserById(id: string): Promise<User | null> {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
}

/**
 * Fetch a user by email — used during auth flows.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return row ?? null;
}

/**
 * Fetch a user by username — for public profile pages.
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1);
  return row ?? null;
}

/**
 * Top producers ranked by total sales count.
 */
export async function getTopProducers(limit = 10) {
  return db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      bannerUrl: users.bannerUrl,
      bio: users.bio,
      humanMadeBadge: users.humanMadeBadge,
      verificationStatus: users.verificationStatus,
      followerCount: users.followerCount,
      beatCount: users.beatCount,
      totalSales: users.totalSales,
      totalEarnings: users.totalEarnings,
    })
    .from(users)
    .where(eq(users.role, "producer"))
    .orderBy(desc(users.totalSales))
    .limit(limit);
}

/**
 * Check if a username is already taken.
 */
export async function isUsernameTaken(
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  const conditions = [eq(users.username, username.toLowerCase())];

  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]}`)
    .limit(1);

  if (excludeUserId) {
    return rows.some((r) => r.id !== excludeUserId);
  }

  return rows.length > 0;
}

// ---------------------------------------------------------------------------
// Write queries
// ---------------------------------------------------------------------------

/**
 * Create a new marketplace user record.
 */
export async function createUser(data: NewUser): Promise<User> {
  const [row] = await db
    .insert(users)
    .values({ ...data, email: data.email.toLowerCase() })
    .returning();
  if (!row) throw new Error("Failed to create user");
  return row;
}

/**
 * Update a user's profile fields.
 */
export async function updateUser(
  id: string,
  data: Partial<NewUser>
): Promise<User> {
  const [row] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  if (!row) throw new Error(`User ${id} not found`);
  return row;
}

/**
 * Atomically increment follower count.
 */
export async function incrementFollowerCount(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ followerCount: sql`${users.followerCount} + 1` })
    .where(eq(users.id, userId));
}

/**
 * Atomically decrement follower count (floor at 0).
 */
export async function decrementFollowerCount(userId: string): Promise<void> {
  await db
    .update(users)
    .set({
      followerCount: sql`GREATEST(${users.followerCount} - 1, 0)`,
    })
    .where(eq(users.id, userId));
}

/**
 * Atomically update producer earnings after a completed sale.
 */
export async function creditProducerEarnings(
  producerId: string,
  amount: string
): Promise<void> {
  await db
    .update(users)
    .set({
      totalEarnings: sql`${users.totalEarnings} + ${amount}::numeric`,
      pendingEarnings: sql`${users.pendingEarnings} + ${amount}::numeric`,
      totalSales: sql`${users.totalSales} + 1`,
    })
    .where(eq(users.id, producerId));
}
