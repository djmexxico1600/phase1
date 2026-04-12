/**
 * @file utils/crypto.ts
 * @description Cryptographic utilities — all operations use Web Crypto API
 * for edge-runtime compatibility (Cloudflare Workers).
 */

/**
 * Hashes a string using SHA-256 (for IP anonymization in analytics).
 * @example hashString("192.168.1.1") → "a5e8..."
 */
export async function hashString(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generates a cryptographically secure random token.
 * @param length - Byte length (default 32 → 64 hex chars)
 */
export function generateSecureToken(length = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
