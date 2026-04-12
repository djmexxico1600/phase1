/**
 * @file types/beat.types.ts
 * @description Shared beat and marketplace types.
 */

import type { VerificationStatus } from "./user.types";

export type BeatStatus = "draft" | "processing" | "published" | "archived" | "rejected";
export type BeatGenre =
  | "hip_hop" | "trap" | "rnb" | "pop" | "drill" | "afrobeats"
  | "dancehall" | "reggaeton" | "electronic" | "house" | "techno"
  | "jazz" | "soul" | "gospel" | "country" | "rock" | "other";
export type BeatMood =
  | "dark" | "happy" | "sad" | "aggressive" | "romantic" | "chill"
  | "epic" | "motivational" | "mysterious" | "playful" | "other";
export type BeatKey =
  | "c_major" | "c_minor" | "c_sharp_major" | "c_sharp_minor"
  | "d_major" | "d_minor" | "d_sharp_major" | "d_sharp_minor"
  | "e_major" | "e_minor"
  | "f_major" | "f_minor" | "f_sharp_major" | "f_sharp_minor"
  | "g_major" | "g_minor" | "g_sharp_major" | "g_sharp_minor"
  | "a_major" | "a_minor" | "a_sharp_major" | "a_sharp_minor"
  | "b_major" | "b_minor" | "unknown";

export type LicenseType = "basic" | "premium" | "trackout" | "unlimited" | "exclusive";

export interface BeatLicense {
  id: string;
  type: LicenseType;
  name: string;
  price: string;
  includesMp3: boolean;
  includesWav: boolean;
  includesStems: boolean;
  distributionLimit: number | null;
  audioStreamsLimit: number | null;
  broadcastingRightsIncluded: boolean;
  isAvailable: boolean;
}

export interface BeatSummary {
  id: string;
  title: string;
  slug: string;
  coverArtUrl: string | null;
  previewUrl: string | null;
  bpm: number | null;
  key: BeatKey;
  genre: BeatGenre;
  mood: BeatMood | null;
  durationSeconds: number | null;
  playCount: number;
  likeCount: number;
  salesCount: number;
  isHumanMade: boolean;
  isFeatured: boolean;
  isExclusive: boolean;
  lowestPrice: string | null;
  producer: {
    id: string;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    humanMadeBadge: boolean;
    verificationStatus: VerificationStatus;
  };
  publishedAt: Date | null;
  createdAt: Date;
}

export interface BeatDetail extends BeatSummary {
  description: string | null;
  waveformData: number[] | null;
  licenses: BeatLicense[];
  tags: Array<{ id: string; name: string; slug: string }>;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface MarketplaceFilters {
  genre?: BeatGenre;
  mood?: BeatMood;
  key?: BeatKey;
  bpmMin?: number;
  bpmMax?: number;
  priceMin?: number;
  priceMax?: number;
  isHumanMade?: boolean;
  tags?: string[];
  producerId?: string;
  search?: string;
  sortBy?: "trending" | "newest" | "popular" | "price_low" | "price_high";
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}
