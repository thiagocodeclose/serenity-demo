'use client';

import { Reveal } from '@/components/Reveal';

const press = [
  { name: 'Well+Good', tag: 'Best Yoga Studios in LA' },
  { name: 'Vogue', tag: 'Wellness Edit 2024' },
  { name: 'Los Angeles Times', tag: 'Where LA Breathes' },
  { name: 'mindbodygreen', tag: 'Top Studio Award' },
  { name: 'Yoga Journal', tag: 'Community Favorite' },
];

export function PressSection() {
  return (
    <section className="py-20 border-y border-[var(--border)]" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container-wide">
        <Reveal>
          <p className="eyebrow text-center mb-12">As Seen In</p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[var(--border)]">
          {press.map((p, i) => (
            <Reveal key={p.name} delay={0.05 * i}>
              <div className="flex flex-col items-center justify-center gap-2 bg-[var(--bg-cream)] py-10 px-6 text-center group hover:bg-[var(--bg)] transition-colors duration-300">
                <span
                  className="font-heading text-muted group-hover:text-ink transition-colors duration-300"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}
                >
                  {p.name}
                </span>
                <span className="font-body text-xs text-muted/60 tracking-wide">
                  {p.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
