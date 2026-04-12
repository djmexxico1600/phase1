/**
 * @file src/components/marketplace/BeatGrid.tsx
 * @description Beat grid component with infinite scroll.
 * Server component that fetches beats based on filters.
 */

import { db } from '@/lib/db';
import { BeatCard } from '@/components/marketplace/BeatCard';
import { Pagination } from '@/components/ui/pagination';

interface BeatGridProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function BeatGrid({ searchParams }: BeatGridProps) {
  const page = parseInt((searchParams.page as string) || '1');
  const limit = 12;
  const offset = (page - 1) * limit;

  // Extract filters
  const q = (searchParams.q as string) || '';
  const genres = (searchParams.genres as string)?.split(',').filter(Boolean) || [];
  const moods = (searchParams.moods as string)?.split(',').filter(Boolean) || [];
  const bpmMin = parseInt((searchParams.bpmMin as string) || '60');
  const bpmMax = parseInt((searchParams.bpmMax as string) || '180');
  const priceMin = parseInt((searchParams.priceMin as string) || '0');
  const priceMax = parseInt((searchParams.priceMax as string) || '500');

  // TODO: Implement search + filter logic in database queries
  // For now, fetch published beats
  const beats = await db.query.beats.findMany({
    where: (beats, { eq, and, gt, lt, or, like }) =>
      and(
        eq(beats.status, 'published'),
        genres.length > 0 ? or(...genres.map((g) => like(beats.genre, `%${g}%`))) : undefined,
        gt(beats.bpm, bpmMin),
        lt(beats.bpm, bpmMax),
      ),
    limit: limit + 1,
    offset,
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
  }).catch(() => []);

  const hasNextPage = beats.length > limit;
  const displayBeats = beats.slice(0, limit);

  if (displayBeats.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold">No beats found</p>
        <p className="text-muted-foreground">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayBeats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={page}
          hasNextPage={hasNextPage}
          basePath={`/marketplace/beats?${new URLSearchParams(
            Object.entries(searchParams).filter(([_, v]) => v && v !== page.toString())
          ).toString()}`}
        />
      </div>
    </div>
  );
}
