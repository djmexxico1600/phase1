/**
 * @file lib/r2.ts
 * @description Cloudflare R2 presigned URL generator and upload helpers.
 * All R2 access is presigned; credentials never exposed to client.
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getServerEnv } from './env';

const env = getServerEnv();

// ============================================================
// R2 CLIENT (S3-Compatible)
// ============================================================

export const r2Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});

// ============================================================
// PRESIGNED URL GENERATOR
// ============================================================

/**
 * Generate presigned PUT URL for direct client upload.
 * Allows browser to upload directly to R2 without server bottleneck.
 */
export async function generatePresignedPutUrl(params: {
  key: string;
  contentType: string;
  contentLength?: number;
  expiresIn?: number; // seconds, default 3600
}): Promise<{
  url: string;
  headers: Record<string, string>;
}> {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: params.key,
    ContentType: params.contentType,
    ContentLength: params.contentLength,
  });

  const url = await getSignedUrl(r2Client, command, {
    expiresIn: params.expiresIn || 3600, // 1 hour default
  });

  return {
    url,
    headers: {
      'Content-Type': params.contentType,
      ...(params.contentLength && {
        'Content-Length': params.contentLength.toString(),
      }),
    },
  };
}

/**
 * Generate presigned GET URL for secure file download/streaming.
 * Short expiry (1 hour) prevents unauthorized access to leaked URLs.
 */
export async function generatePresignedGetUrl(params: {
  key: string;
  expiresIn?: number; // seconds, default 3600
  fileName?: string; // Optional filename hint
}): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: params.key,
    ...(params.fileName && {
      ResponseContentDisposition: `inline; filename="${params.fileName}"`,
    }),
  });

  return getSignedUrl(r2Client, command, {
    expiresIn: params.expiresIn || 3600, // 1 hour default
  });
}

// ============================================================
// FILE PATH GENERATORS
// ============================================================

/**
 * Generate R2 storage path for beat audio files.
 */
export function generateBeatStoragePath(params: {
  producerId: string;
  beatId: string;
  type: 'full' | 'preview' | 'stems' | 'waveform';
  extension: string;
}): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `beats/${params.producerId}/${params.beatId}/${params.type}/${timestamp}.${params.extension}`;
}

/**
 * Generate R2 storage path for cover art.
 */
export function generateCoverArtPath(params: {
  producerId: string;
  beatId: string;
  extension: string;
}): string {
  return `cover-art/${params.producerId}/${params.beatId}.${params.extension}`;
}

/**
 * Generate R2 storage path for user avatars.
 */
export function generateAvatarPath(params: {
  userId: string;
  extension: string;
}): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `avatars/${params.userId}/${timestamp}.${params.extension}`;
}

/**
 * Generate R2 storage path for waveform data.
 */
export function generateWaveformPath(params: {
  producerId: string;
  beatId: string;
}): string {
  return `waveforms/${params.producerId}/${params.beatId}.json`;
}

// ============================================================
// MULTIPART UPLOAD HELPERS
// ============================================================

export interface MultipartUploadPart {
  partNumber: number;
  etag: string;
}

/**
 * Generate presigned PUT URL for multipart upload part.
 * Use for files > 5MB split into chunks.
 */
export async function generatePresignedMultipartPutUrl(params: {
  key: string;
  uploadId: string;
  partNumber: number;
  contentLength: number;
}): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: params.key,
  });

  return getSignedUrl(r2Client, command, {
    expiresIn: 3600, // 1 hour for large uploads
  });
}

// ============================================================
// PUBLIC URL GENERATOR
// ============================================================

/**
 * Generate public (non-signed) R2 URL.
 * Use for assets that are intentionally public (logos, etc).
 */
export function getPublicUrl(key: string): string {
  return `${env.R2_PUBLIC_URL}/${key}`;
}

/**
 * Get R2 public CDN URL via Cloudflare.
 */
export function getPublicCdnUrl(key: string): string {
  return `https://cdn.beatforge.io/${key}`;
}

// ============================================================
// TYPES & EXPORTS
// ============================================================

export type FileType = 'full' | 'preview' | 'stems' | 'waveform' | 'cover' | 'avatar';

export interface UploadSession {
  key: string;
  uploadId: string;
  parts: MultipartUploadPart[];
}

export default {
  generatePresignedPutUrl,
  generatePresignedGetUrl,
  generateBeatStoragePath,
  generateCoverArtPath,
  generateAvatarPath,
  generateWaveformPath,
  getPublicUrl,
  getPublicCdnUrl,
};
