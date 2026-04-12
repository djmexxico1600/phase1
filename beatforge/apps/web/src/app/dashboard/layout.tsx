/**
 * @file src/app/dashboard/layout.tsx
 * @description Dashboard layout with sidebar navigation for producers.
 */

import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
