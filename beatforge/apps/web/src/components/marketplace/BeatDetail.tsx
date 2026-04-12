/**
 * @file src/components/marketplace/BeatDetail.tsx
 * @description Beat detail view with waveform, licenses, related beats.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HumanMadeBadge } from '@/components/common/HumanMadeBadge';
import { Play, Heart, Download, Share2, Music } from 'lucide-react';
import { WaveformPlayer } from '@/components/marketplace/WaveformPlayer';

interface BeatDetailProps {
  beat: any;
}

export function BeatDetail({ beat }: BeatDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(beat.licenses?.[0]?.id);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href="/marketplace/beats" className="hover:text-primary">
            Beats
          </Link>
          <span className="mx-2">/</span>
          <span>{beat.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Player & Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Cover Art */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
              {beat.coverArt ? (
                <Image
                  src={beat.coverArt}
                  alt={beat.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <Music className="w-16 h-16 text-primary/50" />
                </div>
              )}

              {/* Play Button Overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="w-16 h-16 text-white fill-white" />
              </button>
            </div>

            {/* Waveform Player */}
            {isPlaying && (
              <WaveformPlayer
                url={beat.audioUrl}
                title={beat.title}
                onClose={() => setIsPlaying(false)}
              />
            )}

            {/* Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{beat.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/producers/${beat.producer.username}`}
                        className="hover:underline"
                      >
                        <span className="font-semibold">{beat.producer.name}</span>
                      </Link>
                      {beat.producer.verified && <HumanMadeBadge className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${beat.basePrice}</div>
                    <div className="text-xs text-muted-foreground">{beat.playCount} plays</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{beat.genre}</Badge>
                  <Badge variant="secondary">{beat.mood}</Badge>
                  <Badge variant="secondary">{beat.bpm} BPM</Badge>
                  <Badge variant="secondary">Key: {beat.key}</Badge>
                </div>

                {/* Description */}
                {beat.description && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{beat.description}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold">{beat.duration}s</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{beat.bpm}</div>
                    <div className="text-xs text-muted-foreground">BPM</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{beat.key}</div>
                    <div className="text-xs text-muted-foreground">Key</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Licenses & Purchase */}
          <div className="space-y-4">
            {/* Licenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose License</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {beat.licenses?.map((license: any) => (
                  <button
                    key={license.id}
                    onClick={() => setSelectedLicense(license.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedLicense === license.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <div className="font-semibold text-sm">{license.name}</div>
                    <div className="text-xs text-muted-foreground">${license.price}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Purchase Button */}
            <Button className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? 'bg-accent/10 border-accent' : ''}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-accent text-accent' : ''}`} />
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Producer Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Producer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href={`/producers/${beat.producer.username}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  {beat.producer.avatar && (
                    <Image
                      src={beat.producer.avatar}
                      alt={beat.producer.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-sm">{beat.producer.name}</div>
                    {beat.producer.verified && <HumanMadeBadge className="w-3 h-3" />}
                  </div>
                </Link>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/producers/${beat.producer.username}`}>
                    View Store
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
