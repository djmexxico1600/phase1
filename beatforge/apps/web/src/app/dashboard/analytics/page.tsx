/**
 * @file src/app/dashboard/analytics/page.tsx
 * @description Producer analytics page with charts.
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Analytics - BeatForge Producer',
  description: 'View your beat analytics',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your beat performance over time</p>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2">
        {['7d', '30d', '90d', '1y'].map((period) => (
          <button
            key={period}
            className={`px-4 py-2 rounded-lg border ${
              period === '30d'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '1 Year'}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plays Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Plays Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {/* TODO: Add Recharts LineChart */}
              Chart Placeholder
            </div>
          </CardContent>
        </Card>

        {/* Top Beats */}
        <Card>
          <CardHeader>
            <CardTitle>Top Beats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Dark Trap 2024', plays: 1250 },
                { title: 'Lofi Vibes', plays: 890 },
                { title: 'Drill Beat v2', plays: 756 },
              ].map((beat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{beat.title}</p>
                  <p className="text-sm text-muted-foreground">{beat.plays} plays</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
