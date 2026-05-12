// @ts-nocheck
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { koriva } from '@/lib/site-data';

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  image_alt: string;
  overlay_opacity: number;
  title_color: string;
  subtitle_color: string;
  text_position: string;
  badge_text: string | null;
  badge_color: string;
  badge_text_color: string;
  cta_text: string | null;
  cta_url: string | null;
  cta_action: string;
  cta_style: string;
  cta_color: string;
  cta_text_color: string;
}

function getTextPosition(pos: string): React.CSSProperties {
  const [v, h] = pos.split('-');
  const style: React.CSSProperties = {
    position: 'absolute',
    zIndex: 4,
    maxWidth: '55%',
    padding: '0 6%',
  };
  if (v === 'top') style.top = '12%';
  else if (v === 'bottom') style.bottom = '14%';
  else { style.top = '50%'; style.transform = 'translateY(-50%)'; }
  if (h === 'left') style.left = 0;
  else if (h === 'right') { style.right = 0; style.textAlign = 'right'; }
  else {
    style.left = '50%';
    style.transform = (style.transform || '') + ' translateX(-50%)';
    style.textAlign = 'center';
    style.maxWidth = '70%';
  }
  return style;
}

export function PromoBannersSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [banners, setBanners] = useState<Banner[]>([]);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [gymSlug, setGymSlug] = useState(koriva.gymSlug);
  const [base, setBase] = useState(koriva.baseUrl);

  // Listen to koriva:brand for dynamic slug
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
    fetch(`${base}/api/public/promo-banners?slug=${gymSlug}`)
      .then((r) => r.json())
      .then((d) => { if (d?.banners?.length) setBanners(d.banners); })
      .catch(() => {});
  }, [gymSlug, base]);

  // Auto-advance
  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    if (banners.length > 1) {
      timerRef.current = setTimeout(() => setActive((a) => (a + 1) % banners.length), 5000);
    }
  }, [banners.length]);

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timerRef.current);
  }, [active, resetTimer]);

  const go = (idx: number) => { setActive((idx + banners.length) % banners.length); };

  if (!banners.length) return null;

  const banner = banners[active];
  // Serenity palette defaults
  const primaryColor = '#8B7355';

  return (
    <section ref={ref} style={{ padding: '2vh 0 0', background: 'var(--bg, #FAF9F6)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 6vw' }}
      >
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--primary, #8B7355)',
            marginBottom: '10px',
            fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
          }}
        >
          Special Offers
        </p>
      </motion.div>

      {/* Banner */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(260px, 40vw, 480px)', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {banner.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={banner.image_url}
                alt={banner.image_alt || ''}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${banner.overlay_opacity ?? 0.45})`, zIndex: 2 }} />

            <div style={getTextPosition(banner.text_position || 'center-left')}>
              {banner.badge_text && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: banner.badge_color || primaryColor,
                    color: banner.badge_text_color || '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
                    marginBottom: '12px',
                  }}
                >
                  {banner.badge_text}
                </span>
              )}
              {banner.title && (
                <h3
                  style={{
                    fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
                    fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                    fontWeight: 300,
                    color: banner.title_color || '#fff',
                    margin: '0 0 10px',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {banner.title}
                </h3>
              )}
              {banner.subtitle && (
                <p
                  style={{
                    fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
                    fontSize: 'clamp(13px, 1.5vw, 16px)',
                    color: banner.subtitle_color || 'rgba(255,255,255,0.85)',
                    margin: '0 0 20px',
                    lineHeight: 1.6,
                  }}
                >
                  {banner.subtitle}
                </p>
              )}
              {banner.cta_text && (
                <a
                  href={banner.cta_url || '#'}
                  onClick={(e) => {
                    if (banner.cta_action === 'scroll' && banner.cta_url?.startsWith('#')) {
                      e.preventDefault();
                      document.querySelector(banner.cta_url)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  style={{
                    display: 'inline-block',
                    padding: banner.cta_style === 'pill' ? '12px 28px' : '11px 24px',
                    borderRadius:
                      banner.cta_style === 'pill'
                        ? '40px'
                        : banner.cta_style === 'square'
                        ? '0px'
                        : '2px',
                    background:
                      banner.cta_style === 'outlined' ? 'transparent' : banner.cta_color || primaryColor,
                    border:
                      banner.cta_style === 'outlined'
                        ? `2px solid ${banner.cta_color || '#fff'}`
                        : 'none',
                    color: banner.cta_text_color || '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {banner.cta_text}
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => go(active - 1)}
              aria-label="Previous banner"
              style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(4px)', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronLeft size={18} color="#fff" />
            </button>
            <button
              onClick={() => go(active + 1)}
              aria-label="Next banner"
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(4px)', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronRight size={18} color="#fff" />
            </button>
          </>
        )}

        {/* Dots */}
        {banners.length > 1 && (
          <div
            style={{
              position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', zIndex: 10,
            }}
          >
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Banner ${i + 1}`}
                style={{
                  width: active === i ? '24px' : '8px', height: '8px', borderRadius: '4px',
                  border: 'none', padding: 0,
                  background: active === i ? 'var(--primary, #8B7355)' : 'rgba(139,115,85,0.35)',
                  cursor: 'pointer', transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
