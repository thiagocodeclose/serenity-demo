'use client';

import { useEffect } from 'react';
import { koriva } from '@/lib/site-data';

export function GlobalWidgets() {
  useEffect(() => {
    const inject = () => {
      // If already injected, use the public API to re-inject
      if (typeof window !== 'undefined' && (window as any)._cgInject) {
        (window as any)._cgInject(koriva.gymSlug, false);
        return;
      }

      // First-time injection — create script tag
      const script = document.createElement('script');
      script.src = `${koriva.baseUrl}/widgets/loader.js`;
      script.setAttribute('data-gym', koriva.gymSlug);
      script.setAttribute('data-key', koriva.widgetKey);
      script.async = true;
      document.head.appendChild(script);
    };

    inject();
  }, []);

  return null;
}
