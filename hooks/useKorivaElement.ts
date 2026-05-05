"use client";
import { useEffect, useRef, useState } from "react";
import type { KorivaElementPayload } from "@/components/KorivaLivePreview";

export interface KorivaEditProps {
  "data-cg-el": string;
}

export interface KorivaElementMeta {
  section: string;
  label: string;
  type: "text" | "eyebrow" | "button" | "image" | "link" | "widget";
}

declare global {
  interface Window {
    __KORIVA_REGISTRY__: Map<
      string,
      { defaults: Partial<KorivaElementPayload>; meta?: KorivaElementMeta }
    >;
  }
}

export function useKorivaElement(
  id: string,
  defaults: Partial<KorivaElementPayload>,
  meta?: KorivaElementMeta,
): KorivaElementPayload & { visible: boolean; editProps: KorivaEditProps } {
  const [overrides, setOverrides] = useState<Partial<KorivaElementPayload>>({});
  const registeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.__KORIVA_REGISTRY__) {
      window.__KORIVA_REGISTRY__ = new Map();
    }
    window.__KORIVA_REGISTRY__.set(id, { defaults, meta });
    registeredRef.current = true;
    return () => {
      window.__KORIVA_REGISTRY__?.delete(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<KorivaElementPayload>).detail;
      if (detail.id !== id) return;
      setOverrides((prev: Partial<KorivaElementPayload>) => ({
        ...prev,
        ...detail,
      }));
    }
    window.addEventListener("koriva:element", handler);
    return () => window.removeEventListener("koriva:element", handler);
  }, [id]);

  const merged = { id, ...defaults, ...overrides } as KorivaElementPayload & {
    visible: boolean;
  };
  if (merged.visible === undefined) merged.visible = true;

  return {
    ...merged,
    editProps: { "data-cg-el": id },
  };
}
