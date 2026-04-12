/**
 * @file src/app/api/upload/presigned/route.ts
 * @description Generate presigned R2 URLs for direct client uploads.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePresignedPutUrl } from '@/lib/r2';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limit';

/**
 * Schema for presigned URL requests.
 */
const schema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  contentType: z.string(),
  fileType: z.enum(['beat', 'preview', 'stems', 'cover', 'avatar']),
});

/**
 * POST /api/upload/presigned
 * Generate presigned upload URL (requires auth).
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const result = await checkRateLimit(req, 'API_UPLOAD');
    if (!result.success) {
      return createRateLimitResponse(result);
    }

    // Authenticate
    const { user } = await requireAuth(req);

    // Parse body
    const body = await req.json();
    const { fileName, fileSize, contentType, fileType } = schema.parse(body);

    // Validate file size
    if (fileSize > 200 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large (max 200MB)' },
        { status: 413 }
      );
    }

    // Generate storage key
    const timestamp = Date.now();
    const key = `${fileType}s/${user.id}/${timestamp}-${fileName}`;

    // Generate presigned PUT URL
    const { url, headers } = await generatePresignedPutUrl({
      key,
      contentType,
      contentLength: fileSize,
      expiresIn: 3600, // 1 hour
    });

    return NextResponse.json({
      success: true,
      url,
      headers,
      key,
    });
  } catch (error) {
    console.error('Presigned URL error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 422 }
      );
    }

    if ((error as any).message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
