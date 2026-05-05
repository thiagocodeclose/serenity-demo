'use client';

import { Reveal } from '@/components/Reveal';
import { testimonials } from '@/lib/site-data';
import Image from 'next/image';

export function TestimonialsSection() {
  return (
    <section className="section-padding overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-20">
          <Reveal>
            <p className="eyebrow mb-4">Stories</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="font-heading text-ink"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Life Transformed
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="divider" />
          </Reveal>
        </div>

        {/* Large pull quotes */}
        <div className="space-y-0">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={0.1 * i}>
              <div
                className={`flex flex-col md:flex-row items-start gap-8 md:gap-16 py-14 border-t border-[var(--border)] ${
                  i % 2 === 1 ? 'md:flex-row-reverse text-right' : ''
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover grayscale"
                      sizes="80px"
                    />
                  </div>
                </div>

                {/* Quote */}
                <div className="flex-1">
                  <div
                    className="font-heading text-[var(--primary)] leading-none mb-4 select-none"
                    style={{ fontSize: '5rem', lineHeight: 0.7 }}
                    aria-hidden
                  >
                    "
                  </div>
                  <blockquote
                    className="font-heading text-ink italic mb-6"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.3rem)', lineHeight: 1.25 }}
                  >
                    {t.quote}
                  </blockquote>
                  <div>
                    <p className="font-body text-ink font-medium text-sm">{t.name}</p>
                    <p className="font-body text-muted text-xs tracking-wide mt-1">{t.title}</p>
                    <div className="flex gap-0.5 mt-2 text-[var(--primary)]" style={{ fontSize: '0.7rem' }}>
                      {'★★★★★'.split('').map((s, j) => <span key={j}>{s}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="border-t border-[var(--border)] pt-14 text-center">
            <p className="font-body text-muted text-sm mb-2">
              Join 2,400+ members transforming their practice
            </p>
            <p className="font-heading text-ink italic" style={{ fontSize: '2rem' }}>
              Your story starts with one class.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
