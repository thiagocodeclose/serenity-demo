import { studio } from '@/lib/site-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://prana-studio-demo.vercel.app';

export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // ── LocalBusiness / SportsActivityLocation ──────────────────────────
      {
        '@type': ['HealthClub', 'SportsActivityLocation', 'LocalBusiness'],
        '@id': `${BASE_URL}/#business`,
        name: studio.name,
        description:
          "Santa Monica's premier sanctuary for yoga, pilates, and mindful movement. Designed for those who seek transformation — body, mind, and spirit.",
        url: BASE_URL,
        telephone: studio.phone,
        email: studio.email,
        priceRange: '$$',
        image: [
          'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=630&fit=crop&q=85',
        ],
        logo: `${BASE_URL}/logo.png`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: studio.address.street,
          addressLocality: studio.address.city,
          addressRegion: studio.address.state,
          postalCode: studio.address.zip,
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 34.0194,
          longitude: -118.4912,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '06:00',
            closes: '21:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '07:00',
            closes: '19:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Sunday',
            opens: '08:00',
            closes: '18:00',
          },
        ],
        sameAs: [
          studio.social.instagram,
          studio.social.facebook,
          studio.social.youtube,
        ].filter(Boolean),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '312',
          bestRating: '5',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Classes & Memberships',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vinyasa Flow Yoga' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pilates Reformer' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Yin Yoga' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Breathwork & Meditation' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Barre' } },
          ],
        },
      },
      // ── WebSite ──────────────────────────────────────────────────────────
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: studio.name,
        description: 'Yoga, Pilates & Wellness Studio in Santa Monica, CA',
        publisher: { '@id': `${BASE_URL}/#business` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/classes?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
