// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useKorivaElement } from "@/hooks/useKorivaElement";
import { useSiteData } from "@/components/SiteDataProvider";

/**
 * SERENITY — Editorial Hero with ambient video slideshow
 * Layout: giant headline top (editorial) + ambient video section below
 * Videos cycle automatically with opacity crossfade + subtle scale effect
 */

const WELLNESS_VIDEOS = [
  "/videos/wellness-1.mp4",
  "/videos/wellness-2.mp4",
  "/videos/wellness-3.mp4",
  "/videos/wellness-4.mp4",
  "/videos/wellness-5.mp4",
];

const FADE_MS = 1400;

export function HeroSection() {
  const [bookingIntegration, setBookingIntegration] = useState<{
    booking_enabled: boolean;
    booking_url: string;
  }>({ booking_enabled: false, booking_url: "#" });

  const siteData = typeof useSiteData === "function" ? useSiteData() : null;

  // ── Dual-buffer video slideshow ──────────────────────────────
  const activeSlotRef = useRef<"a" | "b">("a");
  const [activeSlot, setActiveSlot] = useState<"a" | "b">("a");
  const idxRef = useRef({ a: 0, b: 1 });
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    refA.current?.play().catch(() => {});
  }, []);

  const handleVideoEnd = (slot: "a" | "b") => {
    if (slot !== activeSlotRef.current) return;

    const otherSlot = slot === "a" ? "b" : "a";
    const otherRef = slot === "a" ? refB : refA;
    const thisRef = slot === "a" ? refA : refB;

    // Start the buffered video
    otherRef.current?.play().catch(() => {});

    // Swap visible slot
    activeSlotRef.current = otherSlot;
    setActiveSlot(otherSlot);

    // After crossfade completes, preload the next video into the now-hidden slot
    setTimeout(() => {
      const nextIdx = (idxRef.current[otherSlot] + 1) % WELLNESS_VIDEOS.length;
      idxRef.current[slot] = nextIdx;
      if (thisRef.current) {
        thisRef.current.src = WELLNESS_VIDEOS[nextIdx];
        thisRef.current.load();
      }
    }, FADE_MS + 200);
  };

  // ── Koriva editable elements ─────────────────────────────────
  const eyebrow = useKorivaElement(
    "hero_eyebrow",
    { content: "Yoga · Pilates · Mindful Movement", visible: true },
    { section: "Hero", label: "Eyebrow", type: "eyebrow" },
  );
  const hl1 = useKorivaElement(
    "hero_headline_1",
    { content: "Stillness", visible: true },
    { section: "Hero", label: "Headline", type: "text" },
  );
  const hl2 = useKorivaElement(
    "hero_headline_2",
    { content: "lives here.", visible: true },
    { section: "Hero", label: "Tagline", type: "text" },
  );
  const subtitle = useKorivaElement(
    "hero_subtitle",
    {
      content: "Austin's premier sanctuary for yoga, pilates & breathwork.",
      visible: true,
    },
    { section: "Hero", label: "Description", type: "text" },
  );
  const cta1 = useKorivaElement(
    "hero_cta_primary",
    { content: "Book Free Class", visible: true },
    { section: "Hero", label: "CTA Primary", type: "button" },
  );
  const cta2 = useKorivaElement(
    "hero_cta_secondary",
    { content: "View Schedule", visible: true },
    { section: "Hero", label: "CTA Secondary", type: "button" },
  );

  // ── Integration listener ─────────────────────────────────────
  useEffect(() => {
    function handleBrand(e: Event) {
      const d = (e as CustomEvent).detail as Record<string, unknown>;
      if (d.booking_enabled !== undefined || d.gym_slug !== undefined) {
        const slug = (d.gym_slug as string) || "";
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || "https://app.codegyms.com";
        setBookingIntegration({
          booking_enabled: !!d.booking_enabled,
          booking_url: slug ? `${baseUrl}/schedule/${slug}` : "#",
        });
      }
    }
    window.addEventListener("koriva:brand", handleBrand);
    return () => window.removeEventListener("koriva:brand", handleBrand);
  }, []);

  const bookingHref = bookingIntegration.booking_enabled
    ? bookingIntegration.booking_url
    : "#classes";

  return (
    <section
      style={{
        backgroundColor: "var(--cg-bg, #FAF9F6)",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Editorial text section ────────────────────────────── */}
      <div
        style={{
          paddingTop: "130px",
          paddingBottom: "36px",
          paddingLeft: "6vw",
          paddingRight: "6vw",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          alignItems: "end",
          gap: "3rem",
        }}
      >
        <div>
          {eyebrow.visible && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              {...eyebrow.editProps}
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--cg-primary, #8B7355)",
                marginBottom: "20px",
                fontFamily: "var(--font-body)",
              }}
            >
              {eyebrow.content}
            </motion.p>
          )}

          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.0,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              {...hl1.editProps}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3.8rem, 10vw, 9.5rem)",
                lineHeight: 0.92,
                fontWeight: 300,
                color: "var(--cg-text, #2C2C2C)",
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              {hl1.content}
            </motion.h1>
          </div>

          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.0,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              {...hl2.editProps}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3.8rem, 10vw, 9.5rem)",
                lineHeight: 0.92,
                fontWeight: 300,
                fontStyle: "italic",
                color: "var(--cg-primary, #8B7355)",
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              {hl2.content}
            </motion.h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <p
            {...subtitle.editProps}
            style={{
              fontSize: "14px",
              lineHeight: 1.65,
              color: "var(--cg-text, #2C2C2C)",
              opacity: 0.65,
              fontFamily: "var(--font-body)",
              margin: 0,
            }}
          >
            {subtitle.content}
          </p>

          <Link
            {...cta1.editProps}
            href={bookingHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "var(--cg-primary, #8B7355)",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "11.5px",
              fontWeight: 500,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              width: "fit-content",
            }}
          >
            {cta1.content} <ArrowRight size={13} />
          </Link>

          <Link
            {...cta2.editProps}
            href={bookingHref}
            style={{
              fontSize: "12px",
              color: "var(--cg-text, #2C2C2C)",
              opacity: 0.5,
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              fontFamily: "var(--font-body)",
              width: "fit-content",
            }}
          >
            {cta2.content}
          </Link>
        </motion.div>
      </div>

      {/* ── Ambient video slideshow ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          flex: 1,
          paddingLeft: "6vw",
          paddingRight: "6vw",
          paddingBottom: "6vh",
          minHeight: "46vh",
          maxHeight: "52vh",
          height: "46vh",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {/* Slot A */}
          <video
            ref={refA}
            src={WELLNESS_VIDEOS[0]}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => handleVideoEnd("a")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: activeSlot === "a" ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`,
              transform: "scale(1.04)",
              transformOrigin: "center",
            }}
          />

          {/* Slot B */}
          <video
            ref={refB}
            src={WELLNESS_VIDEOS[1]}
            muted
            playsInline
            preload="auto"
            onEnded={() => handleVideoEnd("b")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: activeSlot === "b" ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`,
              transform: "scale(1.04)",
              transformOrigin: "center",
            }}
          />

          {/* Vignette — preserves light wellness palette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(250,249,246,0.06) 0%, rgba(0,0,0,0.22) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Floating stats pill */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              background: "rgba(250,249,246,0.88)",
              backdropFilter: "blur(16px)",
              borderRadius: "999px",
              padding: "9px 20px",
              display: "flex",
              gap: "20px",
              alignItems: "center",
              fontSize: "12px",
              fontFamily: "var(--font-body)",
            }}
          >
            <span
              style={{ color: "var(--cg-primary, #8B7355)", fontWeight: 600 }}
            >
              ★ 4.9
            </span>
            <span style={{ color: "var(--cg-text, #2C2C2C)", opacity: 0.65 }}>
              2,400+ members
            </span>
            <span style={{ color: "var(--cg-text, #2C2C2C)", opacity: 0.55 }}>
              12 classes/wk
            </span>
          </div>

          {/* First class free — promo tag */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              background: "var(--cg-primary, #8B7355)",
              borderRadius: "10px",
              padding: "14px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "var(--font-body)",
                margin: 0,
              }}
            >
              First class
            </p>
            <p
              style={{
                color: "#fff",
                fontSize: "20px",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.2,
                fontFamily: "var(--font-heading)",
                margin: 0,
              }}
            >
              Always free.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
