'use client';

import { useEffect, useState } from 'react';
import { koriva } from '@/lib/site-data';

export function GlobalWidgets() {
  const [gymSlug, setGymSlug] = useState(koriva.gymSlug);
  const [base, setBase] = useState(koriva.baseUrl);

  // React to koriva:brand for dynamic slug (preview mode in admin)
  useEffect(() => {
    function handler(e: Event) {
      const d = (e as CustomEvent).detail as Record<string, any>;
      if (d.gym_slug !== undefined) setGymSlug(d.gym_slug);
      if (d.base_url !== undefined) setBase(d.base_url);
    }
    window.addEventListener('koriva:brand', handler);
    return () => window.removeEventListener('koriva:brand', handler);
  }, []);

  useEffect(() => {
    if (!gymSlug) return;
    const inject = () => {
      if (typeof window !== 'undefined' && (window as any)._cgInject) {
        (window as any)._cgInject(gymSlug, false);
        return;
      }
      const script = document.createElement('script');
      script.src = `${base}/widgets/loader.js`;
      script.setAttribute('data-gym', gymSlug);
      script.setAttribute('data-key', koriva.widgetKey);
      script.async = true;
      document.head.appendChild(script);
    };
    inject();
  }, [gymSlug, base]);

  return null;
}
