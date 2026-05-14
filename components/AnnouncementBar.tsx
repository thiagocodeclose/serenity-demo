'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useSiteData } from '@/components/SiteDataProvider';

export function AnnouncementBar() {
  const siteData = useSiteData();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');

  // Initialize from SSR config (production — koriva:brand event never fires here)
  useEffect(() => {
    const gym = siteData?.gym;
    if (gym?.announcement_enabled && gym?.announcement_text) {
      setText(gym.announcement_text);
      setUrl(gym.announcement_url || '');
      setBgColor(gym.announcement_bg_color || '');
      setTextColor(gym.announcement_text_color || '');
      setVisible(true);
    }
  }, [siteData]);

  // Update CSS variable so the fixed header offsets below the bar
  useEffect(() => {
    document.documentElement.style.setProperty('--bar-h', visible ? '40px' : '0px');
    return () => { document.documentElement.style.setProperty('--bar-h', '0px'); };
  }, [visible]);

  // Listen for live-preview updates (koriva:brand event from admin builder)
  useEffect(() => {
    function handler(e: Event) {
      const d = (e as CustomEvent).detail as Record<string, unknown>;
      if (d.announcement_text !== undefined) setText(d.announcement_text as string);
      if (d.announcement_url !== undefined) setUrl(d.announcement_url as string);
      if (d.announcement_bg_color !== undefined) setBgColor(d.announcement_bg_color as string);
      if (d.announcement_text_color !== undefined) setTextColor(d.announcement_text_color as string);
      if (d.announcement_enabled !== undefined) {
        const enabled = !!(d.announcement_enabled);
        setVisible(enabled && !!(d.announcement_text || text));
      }
    }
    window.addEventListener('koriva:brand', handler);
    return () => window.removeEventListener('koriva:brand', handler);
  }, [text]);

  if (!visible || !text) return null;

  return (
    <div
      role="banner"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: '40px',
        backgroundColor: bgColor || 'var(--primary, #8B7355)',
        color: textColor || '#fff',
      }}
      className="flex items-center justify-center px-10"
    >
      <p
        className="font-body text-center"
        style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}
      >
        {text}
        {url && (
          <a
            href={url}
            className="ml-3 underline underline-offset-2 opacity-90 hover:opacity-100 transition-opacity"
            style={{ fontWeight: 700 }}
          >
            Learn more →
          </a>
        )}
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X size={13} />
      </button>
    </div>
  );
}
