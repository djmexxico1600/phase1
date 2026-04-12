/**
 * @file src/app/layout.tsx
 * @description Root layout for BeatForge.
 * Sets up fonts, theme, global providers.
 */

import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import '@/app/globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-display',
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'BeatForge – The Next-Gen Beat Marketplace',
  description:
    'Unlimited free beat uploads, zero-bug mobile experience, fair economics, real discovery. The beat marketplace that fixes everything.',
  applicationName: 'BeatForge',
  authors: [{ name: 'BeatForge' }],
  creator: 'BeatForge',
  keywords: [
    'beats',
    'music production',
    'beat marketplace',
    'producer',
    'royalty-free',
    'instrumentals',
  ],
  referrer: 'strict-origin-when-cross-origin',
  colorScheme: 'dark light',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    title: 'BeatForge – The Next-Gen Beat Marketplace',
    description: 'Buy, sell, and discover music beats with fair economics.',
    siteName: 'BeatForge',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeatForge – The Next-Gen Beat Marketplace',
    description: 'Buy, sell, and discover music beats.',
    images: ['/og-image.png'],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
