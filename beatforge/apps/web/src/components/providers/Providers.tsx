/**
 * @file src/components/providers/Providers.tsx
 * @description Top-level React providers: TanStack Query, tRPC, Theme, Auth, Sentry.
 * Wrap around root layout.
 */

'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import PostHogProvider from './PostHogProvider';
import SentryProvider from './SentryProvider';
import TRPCProvider from './TRPCProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Create query client once per app lifecycle.
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry 4xx errors
          if (error instanceof Error && (error as any).status >= 400) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

const queryClient = createQueryClient();

/**
 * Root Provider Component.
 * Composes: tRPC, Query, Theme, Auth, PostHog, Sentry.
 */
export function Providers({ children }: ProvidersProps) {
  const [trpcClient] = useState(() => createTRPCClient());

  return (
    <SentryProvider>
      <TRPCProvider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <PostHogProvider>
              {children}
              <Toaster />
            </PostHogProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </TRPCProvider>
    </SentryProvider>
  );
}

/**
 * Create tRPC client (stub for now, fleshed out in tRPC provider).
 */
function createTRPCClient(): any {
  return {};
}

export default Providers;
