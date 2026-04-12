/**
 * @file index.ts
 * @description Main entry point for @beatforge/db.
 * Re-exports the Drizzle client, all schema tables/types, and all query functions.
 */

// Client
export { db, schema } from "./client";
export type { Database } from "./client";

// Schema — tables and types
export * from "./schema/users";
export * from "./schema/beats";
export * from "./schema/licenses";
export * from "./schema/transactions";
export * from "./schema/payouts";
export * from "./schema/notifications";
export * from "./schema/subscriptions";
export * from "./schema/follows";
export * from "./schema/playlists";
export * from "./schema/tags";
export * from "./schema/analytics";
export * from "./schema/auth";

// Queries — beats
export {
  getPublishedBeats,
  getBeatBySlug,
  getProducerBeats,
  getTrendingBeats,
  getFeaturedBeats,
  searchBeats,
  getBeatsByIds,
  incrementPlayCount,
  incrementDownloadCount,
  createBeat,
  updateBeat,
  deleteBeat,
} from "./queries/beats";
export type { BeatFilters, PaginationOptions, SortOptions } from "./queries/beats";

// Queries — users
export {
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getTopProducers,
  isUsernameTaken,
  createUser,
  updateUser,
  incrementFollowerCount,
  decrementFollowerCount,
  creditProducerEarnings,
} from "./queries/users";

// Queries — transactions
export {
  getTransactionByStripeSession,
  getTransactionByStripeIntent,
  getProducerTransactions,
  getBuyerPurchases,
  buyerOwnsLicense,
  createTransaction,
  updateTransactionStatus,
  setTransactionTransferId,
} from "./queries/transactions";
