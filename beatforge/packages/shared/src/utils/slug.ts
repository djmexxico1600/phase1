/**
 * @file utils/slug.ts
 * @description URL slug generation utilities.
 */

/**
 * Generates a URL-safe slug from a string.
 * @example generateSlug("Dark Trap Beat #1") → "dark-trap-beat-1"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a unique slug by appending a random suffix.
 * @example generateUniqueSlug("Dark Beat") → "dark-beat-a1b2c3"
 */
export function generateUniqueSlug(text: string): string {
  const base = generateSlug(text);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

/**
 * Validates that a slug matches the expected format.
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
