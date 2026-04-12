/**
 * @file src/components/marketplace/BeatCard.tsx
 * @description Core beat card component for marketplace grid.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { HumanMadeBadge } from '@/components/common/HumanMadeBadge';
import { Play, Heart } from 'lucide-react';
import { type BeatSummary } from '@beatforge/shared';

interface BeatCardProps {
  beat: BeatSummary;
  onPlay?: (beat: BeatSummary) => void;
}

export function BeatCard({ beat, onPlay }: BeatCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:border-primary">
      {/* Cover Art */}
      <CardContent className="p-0 relative overflow-hidden aspect-square bg-muted">
        {beat.coverArtUrl ? (
          <Image
            src={beat.coverArtUrl}
            alt={beat.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
            <span className="text-4xl">🎵</span>
          </div>
        )}

        {/* Play Button Overlay */}
        <Button
          size="icon"
          className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-16 h-16"
          onClick={(e) => {
            e.preventDefault();
            onPlay?.(beat);
          }}
        >
          <Play className="w-6 h-6 ml-1" fill="currentColor" />
        </Button>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {beat.isHumanMade && <Badge variant="default">Verified</Badge>}
          {beat.isFeatured && <Badge variant="secondary">Featured</Badge>}
          {beat.isExclusive && <Badge variant="outline">Exclusive</Badge>}
        </div>

        {/* Stats Badge (top right) */}
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs text-muted-foreground">
          {beat.playCount.toLocaleString()} plays
        </div>
      </CardContent>

      {/* Beat Info */}
      <div className="flex-1 p-4">
        {/* Title */}
        <Link href={`/beats/${beat.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
            {beat.title}
          </h3>
        </Link>

        {/* Producer */}
        <div className="flex items-center gap-2 mt-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={beat.producer.avatarUrl} />
            <AvatarFallback>{beat.producer.displayName.charAt(0)}</AvatarFallback>
          </Avatar>

          <Link
            href={`/producers/${beat.producer.username}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {beat.producer.displayName}
            {beat.producer.humanMadeBadge && <HumanMadeBadge size="sm" />}
          </Link>
        </div>

        {/* Tags */}
        {beat.genre && (
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="text-xs">
              {beat.genre}
            </Badge>
            {beat.mood && (
              <Badge variant="outline" className="text-xs">
                {beat.mood}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Footer with Price */}
      <CardFooter className="flex items-center justify-between border-t border-border p-4">
        <div>
          <span className="font-bold text-primary text-lg">
            ${beat.lowestPrice.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground ml-1">+</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BeatCard;
