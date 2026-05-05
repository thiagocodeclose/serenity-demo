'use client';

import { Reveal } from '@/components/Reveal';
import Image from 'next/image';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=85&auto=format&fit=crop',
    alt: 'Yoga flow class',
    className: 'col-span-2 row-span-2',
    aspect: 'aspect-[4/3]',
  },
  {
    src: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=85&auto=format&fit=crop',
    alt: 'Mindful movement',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85&auto=format&fit=crop',
    alt: 'Meditation practice',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    src: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=900&q=85&auto=format&fit=crop',
    alt: 'Pilates reformer session',
    className: 'col-span-3 row-span-1',
    aspect: 'aspect-[21/9]',
  },
];

export function GallerySection() {
  return (
    <section id="studio" className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">The Space</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="font-heading text-ink"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Designed for Presence
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="font-body text-muted max-w-xs text-sm leading-relaxed">
              Every detail of our Santa Monica studio was chosen to quiet the mind
              before a single breath is drawn.
            </p>
          </Reveal>
        </div>

        {/* Asymmetric gallery grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {/* Large left image */}
          <Reveal delay={0} className="col-span-3 md:col-span-2 row-span-2">
            <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto md:h-full min-h-[300px]">
              <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </Reveal>

          {/* Two small right images */}
          <Reveal delay={0.1} className="col-span-3 md:col-span-1">
            <div className="relative overflow-hidden aspect-square">
              <Image
                src={images[1].src}
                alt={images[1].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="col-span-3 md:col-span-1">
            <div className="relative overflow-hidden aspect-square">
              <Image
                src={images[2].src}
                alt={images[2].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Reveal>

          {/* Full-width bottom image */}
          <Reveal delay={0.2} className="col-span-3">
            <div className="relative overflow-hidden" style={{ aspectRatio: '21/7' }}>
              <Image
                src={images[3].src}
                alt={images[3].alt}
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                sizes="100vw"
              />
              {/* Caption overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                <div className="pl-10 md:pl-16">
                  <p className="font-heading text-white italic"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                    "Built for your practice."
                  </p>
                  <p className="text-white/60 text-xs tracking-widest uppercase font-body mt-2">
                    1424 Fourth St · Santa Monica
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
