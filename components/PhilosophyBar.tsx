'use client';

import { useKorivaElement } from '@/hooks/useKorivaElement';
import { motion } from 'framer-motion';

export function PhilosophyBar() {
  const p1 = useKorivaElement('philbar_1', { content: 'Presence', visible: true }, { section: 'Philosophy Bar', label: 'Pillar 1', type: 'text' });
  const p2 = useKorivaElement('philbar_2', { content: 'Breath', visible: true }, { section: 'Philosophy Bar', label: 'Pillar 2', type: 'text' });
  const p3 = useKorivaElement('philbar_3', { content: 'Strength', visible: true }, { section: 'Philosophy Bar', label: 'Pillar 3', type: 'text' });
  const p4 = useKorivaElement('philbar_4', { content: 'Community', visible: true }, { section: 'Philosophy Bar', label: 'Pillar 4', type: 'text' });
  const p5 = useKorivaElement('philbar_5', { content: 'Balance', visible: true }, { section: 'Philosophy Bar', label: 'Pillar 5', type: 'text' });

  const pillars = [p1, p2, p3, p4, p5];

  return (
    <section className="bg-[var(--bg-dark)] py-5 overflow-hidden">
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-center gap-0">
          {pillars.map((pillar, i) => (
            <div key={i} className="flex items-center">
              <span
                {...pillar.editProps}
                className="font-heading text-white/90 italic px-6 md:px-10"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}
              >
                {pillar.content}
              </span>
              {i < pillars.length - 1 && (
                <span className="text-[var(--accent)] text-xs">◆</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
