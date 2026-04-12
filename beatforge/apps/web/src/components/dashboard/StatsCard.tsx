/**
 * @file src/components/dashboard/StatsCard.tsx
 * @description Statistics card component for dashboard.
 */

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: {
    value: number;
    label: string;
    trend: 'up' | 'down';
  };
  icon?: ReactNode;
}

export function StatsCard({ title, value, description, change, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {change && (
          <div className={`flex items-center gap-1 text-xs mt-2 ${
            change.trend === 'up' ? 'text-accent' : 'text-destructive'
          }`}>
            {change.trend === 'up' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            <span>
              {change.value}% {change.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
