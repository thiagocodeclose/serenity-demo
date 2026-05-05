'use client';

import { Reveal } from '@/components/Reveal';
import { koriva } from '@/lib/site-data';
import { useEffect, useRef, useState } from 'react';

export function PricingSection() {
  const [iframeHeight, setIframeHeight] = useState(520);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== koriva.baseUrl) return;
      const d = e.data;
      if (d?.source === 'codegym-widget' && d?.type === 'widget:resize' && d?.widget === 'pricing') {
        setIframeHeight(d.payload.height + 24);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const src = `${koriva.baseUrl}/widgets/pricing/${koriva.gymSlug}?embed=1&cg_primary=8B7355&cg_bg=F0EBE3&cg_text=2C2C2C&cg_radius=4&cg_mode=light`;

  return (
    <section id="pricing" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow mb-4">Membership</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="font-heading text-ink"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Your Journey Starts Here
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="divider" />
          </Reveal>
          <Reveal delay={0.25}>
            <p className="font-body text-muted max-w-md mx-auto leading-relaxed">
              Simple, transparent pricing. No hidden fees. Cancel anytime.
              Your first class is always complimentary.
            </p>
          </Reveal>
        </div>

        {/* Koriva Pricing Widget */}
        <Reveal delay={0.1}>
          <iframe
            src={src}
            title="Serenity Wellness Studio Pricing"
            className="koriva-widget-frame"
            style={{ height: `${iframeHeight}px` }}
            allow="clipboard-write"
            loading="lazy"
          />
        </Reveal>

        {/* Trust signals */}
        <Reveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {[
              '✓ Cancel anytime',
              '✓ First class free',
              '✓ No commitment',
              '✓ Pause your membership',
            ].map((item) => (
              <span
                key={item}
                className="font-body text-muted text-sm tracking-wide"
              >
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
