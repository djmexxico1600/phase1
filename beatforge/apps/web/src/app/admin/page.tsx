/**
 * @file src/app/admin/page.tsx
 * @description Admin panel overview.
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Users, Music, AlertCircle, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Panel - BeatForge',
  description: 'Admin dashboard',
};

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and moderation</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value="1,234"
          description="Active users"
          icon={<Users className="w-4 h-4" />}
        />
        <StatsCard
          title="Total Beats"
          value="456"
          description="Published beats"
          icon={<Music className="w-4 h-4" />}
        />
        <StatsCard
          title="Pending Verification"
          value="12"
          description="Awaiting review"
          icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
        />
        <StatsCard
          title="Verified Producers"
          value="89"
          description="Active producers"
          icon={<CheckCircle2 className="w-4 h-4 text-accent" />}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New producer signup', user: 'john.doe@example.com', time: '5 min ago' },
              { action: 'Beat reported', user: 'Dark Trap 2024', time: '1 hour ago' },
              { action: 'Payout processed', user: '$2,450.00', time: '3 hours ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-semibold text-sm">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.user}</p>
                </div>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
