/**
 * @file utils/file.ts
 * @description File validation utilities for audio and image uploads.
 * Used on both client (for UX) and server (for security).
 */
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  MAX_BEAT_FILE_SIZE_MB,
  MAX_COVER_ART_SIZE_MB,
} from "../constants/marketplace.constants";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an audio file for beat uploads.
 * @param file - File object (or File-like with name, size, type)
 */
export function validateAudioFile(file: { name: string; size: number; type: string }): FileValidationResult {
  const maxBytes = MAX_BEAT_FILE_SIZE_MB * 1024 * 1024;

  if (!ALLOWED_AUDIO_TYPES.includes(file.type as (typeof ALLOWED_AUDIO_TYPES)[number])) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: MP3, WAV, FLAC. Got: ${file.type}`,
    };
  }

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_BEAT_FILE_SIZE_MB}MB. Got: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validates a cover art image file.
 */
export function validateImageFile(file: { name: string; size: number; type: string }): FileValidationResult {
  const maxBytes = MAX_COVER_ART_SIZE_MB * 1024 * 1024;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return {
      valid: false,
      error: `Invalid image type. Allowed: JPEG, PNG, WebP. Got: ${file.type}`,
    };
  }

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Image too large. Maximum size: ${MAX_COVER_ART_SIZE_MB}MB. Got: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generates an R2 storage key for a beat audio file.
 * Pattern: beats/{producerId}/{beatId}/{type}.{ext}
 */
export function generateBeatStorageKey(
  producerId: string,
  beatId: string,
  type: "audio" | "preview" | "stems" | "cover",
  extension: string
): string {
  return `beats/${producerId}/${beatId}/${type}.${extension}`;
}

/**
 * Extracts file extension from filename or MIME type.
 */
export function getFileExtension(filename: string, mimeType?: string): string {
  const fromFilename = filename.split(".").pop()?.toLowerCase() ?? "";
  if (fromFilename) return fromFilename;

  const mimeMap: Record<string, string> = {
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/flac": "flac",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return mimeType ? (mimeMap[mimeType] ?? "bin") : "bin";
}

/**
 * Formats a file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}
