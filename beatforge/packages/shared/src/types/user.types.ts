/**
 * @file types/user.types.ts
 * @description Shared user types used across web app and API.
 */

export type UserRole = "producer" | "buyer" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  role: UserRole;
  displayName: string | null;
  verificationStatus: VerificationStatus;
  humanMadeBadge: boolean;
  followerCount: number;
  followingCount: number;
  beatCount: number;
  totalSales: number;
  createdAt: Date;
}

export interface ProducerProfile extends UserProfile {
  role: "producer";
  websiteUrl: string | null;
  twitterHandle: string | null;
  instagramHandle: string | null;
  youtubeUrl: string | null;
  customDomain: string | null;
  totalEarnings: string;
  pendingEarnings: string;
  stripeAccountId: string | null;
}

export interface AuthSession {
  user: UserProfile;
  expires: Date;
}

export interface NotificationPreferences {
  email: {
    sales: boolean;
    comments: boolean;
    follows: boolean;
    newsletter: boolean;
  };
  inApp: {
    sales: boolean;
    comments: boolean;
    follows: boolean;
  };
}
