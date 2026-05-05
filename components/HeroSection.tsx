// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useKorivaElement } from '@/hooks/useKorivaElement';
import { useSiteData } from '@/components/SiteDataProvider';

/**
 * SERENITY — Masonry Editorial Hero
 * Structure: Giant headline top + 3-column asymmetric image grid below
 * Reference: Alo Yoga editorial, Wanderlust festival aesthetic
 * Key difference from Prana: NO full-bleed background image.
 * Text is ABOVE the photography grid — editorial separation.
 */
export function HeroSection() {

  const [bookingIntegration, setBookingIntegration] = useState<{
    booking_enabled: boolean;
    booking_url: string;
  }>({ booking_enabled: false, booking_url: '#' });
  const siteData = typeof useSiteData === 'function' ? useSiteData() : null;

  const eyebrow = useKorivaElement('hero_eyebrow', { content: 'Yoga · Pilates · Mindful Movement', visible: true }, { section: 'Hero', label: 'Eyebrow', type: 'eyebrow' });
  const hl1 = useKorivaElement('hero_headline_1', { content: 'Stillness', visible: true }, { section: 'Hero', label: 'Headline', type: 'text' });
  const hl2 = useKorivaElement('hero_headline_2', { content: 'lives here.', visible: true }, { section: 'Hero', label: 'Tagline', type: 'text' });
  const subtitle = useKorivaElement('hero_subtitle', { content: "Santa Monica's premier sanctuary for yoga, pilates & breathwork.", visible: true }, { section: 'Hero', label: 'Description', type: 'text' });
  const cta1 = useKorivaElement('hero_cta_primary', { content: 'Book Free Class', visible: true }, { section: 'Hero', label: 'CTA Primary', type: 'button' });
  const cta2 = useKorivaElement('hero_cta_secondary', { content: 'View Schedule', visible: true }, { section: 'Hero', label: 'CTA Secondary', type: 'button' });
  const heroBg = useKorivaElement('hero_bg', { content: '', mediaType: 'image', visible: true }, { section: 'Hero', label: 'Main Image (Card 1)', type: 'image' });

  const img1 = heroBg.content || siteData?.hero_url || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80&auto=format&fit=crop&crop=top';
  const img2 = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=80&auto=format&fit=crop&crop=center';
  const img3 = 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=700&q=80&auto=format&fit=crop';

  useEffect(() => {
    function handleBrand(e: Event) {
      const d = (e as CustomEvent).detail as Record<string, unknown>;
      if (d.booking_enabled !== undefined || d.gym_slug !== undefined) {
        const slug = (d.gym_slug as string) || '';
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.codegyms.com';
        setBookingIntegration({
          booking_enabled: !!(d.booking_enabled),
          booking_url: slug ? `${baseUrl}/schedule/${slug}` : '#',
        });
      }
    }
    window.addEventListener('koriva:brand', handleBrand);
    return () => window.removeEventListener('koriva:brand', handleBrand);
  }, []);
  return (
    <section style={{ backgroundColor: 'var(--cg-bg, #FAF9F6)', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* ── Editorial header: giant headline left + subtitle/CTA right ─── */}
      <div style={{ paddingTop: '130px', paddingBottom: '36px', paddingLeft: '6vw', paddingRight: '6vw', display: 'grid', gridTemplateColumns: '1fr 280px', alignItems: 'end', gap: '3rem' }}>

        <div>
          {eyebrow.visible && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cg-primary, #8B7355)', marginBottom: '20px', fontFamily: 'var(--font-body)' }}>
              {eyebrow.content}
            </motion.p>
          )}
          <div style={{ overflow: 'hidden' }}>
            <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3.8rem, 10vw, 9.5rem)', lineHeight: 0.92, fontWeight: 300, color: 'var(--cg-text, #2C2C2C)', letterSpacing: '-0.025em', margin: 0 }}>
              {hl1.content}
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3.8rem, 10vw, 9.5rem)', lineHeight: 0.92, fontWeight: 300, fontStyle: 'italic', color: 'var(--cg-primary, #8B7355)', letterSpacing: '-0.025em', margin: 0 }}>
              {hl2.content}
            </motion.h1>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--cg-text, #2C2C2C)', opacity: 0.65, fontFamily: 'var(--font-body)', margin: 0 }}>
            {subtitle.content}
          </p>
          <Link href="{bookingIntegration.booking_enabled ? bookingIntegration.booking_url : \'#classes\'}" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'var(--cg-primary, #8B7355)', color: '#fff', borderRadius: '4px', fontSize: '11.5px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-body)', width: 'fit-content' }}>
            {cta1.content} <ArrowRight size={13} />
          </Link>
          <Link href="{bookingIntegration.booking_enabled ? bookingIntegration.booking_url : \'#classes\'}" style={{ fontSize: '12px', color: 'var(--cg-text, #2C2C2C)', opacity: 0.5, textDecoration: 'underline', textUnderlineOffset: '4px', fontFamily: 'var(--font-body)', width: 'fit-content' }}>
            {cta2.content}
          </Link>
        </motion.div>
      </div>

      {/* ── Masonry image grid ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.85fr', gap: '10px', paddingLeft: '6vw', paddingRight: '6vw', paddingBottom: '6vh', minHeight: '46vh', maxHeight: '52vh' }}>

        {/* Card 1 — tall portrait */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px' }}>
          <img src={img1} alt="Yoga practice" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
        </div>

        {/* Card 2 — middle with stats pill */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px' }}>
          <img src={img2} alt="Studio ambiance" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px', background: 'rgba(250,249,246,0.90)', backdropFilter: 'blur(14px)', borderRadius: '999px', padding: '9px 16px', display: 'flex', gap: '16px', alignItems: 'center', fontSize: '12px', fontFamily: 'var(--font-body)' }}>
            <span style={{ color: 'var(--cg-primary, #8B7355)', fontWeight: 600 }}>★ 4.9</span>
            <span style={{ color: 'var(--cg-text, #2C2C2C)', opacity: 0.65 }}>2,400+ members</span>
            <span style={{ color: 'var(--cg-text, #2C2C2C)', opacity: 0.55, marginLeft: 'auto' }}>12 classes/wk</span>
          </div>
        </div>

        {/* Card 3 — image top + colored promo card bottom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '14px', minHeight: 0 }}>
            <img src={img3} alt="Mindful movement" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ background: 'var(--cg-primary, #8B7355)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, height: '120px' }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', margin: 0 }}>First class</p>
            <p style={{ color: '#fff', fontSize: '22px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.15, fontFamily: 'var(--font-heading)', margin: 0 }}>Always free.</p>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
