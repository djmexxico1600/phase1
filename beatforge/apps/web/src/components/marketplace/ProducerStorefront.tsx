/**
 * @file src/components/marketplace/ProducerStorefront.tsx
 * @description Producer storefront component showing producer info and beats.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HumanMadeBadge } from '@/components/common/HumanMadeBadge';
import { BeatCard } from '@/components/marketplace/BeatCard';
import { Mail, Share2 } from 'lucide-react';

interface ProducerStorefrontProps {
  producer: any;
  beats: any[];
}

export function ProducerStorefront({ producer, beats }: ProducerStorefrontProps) {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href="/marketplace/beats" className="hover:text-primary">
            Marketplace
          </Link>
          <span className="mx-2">/</span>
          <span>Producers</span>
          <span className="mx-2">/</span>
          <span>{producer.name}</span>
        </div>

        {/* Producer Header */}
        <Card className="mb-8 border-accent/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
              {/* Avatar */}
              <div>
                {producer.avatar ? (
                  <Image
                    src={producer.avatar}
                    alt={producer.name}
                    width={150}
                    height={150}
                    className="rounded-lg w-full"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary/50">
                      {producer.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{producer.name}</h1>
                    {producer.verified && <HumanMadeBadge />}
                  </div>
                  <p className="text-muted-foreground">@{producer.username}</p>
                </div>

                {producer.bio && (
                  <p className="text-sm text-muted-foreground">{producer.bio}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold">{beats.length}</div>
                    <div className="text-xs text-muted-foreground">Beats</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {beats.reduce((sum, b) => sum + (b.playCount || 0), 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Plays</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2.4K</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href={`/messages/${producer.id}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beats */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Beats</h2>
          {beats.length === 0 ? (
            <p className="text-muted-foreground">No beats published yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {beats.map((beat) => (
                <BeatCard key={beat.id} beat={beat} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
