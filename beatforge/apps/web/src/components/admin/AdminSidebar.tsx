/**
 * @file src/components/admin/AdminSidebar.tsx
 * @description Admin navigation sidebar.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BarChart3, CheckCircle2, Music, Users } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/verification', label: 'Verification Queue', icon: CheckCircle2 },
  { href: '/admin/beats', label: 'Beat Moderation', icon: Music },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-border bg-secondary/30">
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn('w-full justify-start', isActive && 'bg-destructive text-white')}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
