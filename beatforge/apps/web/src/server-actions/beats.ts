/**
 * @file src/server-actions/beats.ts
 * @description Beat management Server Actions (create, update, publish, delete).
 */

'use server';

import { z } from 'zod';
import { uploadBeatSchema, updateBeatSchema } from '@beatforge/shared';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { r2 } from '@/lib/r2';
import { generateSlug } from '@beatforge/shared/utils';

/**
 * Create new beat (draft).
 */
export async function createBeatAction(formData: unknown) {
  try {
    const { user } = await auth.api.getSession();
    if (!user || user.role !== 'producer') {
      throw new Error('Only producers can upload beats');
    }

    const data = uploadBeatSchema.parse(formData);

    const slug = generateSlug(data.title);

    // TODO: Insert into database
    // const beat = await db.insert(beats).values({
    //   id: generateId(),
    //   producerId: user.id,
    //   title: data.title,
    //   slug,
    //   description: data.description,
    //   genre: data.genre,
    //   mood: data.mood,
    //   key: data.key,
    //   bpm: data.bpm,
    //   duration: data.duration,
    //   basePrice: data.basePrice,
    //   status: 'draft',
    //   audioUrl: '', // To be set after upload
    //   waveformUrl: '', // To be set after waveform generation
    //   coverArt: data.coverArt,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }).returning();

    return { success: true, beatId: 'beat-id' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create beat';
    return { error: message };
  }
}

/**
 * Update beat details.
 */
export async function updateBeatAction(beatId: string, formData: unknown) {
  try {
    const { user } = await auth.api.getSession();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const data = updateBeatSchema.parse(formData);

    // TODO: Verify ownership and update
    // const beat = await db.query.beats.findFirst({
    //   where: (beats, { eq }) => eq(beats.id, beatId),
    // });
    //
    // if (!beat || beat.producerId !== user.id) {
    //   throw new Error('Not found or unauthorized');
    // }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update beat';
    return { error: message };
  }
}

/**
 * Publish beat.
 */
export async function publishBeatAction(beatId: string) {
  try {
    const { user } = await auth.api.getSession();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // TODO: Verify ownership and publish beat
    // const beat = await db.query.beats.findFirst({
    //   where: (beats, { eq }) => eq(beats.id, beatId),
    // });
    //
    // if (!beat || beat.producerId !== user.id) {
    //   throw new Error('Not found or unauthorized');
    // }
    //
    // if (beat.status !== 'draft') {
    //   throw new Error('Invalid beat status');
    // }
    //
    // await db.update(beats)
    //   .set({ status: 'published' })
    //   .where(eq(beats.id, beatId));

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish beat';
    return { error: message };
  }
}

/**
 * Delete beat.
 */
export async function deleteBeatAction(beatId: string) {
  try {
    const { user } = await auth.api.getSession();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // TODO: Verify ownership, delete from DB and R2
    // const beat = await db.query.beats.findFirst({
    //   where: (beats, { eq }) => eq(beats.id, beatId),
    // });
    //
    // if (!beat || beat.producerId !== user.id) {
    //   throw new Error('Not found or unauthorized');
    // }
    //
    // // Delete files from R2
    // if (beat.audioUrl) {
    //   await r2.delete(beat.audioUrl);
    // }
    // if (beat.waveformUrl) {
    //   await r2.delete(beat.waveformUrl);
    // }
    //
    // // Delete from DB
    // await db.delete(beats).where(eq(beats.id, beatId));

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete beat';
    return { error: message };
  }
}
