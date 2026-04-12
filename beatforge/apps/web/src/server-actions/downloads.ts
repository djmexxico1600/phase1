/**
 * @file src/server-actions/downloads.ts
 * @description Download management Server Actions.
 */

'use server';

import { auth } from '@/lib/auth';
import { r2 } from '@/lib/r2';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Generate signed R2 download URL for beat.
 */
export async function generateDownloadUrlAction(beatId: string, format: 'mp3' | 'wav' | 'stems') {
  try {
    const { user } = await auth.api.getSession();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // TODO: Verify user owns license for this beat
    // const license = await db.query.transactions.findFirst({
    //   where: (t, { eq, and }) =>
    //     and(eq(t.beatId, beatId), eq(t.buyerId, user.id)),
    // });
    //
    // if (!license) {
    //   throw new Error('You do not own a license for this beat');
    // }

    // Generate signed URL
    const filename = `${beatId}-${format}`;
    const url = await r2.getDownloadUrl(filename, { expiresIn: 3600 });

    // Log download
    logger.info('Download initiated', {
      userId: user.id,
      beatId,
      format,
    });

    return { success: true, downloadUrl: url };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate download URL';
    logger.error('Download generation failed', { error });
    return { error: message };
  }
}

/**
 * Increment beat download count.
 */
export async function incrementDownloadCountAction(beatId: string) {
  try {
    // TODO: Increment analytics record
    logger.info('Download count incremented', { beatId });
    return { success: true };
  } catch (error) {
    logger.error('Download count increment failed', { error });
    return { error: 'Failed to record download' };
  }
}
