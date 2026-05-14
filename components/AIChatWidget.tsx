// @ts-nocheck
'use client';

import { useEffect, useRef, useState } from 'react';
import { koriva } from '@/lib/site-data';
import { useSiteData } from '@/components/SiteDataProvider';

export function AIChatWidget() {
  const siteData = useSiteData();
  const iframeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [gymSlug, setGymSlug] = useState(koriva.gymSlug);
  const [base, setBase] = useState(koriva.baseUrl);
  const [primary, setPrimary] = useState('8B7355');
  const [bg, setBg] = useState('FAF9F6');

  // Initialize from SSR config (production)
  useEffect(() => {
    const gym = siteData?.gym;
    const brand = siteData?.brand;
    if (!gym) return;
    if (gym.slug) setGymSlug(gym.slug);
    if (gym.base_url) setBase(gym.base_url);
    if (brand?.color_primary) setPrimary(brand.color_primary.replace('#', ''));
    if (brand?.color_bg) setBg(brand.color_bg.replace('#', ''));
    // Enable by default; disable only if both flags are explicitly false
    const explicitlyDisabled =
      brand?.widgets_ai_chat === false && gym.booking_enabled === false;
    if (explicitlyDisabled) setChatEnabled(false);
  }, [siteData]);

  // Listen to koriva:brand for live-preview updates (admin builder)
  useEffect(() => {
    function handler(e: Event) {
      const d = (e as CustomEvent).detail as Record<string, any>;
      if (d.gym_slug !== undefined) setGymSlug(d.gym_slug);
      if (d.base_url !== undefined) setBase(d.base_url);
      if (d.primary_color !== undefined) setPrimary(d.primary_color?.replace('#', '') ?? '8B7355');
      if (d.bg_color !== undefined) setBg(d.bg_color?.replace('#', '') ?? 'FAF9F6');
      if (d.booking_enabled === false) setChatEnabled(false);
      if (d.booking_enabled === true) setChatEnabled(true);
    }
    window.addEventListener('koriva:brand', handler);
    return () => window.removeEventListener('koriva:brand', handler);
  }, []);

  // Listen for open/close messages from the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.source !== 'codegym-widget') return;
      if (e.data.type === 'chat:open') setIsOpen(true);
      if (e.data.type === 'chat:close') setIsOpen(false);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  if (!chatEnabled) return null;

  const src = `${base}/widgets/chat/${gymSlug}?embed=1&cg_primary=${primary}&cg_bg=${bg}`;

  return (
    <div
      aria-label="AI chat assistant"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        width: isOpen ? '380px' : '64px',
        height: isOpen ? '520px' : '64px',
        transition: 'width 0.3s ease, height 0.3s ease',
        borderRadius: isOpen ? '16px' : '50%',
        overflow: 'hidden',
        boxShadow: isOpen
          ? '0 16px 48px rgba(0,0,0,0.22)'
          : '0 8px 32px rgba(0,0,0,0.18)',
      }}
    >
      <iframe
        ref={iframeRef}
        title="AI Chat Assistant"
        src={src}
        style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
        loading="lazy"
        allow="microphone"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
