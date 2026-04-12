/**
 * @file src/app/(marketplace)/beats/[slug]/page.tsx
 * @description Beat detail page with waveform, licenses, purchase options.
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { BeatDetail } from '@/components/marketplace/BeatDetail';

interface BeatPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BeatPageProps): Promise<Metadata> {
  const beat = await db.query.beats
    .findFirst({
      where: (beats, { eq }) => eq(beats.slug, params.slug),
      with: { producer: true },
    })
    .catch(() => null);

  if (!beat) {
    return {
      title: 'Beat Not Found - BeatForge',
    };
  }

  return {
    title: `${beat.title} - BeatForge`,
    description: beat.description || `A ${beat.genre} beat by ${beat.producer.name}`,
    openGraph: {
      title: beat.title,
      description: beat.description || '',
      images: [{
        url: beat.coverArt || '/default-beat.png',
        width: 1200,
        height: 630,
      }],
    },
  };
}

export default async function BeatPage({ params }: BeatPageProps) {
  const beat = await db.query.beats
    .findFirst({
      where: (beats, { eq }) => eq(beats.slug, params.slug),
      with: {
        producer: {
          columns: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            verified: true,
          },
        },
        licenses: true,
        tags: {
          with: { tag: true },
        },
      },
    })
    .catch(() => null);

  if (!beat) {
    notFound();
  }

  // TODO: Fetch related beats
  // const relatedBeats = await db.query.beats.findMany({
  //   where: (beats, { eq, and, ne }) =>
  //     and(eq(beats.genre, beat.genre), ne(beats.id, beat.id)),
  //   limit: 4,
  // });

  return <BeatDetail beat={beat} />;
}
