'use client';

import { Reveal } from '@/components/Reveal';
import { instructors } from '@/lib/site-data';
import { Instagram } from 'lucide-react';
import Image from 'next/image';

export function TeachersSection() {
  return (
    <section id="teachers" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container-tight">
        {/* Header */}
        <div className="mb-16">
          <Reveal>
            <p className="eyebrow mb-4">The Guides</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="font-heading text-ink"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Meet Your Teachers
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="divider divider-left mt-6" />
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-body text-muted max-w-md leading-relaxed mt-4">
              Trained across the globe, our instructors bring depth, warmth, and
              decades of combined experience to every class.
            </p>
          </Reveal>
        </div>

        {/* Instructors grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {instructors.map((instructor, i) => (
            <Reveal key={instructor.name} delay={0.1 * i}>
              <div className="group">
                {/* Photo — grayscale by default, color on hover */}
                <div className="relative overflow-hidden aspect-[3/4] mb-6">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Years badge */}
                  <div
                    className="absolute top-4 right-4 text-white text-xs tracking-widest uppercase font-body opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'var(--primary)', padding: '0.4rem 0.8rem' }}
                  >
                    {instructor.years} yrs
                  </div>

                  {/* Instagram hover */}
                  <a
                    href={instructor.instagram}
                    className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <Instagram size={18} />
                  </a>
                </div>

                {/* Info */}
                <div>
                  <p className="eyebrow mb-2">{instructor.specialty}</p>
                  <h3
                    className="font-heading text-ink mb-1"
                    style={{ fontSize: '1.9rem' }}
                  >
                    {instructor.name}
                  </h3>
                  <p className="font-body text-muted text-sm mb-4">{instructor.role}</p>
                  <p className="font-body text-muted text-sm leading-relaxed">{instructor.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
