// ─── Koriva integration ───────────────────────────────────────────────────────
export const koriva = {
  baseUrl: process.env.NEXT_PUBLIC_CODEGYM_URL || 'https://app.codegyms.com',
  gymSlug: process.env.NEXT_PUBLIC_GYM_SLUG || 'prana-studio',
  widgetKey: process.env.NEXT_PUBLIC_WIDGET_KEY || '',
};

// ─── Studio identity ──────────────────────────────────────────────────────────
export const studio = {
  name: 'Prana Studio',
  tagline: 'Where Breath Becomes Movement.',
  description:
    "Santa Monica's premier sanctuary for yoga, pilates, and mindful movement. Designed for those who seek transformation — body, mind, and spirit.",
  address: {
    street: '1424 Fourth Street',
    city: 'Santa Monica',
    state: 'CA',
    zip: '90401',
  },
  phone: '(310) 555-0192',
  email: 'hello@pranastudio.com',
  social: {
    instagram: 'https://instagram.com/pranastudio',
    facebook: 'https://facebook.com/pranastudio',
    youtube: 'https://youtube.com/@pranastudio',
  },
  hours: {
    'Mon–Fri': '6:00 AM – 9:00 PM',
    Saturday: '7:00 AM – 7:00 PM',
    Sunday: '8:00 AM – 6:00 PM',
  },
};

// ─── Instructors ─────────────────────────────────────────────────────────────
export const instructors = [
  {
    name: 'Maya Chen',
    role: 'Founder & Lead Instructor',
    specialty: 'Vinyasa Flow · Meditation',
    years: 14,
    bio: 'Maya trained in Mysore, India and has been guiding students through transformative practices for over a decade. Her classes weave breath, movement, and stillness into a seamless whole.',
    image:
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&q=85&auto=format&fit=crop',
    instagram: '#',
  },
  {
    name: 'Sofia Martinez',
    role: 'Senior Instructor',
    specialty: 'Pilates Reformer · Barre',
    years: 9,
    bio: 'A former professional dancer, Sofia brings precision and artistry to every session. Her pilates method focuses on functional strength and postural elegance.',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=85&auto=format&fit=crop',
    instagram: '#',
  },
  {
    name: 'James Park',
    role: 'Instructor',
    specialty: 'Yin Yoga · Breathwork',
    years: 7,
    bio: 'James specializes in the therapeutic side of yoga — slow, intentional, deeply restorative. His yin and breathwork sessions are consistently rated among the most transformative at Prana.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=85&auto=format&fit=crop',
    instagram: '#',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials = [
  {
    quote:
      "Walking into Prana Studio felt like coming home. After two weeks, my anxiety disappeared. After two months, I became someone I didn't know I could be.",
    name: 'Lauren K.',
    title: 'Member since 2023',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop&crop=face',
  },
  {
    quote:
      "I've tried every studio in Santa Monica. Nothing comes close. The instructors here don't just teach yoga — they teach you how to live.",
    name: 'Michael R.',
    title: 'Member since 2022',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face',
  },
  {
    quote:
      "Prana Studio changed my relationship with my own body. The space is stunning, the community is warm, and Maya's sunrise flow is pure magic.",
    name: 'Camille D.',
    title: 'Member since 2024',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop&crop=face',
  },
];

// ─── Gallery images ───────────────────────────────────────────────────────────
export const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=85&auto=format&fit=crop',
    alt: 'Yoga class in session',
    size: 'large',
  },
  {
    src: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=85&auto=format&fit=crop',
    alt: 'Morning flow class',
    size: 'medium',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85&auto=format&fit=crop',
    alt: 'Meditation session',
    size: 'medium',
  },
  {
    src: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=85&auto=format&fit=crop',
    alt: 'Studio interior',
    size: 'medium',
  },
  {
    src: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=900&q=85&auto=format&fit=crop',
    alt: 'Pilates reformer class',
    size: 'large',
  },
];
