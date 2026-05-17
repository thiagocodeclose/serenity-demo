"use client";
import { useEffect, useRef, useState } from "react";
import type { Garrison365ElementPayload } from "@/components/Garrison365LivePreview";

export interface Garrison365EditProps {
  "data-cg-el": string;
}

export interface Garrison365ElementMeta {
  section: string;
  label: string;
  type: "text" | "eyebrow" | "button" | "image" | "link" | "widget";
}

declare global {
  interface Window {
    __GARRISON365_REGISTRY__: Map<
      string,
      { defaults: Partial<Garrison365ElementPayload>; meta?: Garrison365ElementMeta }
    >;
  }
}

export function useGarrison365Element(
  id: string,
  defaults: Partial<Garrison365ElementPayload>,
  meta?: Garrison365ElementMeta,
): Garrison365ElementPayload & { visible: boolean; editProps: Garrison365EditProps } {
  const [overrides, setOverrides] = useState<Partial<Garrison365ElementPayload>>({});
  const registeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.__GARRISON365_REGISTRY__) {
      window.__GARRISON365_REGISTRY__ = new Map();
    }
    window.__GARRISON365_REGISTRY__.set(id, { defaults, meta });
    registeredRef.current = true;
    return () => {
      window.__GARRISON365_REGISTRY__?.delete(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<Garrison365ElementPayload>).detail;
      if (detail.id !== id) return;
      setOverrides((prev: Partial<Garrison365ElementPayload>) => ({
        ...prev,
        ...detail,
      }));
    }
    window.addEventListener("garrison365:element", handler);
    return () => window.removeEventListener("garrison365:element", handler);
  }, [id]);

  const merged = { id, ...defaults, ...overrides } as Garrison365ElementPayload & {
    visible: boolean;
  };
  if (merged.visible === undefined) merged.visible = true;

  return {
    ...merged,
    editProps: { "data-cg-el": id },
  };
}
