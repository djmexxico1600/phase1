/**
 * @file src/app/(checkout)/layout.tsx
 * @description Checkout routes layout.
 */

import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
