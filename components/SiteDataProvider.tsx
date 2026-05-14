// @ts-nocheck
"use client";
// components/SiteDataProvider.tsx
// Combines KorivaConfig (SSR brand/canvas) with live operational data
// (instructors, plans, reviews, studioInfo, classSessions, classTypes, widgetConfig).
// Preview mode: if ?preview_id= is in the URL, fetches draft config + resolves
// live data from the previewed gym's slug.

import { createContext, useContext, useEffect, useState } from "react";
import type { KorivaConfig } from "@/lib/koriva-config";

const KORIVA_API =
  process.env.NEXT_PUBLIC_CODEGYM_URL || "https://app.codegyms.com";

// Extend KorivaConfig with the live operational data shape
type SiteContextValue = KorivaConfig & {
  instructors: any[];
  plans: any[];
  reviews: { reviews: any[]; average_rating: number; total_reviews: number };
  studioInfo: any | null;
  widgetConfig: any | null;
  classSessions: any[];
  classTypes: any[];
  loading: boolean;
};

const SiteDataContext = createContext<SiteContextValue | null>(null);

export function SiteDataProvider({
  children,
  config: serverConfig,
}: {
  children: React.ReactNode;
  config: KorivaConfig | null;
}) {
  const [ctx, setCtx] = useState<SiteContextValue | null>(
    serverConfig
      ? {
          ...serverConfig,
          instructors: [],
          plans: [],
          reviews: { reviews: [], average_rating: 5, total_reviews: 0 },
          studioInfo: null,
          widgetConfig: null,
          classSessions: [],
          classTypes: [],
          loading: true,
        }
      : null,
  );

  useEffect(() => {
    const defaultSlug =
      process.env.NEXT_PUBLIC_GYM_SLUG || "serenity-wellness";

    // Check for ?preview_id= in the URL — signals a client preview share link
    const previewId =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("preview_id")
        : null;

    const resolveConfig: Promise<KorivaConfig | null> = previewId
      ? fetch(
          `${KORIVA_API}/api/site-config?preview_id=${encodeURIComponent(previewId)}`,
        )
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      : Promise.resolve(serverConfig);

    resolveConfig.then((cfg) => {
      // Override KorivaConfig if preview resolved a new one
      if (previewId && cfg) {
        setCtx((prev) => ({ ...prev, ...cfg, loading: prev?.loading ?? true }));
      }

      const slug = cfg?.gym?.slug || defaultSlug;
      const base = KORIVA_API;

      Promise.all([
        fetch(`${base}/api/public/instructors?slug=${slug}`)
          .then((r) => r.json())
          .catch(() => ({ instructors: [] })),
        fetch(`${base}/api/public/pricing?slug=${slug}`)
          .then((r) => r.json())
          .catch(() => ({ plans: [] })),
        fetch(`${base}/api/public/reviews?slug=${slug}`)
          .then((r) => r.json())
          .catch(() => ({ reviews: [], average_rating: 5, total_reviews: 0 })),
        fetch(`${base}/api/public/studio-info?slug=${slug}`)
          .then((r) => r.json())
          .catch(() => null),
        fetch(`${base}/api/widgets/config?slug=${slug}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch(`${base}/api/public/classes?slug=${slug}`)
          .then((r) => (r.ok ? r.json() : { classes: [] }))
          .catch(() => ({ classes: [] })),
        fetch(`${base}/api/public/class-types?slug=${slug}`)
          .then((r) => (r.ok ? r.json() : { classes: [] }))
          .catch(() => ({ classes: [] })),
      ]).then(([instr, pricing, revs, studio, widgetCfg, classData, classTypesData]) => {
        setCtx((prev) => ({
          ...(prev ?? {}),
          ...(cfg ?? {}),
          instructors: instr?.instructors ?? [],
          plans: pricing?.plans ?? [],
          reviews: {
            reviews: revs?.reviews ?? [],
            average_rating: revs?.average_rating ?? 5,
            total_reviews: revs?.total_reviews ?? 0,
          },
          studioInfo: studio ?? null,
          widgetConfig: widgetCfg ?? null,
          classSessions: classData?.classes ?? [],
          classTypes: classTypesData?.classes ?? [],
          loading: false,
        }));
      });
    });
  }, []);

  return (
    <SiteDataContext.Provider value={ctx}>
      {children}
    </SiteDataContext.Provider>
  );
}

/** Returns merged KorivaConfig + live data, or null if no config available. */
export function useSiteData(): SiteContextValue | null {
  return useContext(SiteDataContext);
}
