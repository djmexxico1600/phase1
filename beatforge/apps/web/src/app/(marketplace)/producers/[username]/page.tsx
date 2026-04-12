/**
 * @file src/app/(marketplace)/producers/[username]/page.tsx
 * @description Producer storefront page.
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { ProducerStorefront } from '@/components/marketplace/ProducerStorefront';

interface ProducerPageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: ProducerPageProps): Promise<Metadata> {
  const producer = await db.query.users
    .findFirst({
      where: (users, { eq }) => eq(users.username, params.username),
    })
    .catch(() => null);

  if (!producer) {
    return { title: 'Producer Not Found - BeatForge' };
  }

  return {
    title: `${producer.name} - BeatForge Producer Store`,
    description: producer.bio || `Explore ${producer.name}'s beats on BeatForge`,
    openGraph: {
      title: `${producer.name} - BeatForge`,
      description: producer.bio || '',
      images: [{
        url: producer.avatar || '/default-avatar.png',
        width: 400,
        height: 400,
      }],
    },
  };
}

export default async function ProducerPage({ params }: ProducerPageProps) {
  const producer = await db.query.users
    .findFirst({
      where: (users, { eq, and }) =>
        and(
          eq(users.username, params.username),
          eq(users.role, 'producer')
        ),
    })
    .catch(() => null);

  if (!producer) {
    notFound();
  }

  // Get producer's published beats
  const beats = await db.query.beats
    .findMany({
      where: (beats, { eq, and }) =>
        and(
          eq(beats.producerId, producer.id),
          eq(beats.status, 'published')
        ),
      limit: 12,
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
      },
    })
    .catch(() => []);

  return <ProducerStorefront producer={producer} beats={beats} />;
}
