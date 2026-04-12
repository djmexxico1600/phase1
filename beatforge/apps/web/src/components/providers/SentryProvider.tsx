/**
 * @file src/components/providers/SentryProvider.tsx
 * @description Sentry error tracking provider.
 */

'use client';

import { ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface SentryProviderProps {
  children: ReactNode;
}

export default function SentryProvider({ children }: SentryProviderProps) {
  return children;
}
