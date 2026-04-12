/**
 * @file src/app/dashboard/earnings/page.tsx
 * @description Producer earnings page.
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DollarSign, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Earnings - BeatForge Producer',
  description: 'View your earnings',
};

export default function EarningsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">Track your revenue and earnings breakdown</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Earnings"
          value="$2,340.50"
          description="Lifetime earnings"
          icon={<DollarSign className="w-4 h-4 text-accent" />}
        />
        <StatsCard
          title="This Month"
          value="$340.00"
          description="Current month"
          change={{ value: 25, label: 'vs last month', trend: 'up' }}
          icon={<TrendingUp className="w-4 h-4 text-accent" />}
        />
        <StatsCard
          title="Pending"
          value="$127.50"
          description="Available for payout"
        />
      </div>

      {/* Earnings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Exclusive Licenses', amount: 1200.00, percentage: 51 },
              { label: 'Standard Licenses', amount: 680.50, percentage: 29 },
              { label: 'Basic Licenses', amount: 320.00, percentage: 14 },
              { label: 'Subscription Sales', amount: 140.00, percentage: 6 },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-semibold">${item.amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2026-04-10', license: 'Exclusive', amount: 299.00 },
              { date: '2026-04-09', license: 'Standard', amount: 99.00 },
              { date: '2026-04-08', license: 'Basic', amount: 29.00 },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="text-sm font-semibold">{tx.license} License Sale</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <p className="text-sm font-bold text-accent">+${tx.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
