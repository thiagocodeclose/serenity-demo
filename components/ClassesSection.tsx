'use client';

import { Reveal } from '@/components/Reveal';
import { koriva } from '@/lib/site-data';
import { useEffect, useRef, useState } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';

export function ClassesSection() {
  const siteData = useSiteData();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(640);

  // Reactive brand colors/slug for widget URL + integration flags
  const [brandColors, setBrandColors] = useState<{
    primary?: string;
    bg?: string;
    text?: string;
    radius?: string;
    mode?: string;
    gymSlug?: string;
    booking_enabled?: boolean;
    base_url?: string;
  }>();

  useEffect(() => {
    function handler(e: Event) {
      const d = (e as CustomEvent).detail as Record<string, any>;
      setBrandColors((prev) => ({
        ...prev,
        primary: d.primary_color !== undefined ? d.primary_color?.replace('#', '') : prev?.primary,
        bg: d.bg_color !== undefined ? d.bg_color?.replace('#', '') : prev?.bg,
        text: d.text_color !== undefined ? d.text_color?.replace('#', '') : prev?.text,
        radius: d.border_radius !== undefined ? d.border_radius : prev?.radius,
        mode: d.color_mode !== undefined ? d.color_mode : prev?.mode,
        gymSlug: d.gym_slug !== undefined ? d.gym_slug : prev?.gymSlug,
        booking_enabled: d.booking_enabled !== undefined ? d.booking_enabled : prev?.booking_enabled,
        base_url: d.base_url !== undefined ? d.base_url : prev?.base_url,
      }));
    }
    window.addEventListener('koriva:brand', handler);
    return () => window.removeEventListener('koriva:brand', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== koriva.baseUrl) return;
      const d = e.data;
      if (d?.source === 'codegym-widget' && d?.type === 'widget:resize' && d?.widget === 'classes') {
        setIframeHeight(d.payload.height + 24);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const primary = brandColors?.primary || siteData?.brand?.color_primary || '8B7355';
  const bg = brandColors?.bg || siteData?.brand?.color_bg || 'FAF8F5';
  const text = brandColors?.text || siteData?.brand?.color_text || '2C2C2C';
  const radius = brandColors?.radius || siteData?.brand?.color_radius || '4';
  const mode = brandColors?.mode || siteData?.brand?.color_mode || 'light';
  const slug = brandColors?.gymSlug || siteData?.gym?.slug || koriva.gymSlug;
  const base = brandColors?.base_url || siteData?.gym?.base_url || koriva.baseUrl;
  const bookingEnabled = brandColors?.booking_enabled ?? siteData?.gym?.booking_enabled ?? false;
  const bookingUrl = slug ? `${base}/schedule/${slug}` : '';
  const src = `${koriva.baseUrl}/widgets/classes/${slug}?embed=1&cg_primary=${primary}&cg_bg=${bg}&cg_text=${text}&cg_radius=${radius}&cg_mode=${mode}`;

  return (
    <section id="classes" className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow mb-4">Your Practice</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="font-heading text-ink"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Find Your Practice
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="divider" />
          </Reveal>
          <Reveal delay={0.25}>
            <p className="font-body text-muted max-w-lg mx-auto leading-relaxed text-base md:text-lg">
              From sunrise flow to candlelight restore, every class is an invitation
              to go deeper — into your body, your breath, your self.
            </p>
          </Reveal>
        </div>

        {/* Koriva Classes Widget */}
        <Reveal delay={0.1}>
          <div
            className="rounded-none overflow-hidden shadow-none"
            style={{ background: 'var(--bg)' }}
          >
            <iframe
              ref={iframeRef}
              src={src}
              title="Serenity Wellness Studio Classes"
              className="koriva-widget-frame"
              style={{ height: `${iframeHeight}px` }}
              allow="clipboard-write"
              loading="lazy"
            />
          </div>
        </Reveal>

        {/* View all link */}
        <Reveal delay={0.2}>
          <div className="text-center mt-10">
            <a
              href={bookingEnabled && bookingUrl ? bookingUrl : '#'}
              target={bookingEnabled && bookingUrl ? '_blank' : undefined}
              rel={bookingEnabled && bookingUrl ? 'noopener noreferrer' : undefined}
              className="btn-outline"
            >
              View Full Schedule →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
