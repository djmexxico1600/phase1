/**
 * @file src/app/sitemap.ts
 * @description Dynamic XML sitemap for SEO.
 */

import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export async function generateSitemaps(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beatforge.io';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/beats`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/producers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  // Dynamic beats (fetched from DB)
  try {
    const beats = await db.query.beats.findMany({
      where: (beats, { eq }) => eq(beats.status, 'published'),
      limit: 50000, // XML sitemap limit
    });

    const beatRoutes: MetadataRoute.Sitemap = beats.map((beat) => ({
      url: `${baseUrl}/beats/${beat.slug}`,
      lastModified: beat.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...beatRoutes];
  } catch {
    return staticRoutes;
  }
}

export default generateSitemaps;
