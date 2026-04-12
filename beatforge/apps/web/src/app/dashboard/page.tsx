/**
 * @file src/app/dashboard/page.tsx
 * @description Producer dashboard overview.
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Music, DollarSign, TrendingUp, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard - BeatForge Producer',
  description: 'Your producer dashboard',
};

export default function DashboardPage() {
  // TODO: Fetch real stats from database
  const stats = {
    totalBeats: 12,
    totalPlays: 4250,
    totalEarnings: 2340.50,
    totalDownloads: 156,
    monthlyGrowth: 23,
    earningsGrowth: 15,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's how your beats are performing.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Beats"
          value={stats.totalBeats}
          description="Published beats"
          icon={<Music className="w-4 h-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Plays"
          value={stats.totalPlays}
          description="All-time plays"
          icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
          change={{ value: stats.monthlyGrowth, label: 'this month', trend: 'up' }}
        />
        <StatsCard
          title="Earnings"
          value={`$${stats.totalEarnings.toFixed(2)}`}
          description="Lifetime earnings"
          icon={<DollarSign className="w-4 h-4 text-accent" />}
          change={{ value: stats.earningsGrowth, label: 'vs last month', trend: 'up' }}
        />
        <StatsCard
          title="Downloads"
          value={stats.totalDownloads}
          description="Total downloads"
          icon={<Download className="w-4 h-4 text-muted-foreground" />}
        />
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-semibold">Dark Trap 2024</p>
                  <p className="text-xs text-muted-foreground">Exclusive License</p>
                </div>
                <p className="font-bold text-accent">$299.00</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
