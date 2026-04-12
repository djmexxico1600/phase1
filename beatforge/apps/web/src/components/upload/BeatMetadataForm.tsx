/**
 * @file src/components/upload/BeatMetadataForm.tsx
 * @description Beat metadata form (title, genre, mood, BPM, key, price).
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadBeatSchema, BEAT_GENRES, BEAT_MOODS, BEAT_KEYS } from '@beatforge/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface BeatMetadataFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: Partial<any>;
}

export function BeatMetadataForm({
  onSubmit,
  isLoading,
  initialData,
}: BeatMetadataFormProps) {
  const form = useForm({
    resolver: zodResolver(uploadBeatSchema),
    defaultValues: {
      title: '',
      description: '',
      genre: 'Trap',
      mood: 'Dark',
      key: 'Am',
      bpm: 95,
      basePrice: 29,
      ...initialData,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beat Details</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Beat Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Dark Trap 2024"
              {...form.register('title')}
              disabled={isLoading}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your beat..."
              className="min-h-24"
              {...form.register('description')}
              disabled={isLoading}
            />
          </div>

          {/* Genre & Mood */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <select
                id="genre"
                {...form.register('genre')}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                disabled={isLoading}
              >
                {BEAT_GENRES.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Mood *</Label>
              <select
                id="mood"
                {...form.register('mood')}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                disabled={isLoading}
              >
                {BEAT_MOODS.map((mood) => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>
          </div>

          {/* BPM & Key */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bpm">BPM *</Label>
              <Input
                id="bpm"
                type="number"
                min={40}
                max={240}
                placeholder="95"
                {...form.register('bpm', { valueAsNumber: true })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key">Key *</Label>
              <select
                id="key"
                {...form.register('key')}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                disabled={isLoading}
              >
                {BEAT_KEYS?.map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price ($) *</Label>
            <Input
              id="basePrice"
              type="number"
              min={9}
              max={999}
              placeholder="29"
              {...form.register('basePrice', { valueAsNumber: true })}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              License prices will be relative to this base price
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            Next
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
