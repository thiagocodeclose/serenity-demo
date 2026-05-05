'use client';

import { Reveal } from '@/components/Reveal';
import { koriva } from '@/lib/site-data';
import { useEffect, useRef, useState } from 'react';

export function CTASection() {
  const [iframeHeight, setIframeHeight] = useState(320);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== koriva.baseUrl) return;
      const d = e.data;
      if (d?.source === 'codegym-widget' && d?.type === 'widget:resize' && d?.widget === 'lead') {
        setIframeHeight(d.payload.height + 24);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const src = `${koriva.baseUrl}/widgets/lead/${koriva.gymSlug}?embed=1&cg_primary=8B7355&cg_bg=1A1714&cg_text=FAF8F5&cg_radius=4&cg_mode=dark`;

  return (
    <section
      id="contact"
      className="relative overflow-hidden grain"
      style={{ backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=70&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }}
      />

      <div className="relative z-10 py-32 md:py-44">
        <div className="container-tight text-center">
          {/* Headline */}
          <Reveal>
            <p className="eyebrow text-[var(--accent)] mb-6">Start Today</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="font-heading text-white mb-6"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 1.0 }}
            >
              Begin Your <em>Practice</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div
              className="mx-auto mb-10"
              style={{ width: 48, height: 1, backgroundColor: 'var(--accent)', opacity: 0.5 }}
            />
          </Reveal>
          <Reveal delay={0.25}>
            <p className="font-body text-white/60 max-w-md mx-auto text-base leading-relaxed mb-14">
              Claim your complimentary first class. No credit card required.
              One of our team will reach out to welcome you personally.
            </p>
          </Reveal>

          {/* Lead capture widget */}
          <Reveal delay={0.3}>
            <div className="max-w-lg mx-auto">
              <iframe
                src={src}
                title="Join Serenity Wellness Studio"
                className="koriva-widget-frame"
                style={{ height: `${iframeHeight}px` }}
                allow="clipboard-write"
                loading="lazy"
              />
            </div>
          </Reveal>

          {/* Trust micro-copy */}
          <Reveal delay={0.35}>
            <p className="font-body text-white/30 text-xs mt-8 tracking-wide">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
