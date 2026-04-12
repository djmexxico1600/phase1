/**
 * @file utils/format.ts
 * @description Formatting utilities for the marketplace.
 */

/**
 * Formats a price in USD cents or decimal to a human-readable string.
 * @example formatPrice(29.99) → "$29.99"
 * @example formatPrice(0) → "Free"
 */
export function formatPrice(amount: number | string, currency = "usd"): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (value === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number with K/M suffixes.
 * @example formatCount(1250) → "1.3K"
 * @example formatCount(1250000) → "1.2M"
 */
export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

/**
 * Formats duration in seconds to MM:SS or HH:MM:SS.
 * @example formatDuration(185) → "3:05"
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Formats a date to a relative string ("2 days ago", "just now").
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}

/**
 * Formats a BPM key enum value to human-readable string.
 * @example formatKey("c_sharp_major") → "C#Major"
 */
export function formatKey(key: string): string {
  return key
    .split("_")
    .map((part) => {
      if (part === "sharp") return "#";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ")
    .replace(" # ", "#");
}

/**
 * Formats a genre enum value to human-readable string.
 * @example formatGenre("hip_hop") → "Hip-Hop"
 */
export function formatGenre(genre: string): string {
  const map: Record<string, string> = {
    hip_hop: "Hip-Hop",
    rnb: "R&B",
  };
  return map[genre] ?? genre.charAt(0).toUpperCase() + genre.slice(1);
}

/**
 * Truncates text to a max length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
