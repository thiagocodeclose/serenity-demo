'use client';

import { Reveal } from '@/components/Reveal';

export function ManifestoSection() {
  return (
    <section
      className="relative overflow-hidden grain"
      style={{ backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1920&q=80&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
        }}
      />

      <div className="relative z-10 py-32 md:py-48">
        <div className="container-tight text-center">
          {/* Decorative line */}
          <Reveal>
            <div
              className="mx-auto mb-12"
              style={{
                width: 1,
                height: 80,
                backgroundColor: 'var(--accent)',
                opacity: 0.6,
              }}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow text-[var(--accent)] mb-8">Our Philosophy</p>
          </Reveal>

          <Reveal delay={0.2}>
            <blockquote
              className="font-heading text-white italic leading-snug"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)' }}
            >
              "We believe movement is medicine.
              <br />
              That stillness is strength.
              <br />
              That your practice begins
              <br />
              the moment you decide to begin."
            </blockquote>
          </Reveal>

          <Reveal delay={0.35}>
            <div
              className="mx-auto mt-12 mb-10"
              style={{
                width: 48,
                height: 1,
                backgroundColor: 'var(--accent)',
                opacity: 0.5,
              }}
            />
          </Reveal>

          <Reveal delay={0.4}>
            <p className="font-body text-white/50 text-sm tracking-[0.2em] uppercase">
              — Prana Studio · Santa Monica
            </p>
          </Reveal>

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-24 border-t border-white/10">
            {[
              {
                icon: '◉',
                title: 'The Body',
                text: 'Strength, flexibility, and functional movement built through consistent, intentional practice.',
              },
              {
                icon: '◎',
                title: 'The Mind',
                text: 'Breathwork and meditation woven into every class to cultivate attention and resilience.',
              },
              {
                icon: '○',
                title: 'The Community',
                text: 'A sanctuary of warmth and belonging where every student is seen, held, and celebrated.',
              },
            ].map((pillar, i) => (
              <Reveal key={pillar.title} delay={0.1 * i}>
                <div
                  className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-white/10 last:border-0 text-center"
                >
                  <div
                    className="text-3xl mb-6"
                    style={{ color: 'var(--accent)' }}
                  >
                    {pillar.icon}
                  </div>
                  <h3
                    className="font-heading text-white mb-4"
                    style={{ fontSize: '1.8rem' }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="font-body text-white/50 text-sm leading-relaxed">
                    {pillar.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
