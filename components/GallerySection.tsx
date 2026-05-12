'use client';

import { Reveal } from '@/components/Reveal';
import { useKorivaElement } from '@/hooks/useKorivaElement';
import Image from 'next/image';


export function GallerySection() {
  const eyebrow = useKorivaElement('gallery_eyebrow', { content: 'The Space', visible: true }, { section: 'Gallery', label: 'Eyebrow', type: 'eyebrow' });
  const headline = useKorivaElement('gallery_headline', { content: 'Designed for Presence', visible: true }, { section: 'Gallery', label: 'Headline', type: 'text' });
  const description = useKorivaElement('gallery_description', { content: 'Every detail of our Santa Monica studio was chosen to quiet the mind before a single breath is drawn.', visible: true }, { section: 'Gallery', label: 'Description', type: 'text' });
  const img1 = useKorivaElement('gallery_image_1', { content: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=85&auto=format&fit=crop', visible: true }, { section: 'Gallery', label: 'Image 1 (large)', type: 'image' });
  const img2 = useKorivaElement('gallery_image_2', { content: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=85&auto=format&fit=crop', visible: true }, { section: 'Gallery', label: 'Image 2', type: 'image' });
  const img3 = useKorivaElement('gallery_image_3', { content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85&auto=format&fit=crop', visible: true }, { section: 'Gallery', label: 'Image 3', type: 'image' });
  const img4 = useKorivaElement('gallery_image_4', { content: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=900&q=85&auto=format&fit=crop', visible: true }, { section: 'Gallery', label: 'Image 4 (banner)', type: 'image' });
  const caption = useKorivaElement('gallery_caption', { content: '"Built for your practice."', visible: true }, { section: 'Gallery', label: 'Caption Quote', type: 'text' });
  const address = useKorivaElement('gallery_address', { content: '1424 Fourth St · Santa Monica', visible: true }, { section: 'Gallery', label: 'Address', type: 'text' });

  return (
    <section id="studio" className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
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
          </div>
          <Reveal delay={0.2}>
            <p {...description.editProps} className="font-body text-muted max-w-xs text-sm leading-relaxed">
              {description.content}
            </p>
          </Reveal>
        </div>

        {/* Asymmetric gallery grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Reveal delay={0} className="col-span-3 md:col-span-2 row-span-2">
            <div {...img1.editProps} className="relative overflow-hidden aspect-[4/3] md:aspect-auto md:h-full min-h-[300px]">
              <Image
                src={img1.content || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=85&auto=format&fit=crop'}
                alt="Yoga flow class"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          </Reveal>

          {/* Two small right images */}
          <Reveal delay={0.1} className="col-span-3 md:col-span-1">
            <div {...img2.editProps} className="relative overflow-hidden aspect-square">
              <Image
                src={img2.content || 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=85&auto=format&fit=crop'}
                alt="Mindful movement"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="col-span-3 md:col-span-1">
            <div {...img3.editProps} className="relative overflow-hidden aspect-square">
              <Image
                src={img3.content || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85&auto=format&fit=crop'}
                alt="Meditation practice"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Reveal>

          {/* Full-width bottom image */}
          <Reveal delay={0.2} className="col-span-3">
            <div {...img4.editProps} className="relative overflow-hidden" style={{ aspectRatio: '21/7' }}>
              <Image
                src={img4.content || 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=900&q=85&auto=format&fit=crop'}
                alt="Pilates reformer session"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                sizes="100vw"
              />
              {/* Caption overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                <div className="pl-10 md:pl-16">
                  <p {...caption.editProps} className="font-heading text-white italic"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                    {caption.content}
                  </p>
                  <p {...address.editProps} className="text-white/60 text-xs tracking-widest uppercase font-body mt-2">
                    {address.content}
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
