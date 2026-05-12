'use client';

import { Reveal } from '@/components/Reveal';
import { useKorivaElement } from '@/hooks/useKorivaElement';

export function ManifestoSection() {
  const eyebrow = useKorivaElement('manifesto_eyebrow', { content: 'Our Philosophy', visible: true }, { section: 'Manifesto', label: 'Eyebrow', type: 'eyebrow' });
  const quote = useKorivaElement('manifesto_quote', { content: '"We believe movement is medicine.\nThat stillness is strength.\nThat your practice begins\nthe moment you decide to begin."', visible: true }, { section: 'Manifesto', label: 'Quote', type: 'text' });
  const attribution = useKorivaElement('manifesto_attribution', { content: '— Serenity Wellness Studio · Austin', visible: true }, { section: 'Manifesto', label: 'Attribution', type: 'text' });
  const p1Title = useKorivaElement('manifesto_pillar1_title', { content: 'The Body', visible: true }, { section: 'Manifesto', label: 'Pillar 1 Title', type: 'text' });
  const p1Text = useKorivaElement('manifesto_pillar1_text', { content: 'Strength, flexibility, and functional movement built through consistent, intentional practice.', visible: true }, { section: 'Manifesto', label: 'Pillar 1 Text', type: 'text' });
  const p2Title = useKorivaElement('manifesto_pillar2_title', { content: 'The Mind', visible: true }, { section: 'Manifesto', label: 'Pillar 2 Title', type: 'text' });
  const p2Text = useKorivaElement('manifesto_pillar2_text', { content: 'Breathwork and meditation woven into every class to cultivate attention and resilience.', visible: true }, { section: 'Manifesto', label: 'Pillar 2 Text', type: 'text' });
  const p3Title = useKorivaElement('manifesto_pillar3_title', { content: 'The Community', visible: true }, { section: 'Manifesto', label: 'Pillar 3 Title', type: 'text' });
  const p3Text = useKorivaElement('manifesto_pillar3_text', { content: 'A sanctuary of warmth and belonging where every student is seen, held, and celebrated.', visible: true }, { section: 'Manifesto', label: 'Pillar 3 Text', type: 'text' });
  const bgImage = useKorivaElement('manifesto_bg_image', { content: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1920&q=80&auto=format&fit=crop', visible: true }, { section: 'Manifesto', label: 'Background Image', type: 'image' });

  return (
    <section
      className="relative overflow-hidden grain"
      style={{ backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Background image */}
      <div
        {...bgImage.editProps}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImage.content})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
        }}
      />

      <div className="relative z-10 py-32 md:py-48">
        <div className="container-tight text-center">
          <Reveal>
            <div className="mx-auto mb-12" style={{ width: 1, height: 80, backgroundColor: 'var(--accent)', opacity: 0.6 }} />
          </Reveal>

          {eyebrow.visible && (
            <Reveal delay={0.1}>
              <p {...eyebrow.editProps} className="eyebrow text-[var(--accent)] mb-8">{eyebrow.content}</p>
            </Reveal>
          )}

          {quote.visible && (
            <Reveal delay={0.2}>
              <blockquote
                {...quote.editProps}
                className="font-heading text-white italic leading-snug"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)', whiteSpace: 'pre-line' }}
              >
                {quote.content}
              </blockquote>
            </Reveal>
          )}

          <Reveal delay={0.35}>
            <div className="mx-auto mt-12 mb-10" style={{ width: 48, height: 1, backgroundColor: 'var(--accent)', opacity: 0.5 }} />
          </Reveal>

          {attribution.visible && (
            <Reveal delay={0.4}>
              <p {...attribution.editProps} className="font-body text-white/50 text-sm tracking-[0.2em] uppercase">{attribution.content}</p>
            </Reveal>
          )}

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-24 border-t border-white/10">
            {[
              { icon: '◉', titleEl: p1Title, textEl: p1Text },
              { icon: '◎', titleEl: p2Title, textEl: p2Text },
              { icon: '○', titleEl: p3Title, textEl: p3Text },
            ].map((pillar, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-white/10 last:border-0 text-center">
                  <div className="text-3xl mb-6" style={{ color: 'var(--accent)' }}>{pillar.icon}</div>
                  <h3 {...pillar.titleEl.editProps} className="font-heading text-white mb-4" style={{ fontSize: '1.8rem' }}>{pillar.titleEl.content}</h3>
                  <p {...pillar.textEl.editProps} className="font-body text-white/50 text-sm leading-relaxed">{pillar.textEl.content}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

