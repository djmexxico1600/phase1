/**
 * @file src/app/(marketplace)/beats/page.tsx
 * @description Marketplace beats browse page with filters and infinite scroll.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { BeatFilters } from '@/components/marketplace/BeatFilters';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { BeatCard } from '@/components/marketplace/BeatCard';
import { BeatGrid } from '@/components/marketplace/BeatGrid';

export const metadata: Metadata = {
  title: 'Browse Beats - BeatForge Marketplace',
  description: 'Discover and buy royalty-free beats from producers worldwide',
};

export default async function BeatsPage({ searchParams }: any) {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Beats</h1>
          <p className="text-muted-foreground">
            Browse thousands of royalty-free beats from talented producers
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-2xl">
          <SearchBar />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <BeatFilters />
          </div>

          {/* Beat Grid */}
          <div className="md:col-span-3">
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-secondary rounded-lg" />
                  </div>
                ))}
              </div>
            }>
              <BeatGrid searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
