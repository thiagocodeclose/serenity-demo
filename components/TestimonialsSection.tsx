'use client';

import { Reveal } from '@/components/Reveal';
import { useKorivaElement } from '@/hooks/useKorivaElement';
import { testimonials } from '@/lib/site-data';
import Image from 'next/image';

export function TestimonialsSection() {
  const eyebrow = useKorivaElement('testimonials_eyebrow', { content: 'Stories', visible: true }, { section: 'Testimonials', label: 'Eyebrow', type: 'eyebrow' });
  const headline = useKorivaElement('testimonials_headline', { content: 'Life Transformed', visible: true }, { section: 'Testimonials', label: 'Headline', type: 'text' });
  const ctaCopy = useKorivaElement('testimonials_cta_copy', { content: 'Join 2,400+ members transforming their practice', visible: true }, { section: 'Testimonials', label: 'CTA Copy', type: 'text' });
  const ctaTagline = useKorivaElement('testimonials_cta_tagline', { content: 'Your story starts with one class.', visible: true }, { section: 'Testimonials', label: 'CTA Tagline', type: 'text' });

  return (
    <section className="section-padding overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-20">
          <Reveal>
            <p {...eyebrow.editProps} className="eyebrow mb-4">{eyebrow.content}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              {...headline.editProps}
              className="font-heading text-ink"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {headline.content}
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
            <p {...ctaCopy.editProps} className="font-body text-muted text-sm mb-2">
              {ctaCopy.content}
            </p>
            <p {...ctaTagline.editProps} className="font-heading text-ink italic" style={{ fontSize: '2rem' }}>
              {ctaTagline.content}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
