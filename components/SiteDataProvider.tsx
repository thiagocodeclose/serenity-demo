"use client";
// components/SiteDataProvider.tsx
// Provides live Garrison365 config + live studio operational data to all client components.
// Falls back silently — components use static site-data.ts when config is null.
//
// Preview mode: if ?preview_id=<site_uuid> is in the URL, fetches the draft
// config from the Garrison365 API and overrides the server-side config.

import { createContext, useContext, useEffect, useState } from "react";
import type { Garrison365Config } from "@/lib/garrison365-config";

// studioInfo shape from /api/public/studio-info (get_public_studio_info RPC)
export interface StudioInfo {
  name?: string;
  logo?: string | null;
  address?: string | null; // street address
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  social_links?: Record<string, string>;
  timezone?: string | null;
  operating_hours?: Record<
    string,
    { open: string; close: string; closed: boolean }
  > | null;
}

type SiteContextValue = Garrison365Config & {
  studioInfo: StudioInfo | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  widgetConfig: Record<string, unknown> | null;
};

const SiteDataContext = createContext<SiteContextValue | null>(null);

const GARRISON365_API =
  process.env.NEXT_PUBLIC_CODEGYM_URL || "https://app.codegyms.com";

const DEFAULT_SLUG = process.env.NEXT_PUBLIC_GYM_SLUG || "serenity-wellness";

export function SiteDataProvider({
  children,
  config: serverConfig,
}: {
  children: React.ReactNode;
  config: Garrison365Config | null;
}) {
  const [ctx, setCtx] = useState<SiteContextValue | null>(
    serverConfig
      ? { ...serverConfig, studioInfo: null, widgetConfig: null }
      : null,
  );

  useEffect(() => {
    const previewId =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("preview_id")
        : null;

    const resolveConfig: Promise<Garrison365Config | null> = previewId
      ? fetch(
          `${GARRISON365_API}/api/site-config?preview_id=${encodeURIComponent(previewId)}`,
        )
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      : Promise.resolve(serverConfig);

    resolveConfig.then((cfg) => {
      if (previewId && cfg) {
        setCtx((prev) =>
          prev
            ? { ...prev, ...cfg }
            : { ...cfg, studioInfo: null, widgetConfig: null },
        );
      }

      const slug = cfg?.gym?.slug || DEFAULT_SLUG;

      // Fetch live studio info + widget config in parallel
      Promise.all([
        fetch(
          `${GARRISON365_API}/api/public/studio-info?slug=${encodeURIComponent(slug)}`,
        )
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch(
          `${GARRISON365_API}/api/widgets/config?slug=${encodeURIComponent(slug)}`,
        )
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]).then(
        ([info, widgetCfg]: [
          (StudioInfo & { error?: unknown }) | null,
          Record<string, unknown> | null,
        ]) => {
          setCtx((prev) => {
            if (!prev) return prev;
            const updates: Partial<SiteContextValue> = {};
            if (info && !info.error) updates.studioInfo = info as StudioInfo;
            if (widgetCfg && !(widgetCfg as { error?: unknown }).error)
              updates.widgetConfig = widgetCfg;
            return { ...prev, ...updates };
          });
        },
      );
    });
  }, []);

  return (
    <SiteDataContext.Provider value={ctx}>{children}</SiteDataContext.Provider>
  );
}

/** Returns live Garrison365 config + studioInfo, or null if unavailable. */
export function useSiteData(): SiteContextValue | null {
  return useContext(SiteDataContext);
}
