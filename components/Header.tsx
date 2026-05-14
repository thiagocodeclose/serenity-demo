"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";

const navLinks = [
  { label: "Classes", href: "#classes" },
  { label: "Teachers", href: "#teachers" },
  { label: "Studio", href: "#studio" },
  { label: "Pricing", href: "#pricing" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [integrations, setIntegrations] = useState<{
    booking_enabled: boolean;
    portal_enabled: boolean;
    booking_url: string;
    portal_url: string;
  }>({
    booking_enabled: false,
    portal_enabled: false,
    booking_url: "#",
    portal_url: "#",
  });
  const siteData = useSiteData();
  const gymName = siteData?.gym?.name?.toUpperCase() || "SERENITY WELLNESS";
  const logoUrl = siteData?.brand?.logo_url;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize from SSR config (production)
  useEffect(() => {
    const gym = siteData?.gym;
    if (!gym) return;
    const slug = gym.slug;
    const baseUrl = gym.base_url || process.env.NEXT_PUBLIC_APP_URL || "https://app.codegyms.com";
    setIntegrations({
      booking_enabled: !!gym.booking_enabled,
      portal_enabled: !!gym.portal_enabled,
      booking_url: slug ? `${baseUrl}/schedule/${slug}` : "#",
      portal_url: gym.portal_url || (slug ? `${baseUrl}/member-login/${slug}` : "#"),
    });
  }, [siteData]);

  // Update from live-preview (koriva:brand event — admin builder only)
  useEffect(() => {
    function handleBrand(e: Event) {
      const d = (e as CustomEvent).detail as Record<string, unknown>;
      if (
        d.booking_enabled !== undefined ||
        d.portal_enabled !== undefined ||
        d.gym_slug !== undefined
      ) {
        const slug = (d.gym_slug as string) || "";
        const baseUrl =
          (d.base_url as string) ||
          process.env.NEXT_PUBLIC_APP_URL ||
          "https://app.codegyms.com";
        setIntegrations({
          booking_enabled: !!d.booking_enabled,
          portal_enabled: !!d.portal_enabled,
          booking_url: slug ? `${baseUrl}/schedule/${slug}` : "#",
          portal_url:
            (d.portal_url as string) ||
            (slug ? `${baseUrl}/member-login/${slug}` : "#"),
        });
      }
    }
    window.addEventListener("koriva:brand", handleBrand);
    return () => window.removeEventListener("koriva:brand", handleBrand);
  }, []);
  return (
    <header
      className="fixed left-0 right-0 z-50"
      style={{
        top: "var(--bar-h, 0px)",
        transition: "top 0.2s ease, background-color 0.5s, border-color 0.5s, backdrop-filter 0.5s",
        backgroundColor: scrolled ? "var(--bg)" : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={gymName}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span
                className="font-heading tracking-wider transition-colors duration-300"
                style={{
                  fontSize: "1.35rem",
                  color: scrolled ? "var(--ink)" : "white",
                }}
              >
                {gymName}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-sm tracking-widest uppercase transition-colors duration-300 hover:opacity-70"
                style={{
                  color: scrolled
                    ? "var(--text-muted)"
                    : "rgba(255,255,255,0.75)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {integrations.portal_enabled && (
              <a
                href={integrations.portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs tracking-widest uppercase px-4 py-2.5 flex items-center gap-1.5 transition-all duration-300"
                style={{
                  border: scrolled
                    ? "1px solid var(--border, rgba(0,0,0,0.15))"
                    : "1px solid rgba(255,255,255,0.28)",
                  color: scrolled ? "var(--text-muted)" : "rgba(255,255,255,0.75)",
                  borderRadius: "var(--radius, 0px)",
                }}
                aria-label="Member portal"
              >
                <User size={12} />
                Member Area
              </a>
            )}
            <Link
              href={
                integrations.booking_enabled
                  ? integrations.booking_url
                  : "#pricing"
              }
              className="font-body text-xs tracking-widest uppercase px-6 py-3 transition-all duration-300"
              style={{
                border: scrolled
                  ? "1px solid var(--primary)"
                  : "1px solid rgba(255,255,255,0.5)",
                color: scrolled ? "var(--primary)" : "white",
              }}
            >
              Book Free Class
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden transition-colors"
            style={{ color: scrolled ? "var(--ink)" : "white" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
        >
          <div className="container-wide py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-body text-sm tracking-widest uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={
                integrations.booking_enabled
                  ? integrations.booking_url
                  : "#pricing"
              }
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-2 text-center"
            >
              Book Free Class
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
