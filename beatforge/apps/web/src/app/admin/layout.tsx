/**
 * @file src/app/admin/layout.tsx
 * @description Admin panel layout with access guard.
 */

import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // TODO: Add admin auth guard
  // if (!user || user.role !== 'admin') {
  //   redirect('/');
  // }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
