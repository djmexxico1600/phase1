"use client";

import React, { ReactNode, useEffect } from 'react';
import posthog from 'posthog-js';
import PostHogPageView from './PostHogPageView';

interface PostHogProviderProps {
  children?: ReactNode;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      try {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        });
      } catch (e) {
        // ignore in CI/local
      }
    }
  }, []);

  return (
    <>
      <PostHogPageView />
      {children}
    </>
  );
}
