/**
 * @file constants/marketplace.constants.ts
 * @description Application-wide constants for the marketplace.
 */

export const PLATFORM_FEE_PERCENTAGE = 0.20; // 20% platform fee
export const MINIMUM_PAYOUT_AMOUNT = 10.00; // $10 minimum

export const BEAT_GENRES = [
  { value: "hip_hop", label: "Hip-Hop" },
  { value: "trap", label: "Trap" },
  { value: "rnb", label: "R&B" },
  { value: "pop", label: "Pop" },
  { value: "drill", label: "Drill" },
  { value: "afrobeats", label: "Afrobeats" },
  { value: "dancehall", label: "Dancehall" },
  { value: "reggaeton", label: "Reggaeton" },
  { value: "electronic", label: "Electronic" },
  { value: "house", label: "House" },
  { value: "techno", label: "Techno" },
  { value: "jazz", label: "Jazz" },
  { value: "soul", label: "Soul" },
  { value: "gospel", label: "Gospel" },
  { value: "country", label: "Country" },
  { value: "rock", label: "Rock" },
  { value: "other", label: "Other" },
] as const;

export const BEAT_MOODS = [
  { value: "dark", label: "Dark" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "aggressive", label: "Aggressive" },
  { value: "romantic", label: "Romantic" },
  { value: "chill", label: "Chill" },
  { value: "epic", label: "Epic" },
  { value: "motivational", label: "Motivational" },
  { value: "mysterious", label: "Mysterious" },
  { value: "playful", label: "Playful" },
  { value: "other", label: "Other" },
] as const;

export const LICENSE_TYPES = [
  {
    value: "basic",
    label: "Basic Lease",
    description: "MP3 only, limited distribution (2,500 copies)",
    defaultPrice: 29.99,
  },
  {
    value: "premium",
    label: "Premium Lease",
    description: "WAV + MP3, higher distribution (5,000 copies)",
    defaultPrice: 49.99,
  },
  {
    value: "trackout",
    label: "Trackout Lease",
    description: "WAV + stems, full production control (unlimited)",
    defaultPrice: 99.99,
  },
  {
    value: "unlimited",
    label: "Unlimited Lease",
    description: "WAV + stems + unlimited distribution (non-exclusive)",
    defaultPrice: 149.99,
  },
  {
    value: "exclusive",
    label: "Exclusive Rights",
    description: "Full copyright transfer — beat removed from marketplace",
    defaultPrice: 299.99,
  },
] as const;

export const SUBSCRIPTION_PLANS = [
  {
    id: "buyer_pro",
    name: "Pro",
    price: 9.99,
    interval: "month",
    features: ["20 basic leases/month", "Priority support", "Early access"],
    stripeProductId: "prod_pro",
  },
  {
    id: "buyer_unlimited",
    name: "Unlimited",
    price: 29.99,
    interval: "month",
    features: ["Unlimited non-exclusive leases", "Exclusive discounts", "Direct producer messaging"],
    stripeProductId: "prod_unlimited",
  },
] as const;

export const MAX_BEAT_FILE_SIZE_MB = 200; // 200MB max audio file
export const MAX_COVER_ART_SIZE_MB = 10;
export const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/flac"] as const;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const PREVIEW_DURATION_SECONDS = 30; // Auto-generated preview clip duration

export const TRENDING_WINDOW_DAYS = 7;
export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 100;
export const MAX_TAGS_PER_BEAT = 10;
