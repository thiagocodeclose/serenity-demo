'use client';

import { motion } from 'framer-motion';

const pillars = ['Presence', 'Breath', 'Strength', 'Community', 'Balance'];

export function PhilosophyBar() {
  return (
    <section className="bg-[var(--bg-dark)] py-5 overflow-hidden">
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-center gap-0">
          {pillars.map((pillar, i) => (
            <div key={pillar} className="flex items-center">
              <span
                className="font-heading text-white/90 italic px-6 md:px-10"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}
              >
                {pillar}
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
