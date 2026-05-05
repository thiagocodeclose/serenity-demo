import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GlobalWidgets } from '@/components/GlobalWidgets';
import { JsonLd } from '@/components/JsonLd';
import { getKorivaConfig, buildCssVars } from '@/lib/koriva-config';
import { SiteDataProvider } from '@/components/SiteDataProvider';

import { KorivaLivePreview } from '@/components/KorivaLivePreview';
const heading = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://serenity-demo.vercel.app';

const DEFAULT_TITLE = 'Serenity Wellness Studio | Yoga, Pilates & Meditation · Austin, TX';
const DEFAULT_DESC = "Santa Monica's premier yoga, pilates & wellness studio. Drop-in classes, memberships & private sessions. 2,400+ members. 4.9★ on Google. First class free.";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getKorivaConfig();
  const title = config?.seo?.title || DEFAULT_TITLE;
  const description = config?.seo?.description || DEFAULT_DESC;
  const gymName = config?.gym?.name || 'Serenity Wellness Studio';
  return {
    metadataBase: new URL(BASE_URL),
    title: { default: title, template: `%s | ${gymName}` },
    description,
    keywords: [
      'yoga studio santa monica', 'pilates santa monica', 'yoga classes santa monica',
      'wellness studio los angeles', 'vinyasa flow santa monica', 'pilates reformer santa monica',
      'yin yoga los angeles', 'meditation classes santa monica', 'hot yoga santa monica',
      'barre classes santa monica', 'yoga studio near me', 'pilates near me',
    ],
    authors: [{ name: gymName, url: BASE_URL }],
    creator: gymName,
    publisher: gymName,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
    alternates: { canonical: BASE_URL },
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName: gymName,
      locale: 'en_US',
      type: 'website',
      images: [{
        url: config?.seo?.og_image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=630&fit=crop&q=85',
        width: 1200, height: 630,
        alt: `${gymName} — Yoga & Wellness Santa Monica`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [config?.seo?.og_image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=630&fit=crop&q=85'],
    },
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '' },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getKorivaConfig();
  const cssVars = buildCssVars(config?.brand);
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`} style={cssVars as React.CSSProperties}>
      <head>
        <JsonLd />
      </head>
      <body>
        <KorivaLivePreview />
        <SiteDataProvider config={config}>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <GlobalWidgets />
        </SiteDataProvider>
      </body>
    </html>
  );
}
