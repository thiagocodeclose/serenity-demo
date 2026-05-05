'use client';
// components/SiteDataProvider.tsx
// Provides live Koriva config to all client components via context.
// Falls back silently — components use static site-data.ts when config is null.

import { createContext, useContext } from 'react';
import type { KorivaConfig } from '@/lib/koriva-config';

const SiteDataContext = createContext<KorivaConfig | null>(null);

export function SiteDataProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: KorivaConfig | null;
}) {
  return (
    <SiteDataContext.Provider value={config}>
      {children}
    </SiteDataContext.Provider>
  );
}

/** Returns live Koriva config, or null if not yet published / API unavailable. */
export function useSiteData(): KorivaConfig | null {
  return useContext(SiteDataContext);
}
