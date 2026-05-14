"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { studio } from "@/lib/site-data";
import { useSiteData } from "@/components/SiteDataProvider";

// ── Address + hours helpers ──────────────────────────────────────────────────
function parseGymAddress(ga?: string) {
  if (!ga || !ga.trim()) return null;
  const parts = ga.split(", ");
  if (parts.length < 2) return { street: ga, cityLine: "" };
  return { street: parts[0], cityLine: parts.slice(1).join(", ") };
}

type DayHours = { open: string; close: string; closed: boolean };

function fmt12(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const p = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return m === 0
    ? `${h12}:00 ${p}`
    : `${h12}:${String(m).padStart(2, "0")} ${p}`;
}

function buildHoursDisplay(
  gymHours: Record<string, DayHours>,
): Array<{ label: string; hours: string }> {
  const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const SHORT: Record<string, string> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  };
  const result: Array<{ label: string; hours: string }> = [];
  let i = 0;
  while (i < DAYS.length) {
    const d = DAYS[i];
    const h = gymHours[d];
    if (!h || h.closed) {
      i++;
      continue;
    }
    const hStr = `${fmt12(h.open)} – ${fmt12(h.close)}`;
    let j = i + 1;
    while (j < DAYS.length) {
      const nh = gymHours[DAYS[j]];
      if (!nh || nh.closed || nh.open !== h.open || nh.close !== h.close) break;
      j++;
    }
    const label = i === j - 1 ? SHORT[d] : `${SHORT[d]}–${SHORT[DAYS[j - 1]]}`;
    result.push({ label, hours: hStr });
    i = j;
  }
  return result;
}

export function Footer() {
  const [integrations, setIntegrations] = useState({
    booking_enabled: false,
    portal_enabled: false,
    booking_url: "#",
    portal_url: "#",
  });

  const siteData = useSiteData();
  const si = siteData?.studioInfo;
  const gymName =
    si?.name?.toUpperCase() ||
    siteData?.gym?.name?.toUpperCase() ||
    "SERENITY WELLNESS";
  const instagram =
    siteData?.brand?.instagram_url ||
    siteData?.gym?.instagram ||
    studio.social.instagram;
  const facebook =
    siteData?.brand?.facebook_url ||
    siteData?.gym?.facebook ||
    studio.social.facebook;
  const currentYear = new Date().getFullYear();

  // Address from studioInfo (same source as Forma template)
  const hasLiveAddr = !!(si?.address || si?.city);
  // Hours from studioInfo.operating_hours
  const liveHours = si?.operating_hours
    ? buildHoursDisplay(si.operating_hours)
    : null;
  const tagline = siteData?.brand?.tagline || studio.tagline;

  useEffect(() => {
    function handleBrandIntegrations(e: Event) {
      const d = (e as CustomEvent).detail as Record<string, unknown>;
      const slug = (d.gym_slug as string) || "";
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://app.codegyms.com";
      setIntegrations((prev) => ({
        booking_enabled:
          d.booking_enabled !== undefined
            ? !!d.booking_enabled
            : prev.booking_enabled,
        portal_enabled:
          d.portal_enabled !== undefined
            ? !!d.portal_enabled
            : prev.portal_enabled,
        booking_url: slug ? `${baseUrl}/schedule/${slug}` : prev.booking_url,
        portal_url:
          (d.portal_url as string) ||
          (slug ? `${baseUrl}/member-login/${slug}` : prev.portal_url),
      }));
    }
    window.addEventListener("koriva:brand", handleBrandIntegrations);
    return () =>
      window.removeEventListener("koriva:brand", handleBrandIntegrations);
  }, []);

  return (
    <footer style={{ backgroundColor: "var(--bg-dark)" }}>
      {/* Main footer content */}
      <div className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/">
              <span
                className="font-heading text-white tracking-wider"
                style={{ fontSize: "1.5rem" }}
              >
                {gymName}
              </span>
            </Link>
            <p className="font-body text-white/40 text-sm leading-relaxed mt-4 max-w-xs">
              {tagline}
            </p>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              {instagram && (
                <a
                  href={instagram}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
              {studio.social.youtube && (
                <a
                  href={studio.social.youtube}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-body text-white text-xs tracking-widest uppercase mb-6">
              Explore
            </p>
            <ul className="space-y-3">
              {[
                { label: "Classes", href: "#classes" },
                { label: "Teachers", href: "#teachers" },
                { label: "Studio", href: "#studio" },
                { label: "Membership", href: "#pricing" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-white/40 hover:text-white/80 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <p className="font-body text-white text-xs tracking-widest uppercase mb-6">
              Visit Us
            </p>
            <address className="not-italic space-y-3">
              <p className="font-body text-white/40 text-sm leading-relaxed">
                {hasLiveAddr ? (
                  <>
                    {si?.address}
                    <br />
                    {si?.city}, {si?.state} {si?.zip}
                  </>
                ) : (
                  <>
                    {studio.address.street}
                    <br />
                    {studio.address.city}, {studio.address.state}{" "}
                    {studio.address.zip}
                  </>
                )}
              </p>
              <div className="space-y-2 pt-2">
                {(liveHours
                  ? liveHours
                  : Object.entries(studio.hours).map(([day, hours]) => ({
                      label: day,
                      hours,
                    }))
                ).map(({ label, hours }) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 text-xs font-body"
                  >
                    <span className="text-white/30 uppercase tracking-wider">
                      {label}
                    </span>
                    <span className="text-white/50">{hours}</span>
                  </div>
                ))}
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="container-wide py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-white/25 text-xs tracking-wide">
            © {currentYear} {gymName}. All rights reserved.
          </p>
          <a
            href="https://codegyms.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-white/25 hover:text-white/50 text-xs tracking-wide transition-colors"
          >
            Powered by Koriva
          </a>
        </div>
      </div>

      {/* Integration CTAs */}
      {(integrations.booking_enabled || integrations.portal_enabled) && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container-wide py-4 flex flex-wrap items-center justify-center gap-4">
            {integrations.booking_enabled && (
              <a
                href={integrations.booking_url}
                className="font-body text-xs tracking-widest uppercase font-semibold px-5 py-2.5 transition-all hover:opacity-80"
                style={{
                  border: "1px solid var(--primary, #fff)",
                  color: "var(--primary, #fff)",
                  borderRadius: "2px",
                }}
              >
                Book a Class →
              </a>
            )}
            {integrations.portal_enabled && (
              <a
                href={integrations.portal_url}
                className="font-body text-xs tracking-widest uppercase font-semibold px-5 py-2.5 transition-all hover:opacity-80"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.55)",
                  borderRadius: "2px",
                }}
              >
                Member Login →
              </a>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
