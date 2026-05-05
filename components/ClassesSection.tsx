'use client';

import { Reveal } from '@/components/Reveal';
import { koriva } from '@/lib/site-data';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export function ClassesSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(640);

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

  const src = `${koriva.baseUrl}/widgets/classes/${koriva.gymSlug}?embed=1&cg_primary=8B7355&cg_bg=FAF8F5&cg_text=2C2C2C&cg_radius=4&cg_mode=light`;

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
            <Link href="#" className="btn-outline">
              View Full Schedule →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
