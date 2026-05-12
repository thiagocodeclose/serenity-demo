// types/site-content.ts
// Shared TypeScript interfaces for the site_content JSONB column in gym_sites.
// This schema is UNIVERSAL across all 40 templates — template-specific render
// logic reads from these interfaces but the data shape never changes.
// Mirror file: codegym_bolt/types/site-content.ts (keep in sync)

export interface FeaturedTeacher {
  id: string;
  name: string;
  role: string;
  specialty: string;
  years?: number;
  bio: string;
  image_url: string;
  instagram_url?: string;
  /** If set, enables a "Book with [name] →" CTA that opens the appointment widget */
  instructor_slug?: string;
  order?: number;
}

export interface TeacherSectionConfig {
  headline?: string;
  subtext?: string;
  layout?: "cards" | "list" | "editorial";
  card_style?: "minimal" | "full" | "cinematic";
  max_visible?: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  image_url?: string;
  rating?: number;
  order?: number;
}

export interface TestimonialSectionConfig {
  headline?: string;
  layout?: "carousel" | "grid" | "masonry";
  show_rating?: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  order?: number;
}

export interface GallerySectionConfig {
  layout?: "grid-4" | "grid-3" | "mosaic" | "full-bleed";
  headline?: string;
}

export interface PressItem {
  id: string;
  publication: string;
  quote: string;
  url?: string;
  logo_url?: string;
  date?: string;
}

export interface ManifestoContent {
  tagline?: string;
  paragraphs?: string[];
  pull_quote?: string;
  pillars?: Array<{ icon: string; title: string; text: string }>;
}

export interface AnnouncementConfig {
  text: string;
  cta_label?: string;
  cta_url?: string;
  bg_color?: string;
  text_color?: string;
  dismissible?: boolean;
  active: boolean;
}

export interface SiteContent {
  featured_teachers?: FeaturedTeacher[];
  teacher_section?: TeacherSectionConfig;
  testimonials?: Testimonial[];
  testimonial_section?: TestimonialSectionConfig;
  gallery?: GalleryImage[];
  gallery_section?: GallerySectionConfig;
  press?: PressItem[];
  manifesto?: ManifestoContent;
  announcement?: AnnouncementConfig;
}
