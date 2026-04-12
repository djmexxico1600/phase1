/**
 * @file src/components/providers/PostHogPageView.tsx
 * @description Track page views with PostHog.
 */

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

export default function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }

      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
/**
 * @file src/components/providers/PostHogProvider.tsx
 * @description PostHog analytics provider (client-side).
 */

'use client';

import { ReactNode, useEffect } from 'react';
import posthog from 'posthog-js';
import PostHogPageView from './PostHogPageView';

interface PostHogProviderProps {
  children: ReactNode;
}

export default function PostHogProvider({
  children,
}: PostHogProviderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') ph.debug();
        },
      });
    }
  }, []);

  return (
    <>
      <PostHogPageView />
      {children}
    </>
  );
}
