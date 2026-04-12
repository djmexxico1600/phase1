/**
 * @file src/components/providers/TRPCProvider.tsx
 * @description tRPC client provider with React Query integration.
 */

'use client';

import { ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpLink } from '@trpc/react-query';
import { transformer } from '@trpc/shared';
import superjson from 'superjson';

interface TRPCProviderProps {
  children: ReactNode;
  client: any;
  queryClient: QueryClient;
}

export default function TRPCProvider({
  children,
  client,
  queryClient,
}: TRPCProviderProps) {
  const [trpcClient] = useState(() => client);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
