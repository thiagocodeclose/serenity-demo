'use client';
// components/SiteDataProvider.tsx
// Provides live Koriva config to all client components via context.
// Falls back silently — components use static site-data.ts when config is null.
//
// Preview mode: if ?preview_id=<site_uuid> is in the URL, fetches the draft
// config from the Koriva API and overrides the server-side config. This allows
// the admin to share a preview link with the client without deploying.

import { createContext, useContext, useEffect, useState } from 'react';
import type { KorivaConfig } from '@/lib/koriva-config';

const SiteDataContext = createContext<KorivaConfig | null>(null);

const KORIVA_API =
  process.env.NEXT_PUBLIC_CODEGYM_URL || 'https://app.codegyms.com';

export function SiteDataProvider({
  children,
  config: serverConfig,
}: {
  children: React.ReactNode;
  config: KorivaConfig | null;
}) {
  const [config, setConfig] = useState<KorivaConfig | null>(serverConfig);

  useEffect(() => {
    // Check for ?preview_id= in the URL — signals a client preview share link
    const previewId =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('preview_id')
        : null;

    if (!previewId) return;

    // Fetch the draft config from the Koriva API (no auth required)
    fetch(`${KORIVA_API}/api/site-config?preview_id=${encodeURIComponent(previewId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: KorivaConfig | null) => {
        if (data) setConfig(data);
      })
      .catch(() => {
        // Silently fall back to server config on error
      });
  }, []);

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
