/**
 * @file src/components/marketplace/BeatFilters.tsx
 * @description Beat marketplace filters (genre, mood, key, BPM, licenses).
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { BEAT_GENRES, BEAT_MOODS, BEAT_KEYS } from '@beatforge/shared/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function BeatFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [genres, setGenres] = useState<string[]>(
    searchParams.get('genres')?.split(',').filter(Boolean) || []
  );
  const [moods, setMoods] = useState<string[]>(
    searchParams.get('moods')?.split(',').filter(Boolean) || []
  );
  const [keys, setKeys] = useState<string[]>(
    searchParams.get('keys')?.split(',').filter(Boolean) || []
  );
  const [bpmRange, setBpmRange] = useState<number[]>([
    parseInt(searchParams.get('bpmMin') || '60'),
    parseInt(searchParams.get('bpmMax') || '180'),
  ]);
  const [priceRange, setPriceRange] = useState<number[]>([
    parseInt(searchParams.get('priceMin') || '0'),
    parseInt(searchParams.get('priceMax') || '500'),
  ]);

  function updateFilters() {
    const params = new URLSearchParams();

    if (genres.length) params.set('genres', genres.join(','));
    if (moods.length) params.set('moods', moods.join(','));
    if (keys.length) params.set('keys', keys.join(','));
    params.set('bpmMin', bpmRange[0].toString());
    params.set('bpmMax', bpmRange[1].toString());
    params.set('priceMin', priceRange[0].toString());
    params.set('priceMax', priceRange[1].toString());

    router.push(`/marketplace/beats?${params.toString()}`);
  }

  function clearFilters() {
    setGenres([]);
    setMoods([]);
    setKeys([]);
    setBpmRange([60, 180]);
    setPriceRange([0, 500]);
    router.push('/marketplace/beats');
  }

  const hasActiveFilters = genres.length > 0 || moods.length > 0 || keys.length > 0 ||
    bpmRange[0] !== 60 || bpmRange[1] !== 180 ||
    priceRange[0] !== 0 || priceRange[1] !== 500;

  return (
    <Card className="h-fit sticky top-4">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-3">Filters</h3>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-full mb-3 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Genre</h4>
          <div className="space-y-2">
            {BEAT_GENRES.slice(0, 8).map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre}`}
                  checked={genres.includes(genre)}
                  onCheckedChange={(checked) => {
                    setGenres(checked
                      ? [...genres, genre]
                      : genres.filter((g) => g !== genre)
                    );
                  }}
                />
                <Label htmlFor={`genre-${genre}`} className="text-xs cursor-pointer font-normal">
                  {genre}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Mood</h4>
          <div className="space-y-2">
            {BEAT_MOODS.slice(0, 6).map((mood) => (
              <div key={mood} className="flex items-center space-x-2">
                <Checkbox
                  id={`mood-${mood}`}
                  checked={moods.includes(mood)}
                  onCheckedChange={(checked) => {
                    setMoods(checked
                      ? [...moods, mood]
                      : moods.filter((m) => m !== mood)
                    );
                  }}
                />
                <Label htmlFor={`mood-${mood}`} className="text-xs cursor-pointer font-normal">
                  {mood}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* BPM Range */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">
            BPM: {bpmRange[0]} - {bpmRange[1]}
          </h4>
          <Slider
            value={bpmRange}
            onValueChange={setBpmRange}
            min={40}
            max={240}
            step={5}
            className="w-full"
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">
            Price: ${priceRange[0]} - ${priceRange[1]}
          </h4>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={500}
            step={10}
            className="w-full"
          />
        </div>

        {/* Apply Filters */}
        <Button className="w-full" onClick={updateFilters}>
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
