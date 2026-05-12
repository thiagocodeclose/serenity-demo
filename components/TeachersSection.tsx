"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useKorivaElement } from "@/hooks/useKorivaElement";
import { instructors } from "@/lib/site-data";
import { useSiteData } from "@/components/SiteDataProvider";
import { Instagram } from "lucide-react";
import type { FeaturedTeacher, SiteContent } from "@/types/site-content";

function toFeaturedTeacher(i: (typeof instructors)[0]): FeaturedTeacher {
  return {
    id: i.name,
    name: i.name,
    role: i.role,
    specialty: i.specialty,
    years: i.years,
    bio: i.bio,
    image_url: i.image,
    instagram_url: i.instagram,
  };
}

const fallback: FeaturedTeacher[] = instructors.map(toFeaturedTeacher);

export function TeachersSection() {
  const siteData = useSiteData();
  const eyebrow = useKorivaElement('teachers_eyebrow', { content: 'The Guides', visible: true }, { section: 'Teachers', label: 'Eyebrow', type: 'eyebrow' });
  const headline = useKorivaElement('teachers_headline', { content: 'Meet Your Teachers', visible: true }, { section: 'Teachers', label: 'Headline', type: 'text' });
  const description = useKorivaElement('teachers_description', { content: 'Trained across the globe, our instructors bring depth, warmth, and decades of combined experience to every class.', visible: true }, { section: 'Teachers', label: 'Description', type: 'text' });

  const initial: FeaturedTeacher[] = siteData?.site_content?.featured_teachers
    ?.length
    ? siteData.site_content.featured_teachers
    : fallback;

  const [teachers, setTeachers] = useState<FeaturedTeacher[]>(initial);

  useEffect(() => {
    function handler(e: Event) {
      const content = (e as CustomEvent<SiteContent>).detail;
      if (content.featured_teachers?.length)
        setTeachers(content.featured_teachers);
    }
    window.addEventListener("koriva:content", handler);
    return () => window.removeEventListener("koriva:content", handler);
  }, []);

  return (
    <section
      id="teachers"
      className="section-padding"
      style={{ backgroundColor: "var(--bg-cream)" }}
    >
      <div className="container-tight">
        {/* Header */}
        <div className="mb-16">
          <Reveal>
            <p {...eyebrow.editProps} className="eyebrow mb-4">{eyebrow.content}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              {...headline.editProps}
              className="font-heading text-ink"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              {headline.content}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="divider divider-left mt-6" />
          </Reveal>
          <Reveal delay={0.2}>
            <p {...description.editProps} className="font-body text-muted max-w-md leading-relaxed mt-4">
              {description.content}
            </p>
          </Reveal>
        </div>

        {/* Instructors grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {teachers.slice(0, 6).map((t, i) => (
            <Reveal key={t.id} delay={0.1 * i}>
              <div className="group">
                {/* Photo — grayscale by default, color on hover */}
                <div className="relative overflow-hidden aspect-[3/4] mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image_url}
                    alt={t.name}
                    className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Years badge */}
                  {t.years && (
                    <div
                      className="absolute top-4 right-4 text-white text-xs tracking-widest uppercase font-body opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: "var(--primary)",
                        padding: "0.4rem 0.8rem",
                      }}
                    >
                      {t.years} yrs
                    </div>
                  )}

                  {/* Instagram hover */}
                  {t.instagram_url && (
                    <a
                      href={t.instagram_url}
                      className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      aria-label={`${t.name} on Instagram`}
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                </div>

                {/* Info */}
                <div>
                  <p className="eyebrow mb-2">{t.specialty}</p>
                  <h3
                    className="font-heading text-ink mb-1"
                    style={{ fontSize: "1.9rem" }}
                  >
                    {t.name}
                  </h3>
                  <p className="font-body text-muted text-sm mb-4">{t.role}</p>
                  <p className="font-body text-muted text-sm leading-relaxed">
                    {t.bio}
                  </p>
                  {t.instructor_slug && (
                    <a
                      href={`#appointment?instructor=${t.instructor_slug}`}
                      className="inline-flex items-center gap-1 mt-4 text-xs tracking-widest uppercase font-body transition-opacity hover:opacity-70"
                      style={{ color: "var(--primary)" }}
                    >
                      Book with {t.name.split(" ")[0]} →
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
