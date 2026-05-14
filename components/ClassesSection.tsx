// @ts-nocheck
"use client";

/**
 * ClassesSection — Serenity Template
 *
 * Three navigation modes, all with Serenity's editorial aesthetic:
 *   PRACTICE  — class-type list (left) + session rows (right) in tabular layout
 *   TEACHER   — numbered instructor names, expand to show their sessions
 *   DAY       — single-letter day pills + vertical session timeline
 *
 * Booking: bottom slide-up panel, cream background, serif labels.
 *
 * Design tokens used: --bg, --bg-cream, --primary, --text-muted, --border, --sage, --radius
 * Fonts: Cormorant Garamond (heading), DM Sans (body)
 */

import { Reveal } from "@/components/Reveal";
import { koriva } from "@/lib/site-data";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSiteData } from "@/components/SiteDataProvider";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const DAY_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtTime(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "pm" : "am"}`;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildWeek(offset: number): Date[] {
  const today = new Date();
  const mon = new Date(today);
  mon.setDate(today.getDate() - ((today.getDay() + 6) % 7) + offset * 7);
  mon.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

function spotsLabel(s: any): string | null {
  if (s.spots_remaining === null) return null;
  if (s.spots_remaining === 0) return "Full";
  if (s.spots_remaining <= 3) return `${s.spots_remaining} left`;
  return null;
}

// Shared table-header style
const TH: React.CSSProperties = {
  fontSize: "0.6rem",
  fontWeight: 600,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  textAlign: "left",
  padding: "0 0 0.75rem",
  borderBottom: "1px solid var(--border)",
};

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function ClassesSection() {
  const siteData = useSiteData();
  const [brand, setBrand] = useState<Record<string, string>>({});

  // Live-preview brand updates from admin iframe
  useEffect(() => {
    const handler = (e: any) => setBrand((p) => ({ ...p, ...e.detail }));
    window.addEventListener("koriva:brand", handler);
    return () => window.removeEventListener("koriva:brand", handler);
  }, []);

  const slug = brand?.gym_slug || siteData?.gym?.slug || koriva.gymSlug;
  const base = brand?.base_url || siteData?.gym?.base_url || koriva.baseUrl;
  const widgetKey = siteData?.widgetConfig?.widget_public_key || process.env.NEXT_PUBLIC_WIDGET_KEY || "";

  // ── Remote data
  const [sessions, setSessions]       = useState<any[]>([]);
  const [classTypes, setClassTypes]   = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!slug || !base) return;
    setLoading(true);
    Promise.all([
      fetch(`${base}/api/public/classes?slug=${slug}`)
        .then((r) => r.ok ? r.json() : { classes: [] })
        .catch(() => ({ classes: [] })),
      fetch(`${base}/api/public/class-types?slug=${slug}`)
        .then((r) => r.ok ? r.json() : { classes: [] })
        .catch(() => ({ classes: [] })),
      fetch(`${base}/api/public/instructors?slug=${slug}`)
        .then((r) => r.ok ? r.json() : { instructors: [] })
        .catch(() => ({ instructors: [] })),
    ]).then(([sess, types, instr]) => {
      setSessions(sess?.classes ?? []);
      setClassTypes(types?.classes ?? []);
      setInstructors(instr?.instructors ?? []);
      setLoading(false);
    });
  }, [slug, base]);

  // ── Navigation state
  const [mode, setMode]               = useState<"practice" | "teacher" | "day">("practice");
  const [selPractice, setSelPractice] = useState<string | null>(null);
  const [openTeacher, setOpenTeacher] = useState<string | null>(null);
  const [selDay, setSelDay]           = useState<Date | null>(null);
  const [weekOff, setWeekOff]         = useState(0);

  useEffect(() => {
    if (mode === "practice" && classTypes.length > 0 && !selPractice)
      setSelPractice(classTypes[0].website_name || classTypes[0].name);
  }, [mode, classTypes]);

  useEffect(() => {
    if (mode === "day" && !selDay) setSelDay(new Date());
  }, [mode]);

  const days = buildWeek(weekOff);

  // ── Booking state
  const [slot, setSlot]   = useState<any | null>(null);
  const [form, setForm]   = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy]   = useState(false);
  const [done, setDone]   = useState(false);
  const [err, setErr]     = useState<string | null>(null);

  function openSlot(s: any) {
    setSlot(s);
    setForm({ name: "", email: "", phone: "" });
    setDone(false);
    setErr(null);
    document.body.style.overflow = "hidden";
  }
  function closeSlot() {
    setSlot(null);
    document.body.style.overflow = "";
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch(`${base}/api/public/book-trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          widget_key: widgetKey,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          class_name: slot.name,
          class_date: slot.scheduled_date,
          class_time: slot.start_time,
          instructor: slot.instructor_name || undefined,
        }),
      });
      const data = await r.json();
      if (!r.ok) setErr(data?.message || "Something went wrong.");
      else { setDone(true); setTimeout(closeSlot, 3000); }
    } catch {
      setErr("Unable to connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // ── Data helpers
  function sortSess(arr: any[]) {
    return [...arr].sort((a, b) =>
      a.scheduled_date === b.scheduled_date
        ? a.start_time.localeCompare(b.start_time)
        : a.scheduled_date.localeCompare(b.scheduled_date)
    );
  }
  const forPractice = (name: string) => sortSess(sessions.filter((s) => s.name === name));
  const forTeacher  = (name: string) => sortSess(sessions.filter((s) => s.instructor_name === name));
  const forDay      = (d: Date)      => sessions
    .filter((s) => s.scheduled_date === toDateStr(d))
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
  const teachers = [...new Set(sessions.map((s) => s.instructor_name).filter(Boolean))];

  return (
    <>
      {/* ── Main section */}
      <section id="classes" className="section-padding" style={{ backgroundColor: "var(--bg)" }}>
        <div className="container-tight">

          {/* Header */}
          <div className="text-center mb-16">
            <Reveal><p className="eyebrow mb-4">Find Your Practice</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-heading text-ink" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
                The Schedule
              </h2>
            </Reveal>
            <Reveal delay={0.2}><div className="divider" /></Reveal>
            <Reveal delay={0.25}>
              <p className="font-body text-muted max-w-lg mx-auto leading-relaxed text-base md:text-lg">
                Every class, every teacher, every moment — all here.
              </p>
            </Reveal>
          </div>

          {/* Mode navigation — editorial text links separated by / */}
          <Reveal delay={0.3}>
            <nav aria-label="Schedule view" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "3.5rem" }}>
              {(["practice", "teacher", "day"] as const).map((m, i) => (
                <span key={m} style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => setMode(m)}
                    aria-current={mode === m ? true : undefined}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "var(--font-body,'DM Sans',sans-serif)",
                      fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: mode === m ? "var(--primary,#8B7355)" : "var(--text-muted,#6B6B6B)",
                      padding: "0.25rem 0",
                      borderBottom: mode === m ? "1px solid var(--primary,#8B7355)" : "1px solid transparent",
                      transition: "color 0.2s,border-color 0.2s",
                    }}
                  >
                    {m === "practice" ? "By Practice" : m === "teacher" ? "By Teacher" : "By Day"}
                  </button>
                  {i < 2 && <span style={{ margin: "0 1.5rem", color: "var(--border,#E5DDD5)" }}>/</span>}
                </span>
              ))}
            </nav>
          </Reveal>

          {/* Content panels */}
          <AnimatePresence mode="wait">

            {/* ── PRACTICE: 2-column tabular */}
            {mode === "practice" && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}
              >
                {/* Left: class type list */}
                <div>
                  <p style={{ ...TH, borderBottom: "none", marginBottom: "1.5rem" }}>Practices</p>
                  {loading ? <Skel n={4} /> : classTypes.length === 0
                    ? <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No classes yet.</p>
                    : (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {classTypes.map((ct) => (
                          <li key={ct.id}>
                            <button
                              onClick={() => setSelPractice(ct.website_name || ct.name)}
                              style={{
                                display: "flex", alignItems: "center", gap: "0.75rem",
                                width: "100%", background: "none", border: "none",
                                borderBottom: "1px solid var(--border,#E5DDD5)",
                                padding: "0.75rem 0", cursor: "pointer", textAlign: "left",
                                transition: "opacity 0.2s",
                              }}
                            >
                              {/* Class thumbnail */}
                              {(() => {
                                const img = ct.image_url || sessions.find((sx: any) => sx.name === (ct.website_name || ct.name))?.class_image_url;
                                return img
                                  ? <img src={img} alt={ct.website_name || ct.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "var(--radius,2px)", flexShrink: 0 }} />
                                  : <div style={{ width: 44, height: 44, background: "var(--bg-cream,#F0EBE3)", borderRadius: "var(--radius,2px)", flexShrink: 0 }} />;
                              })()}
                              <span style={{
                                flex: 1,
                                color: selPractice === (ct.website_name || ct.name) ? "var(--primary,#8B7355)" : "var(--text,#2C2C2C)",
                                fontFamily: "var(--font-heading,'Cormorant Garamond',serif)",
                                fontSize: "1.15rem", fontWeight: 400, transition: "color 0.2s",
                              }}>
                                {ct.website_name || ct.name}
                              </span>
                              {selPractice === (ct.website_name || ct.name) && (
                                <ChevronRight size={14} style={{ color: "var(--primary,#8B7355)", flexShrink: 0 }} />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                {/* Right: sessions table */}
                <div>
                  <p style={{ ...TH, borderBottom: "none", marginBottom: "1.5rem" }}>
                    {selPractice ? `Upcoming · ${selPractice}` : "Select a practice"}
                  </p>
                  {selPractice && (() => {
                    const rows = forPractice(selPractice);
                    if (loading) return <Skel n={3} />;
                    if (rows.length === 0) return <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No upcoming sessions.</p>;
                    return (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            {["Date", "Time", "Teacher", ""].map((h) => <th key={h} style={TH}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((s) => <SRow key={s.id} s={s} onBook={openSlot} instrPhoto={instructors.find((i: any) => i.name === s.instructor_name)?.photo_url} />)}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* ── TEACHER: numbered accordion */}
            {mode === "teacher" && (
              <motion.div
                key="teacher"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <p style={{ ...TH, borderBottom: "none", marginBottom: "1.5rem" }}>Teachers</p>
                {loading ? <Skel n={3} /> : teachers.length === 0
                  ? <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No sessions scheduled.</p>
                  : (
                    <div>
                      {teachers.map((name, idx) => {
                        const instr = instructors.find((i) => i.name === name);
                        const rows  = forTeacher(name);
                        const open  = openTeacher === name;
                        return (
                          <div key={name} style={{ borderBottom: "1px solid var(--border,#E5DDD5)" }}>
                            <button
                              onClick={() => setOpenTeacher(open ? null : name)}
                              aria-expanded={open}
                              style={{
                                display: "flex", alignItems: "center", gap: "1.5rem",
                                width: "100%", background: "none", border: "none",
                                padding: "1.25rem 0", cursor: "pointer", textAlign: "left",
                              }}
                            >
                              <span style={{
                                fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em",
                                color: "var(--text-muted)", width: "1.5rem", flexShrink: 0,
                              }}>
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              {instr?.photo_url
                                ? <img src={instr.photo_url} alt={name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                                : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-cream,#F0EBE3)", flexShrink: 0 }} />
                              }
                              <div style={{ flex: 1 }}>
                                <p style={{
                                  fontFamily: "var(--font-heading,'Cormorant Garamond',serif)",
                                  fontSize: "1.25rem", fontWeight: 400, margin: 0,
                                  color: open ? "var(--primary,#8B7355)" : "var(--text,#2C2C2C)",
                                  transition: "color 0.2s",
                                }}>{name}</p>
                                {instr?.specialties?.length ? (
                                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: "2px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                    {instr.specialties.slice(0, 2).join(" · ")}
                                  </p>
                                ) : null}
                              </div>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "auto" }}>
                                {rows.length} {rows.length === 1 ? "class" : "classes"}
                              </span>
                              <motion.span
                                animate={{ rotate: open ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: "flex", color: "var(--text-muted)" }}
                              >
                                <ChevronRight size={14} />
                              </motion.span>
                            </button>
                            <AnimatePresence>
                              {open && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <div style={{ paddingBottom: "1.5rem", paddingLeft: "3.5rem" }}>
                                    {rows.length === 0
                                      ? <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No upcoming sessions.</p>
                                      : (
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                          <thead>
                                            <tr>
                                              {["Date", "Time", "Practice", ""].map((h) => <th key={h} style={TH}>{h}</th>)}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {rows.map((s) => <SRow key={s.id} s={s} showClass onBook={openSlot} />)}
                                          </tbody>
                                        </table>
                                      )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </motion.div>
            )}

            {/* ── DAY: week pills + vertical timeline */}
            {mode === "day" && (
              <motion.div
                key="day"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Week navigator */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                  <button
                    onClick={() => setWeekOff((o) => o - 1)}
                    disabled={weekOff <= 0}
                    style={{
                      background: "none", border: "none",
                      cursor: weekOff <= 0 ? "not-allowed" : "pointer",
                      color: weekOff <= 0 ? "var(--border)" : "var(--text-muted)",
                      fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                      fontFamily: "var(--font-body,sans-serif)",
                    }}
                  >
                    ← Prev
                  </button>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {days.map((day) => {
                      const ds     = toDateStr(day);
                      const isSel  = selDay && toDateStr(selDay) === ds;
                      const isToday = toDateStr(new Date()) === ds;
                      const has    = sessions.some((s) => s.scheduled_date === ds);
                      return (
                        <button
                          key={ds}
                          onClick={() => setSelDay(day)}
                          style={{
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                            background: isSel ? "var(--primary,#8B7355)" : "none",
                            border: "1px solid",
                            borderColor: isSel ? "var(--primary,#8B7355)" : "var(--border,#E5DDD5)",
                            borderRadius: "var(--radius,0px)",
                            padding: "0.6rem 0.75rem", cursor: "pointer", minWidth: "44px", transition: "all 0.2s",
                          }}
                        >
                          <span style={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: isSel ? "#fff" : "var(--text-muted)" }}>
                            {DAY_SHORT[day.getDay()]}
                          </span>
                          <span style={{ fontSize: "0.9rem", fontFamily: "var(--font-heading,serif)", color: isSel ? "#fff" : isToday ? "var(--primary,#8B7355)" : "var(--text)" }}>
                            {day.getDate()}
                          </span>
                          {has && !isSel && (
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--primary,#8B7355)" }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setWeekOff((o) => o + 1)}
                    style={{
                      background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                      fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                      fontFamily: "var(--font-body,sans-serif)",
                    }}
                  >
                    Next →
                  </button>
                </div>

                {/* Day sessions */}
                {selDay && (() => {
                  const rows = forDay(selDay);
                  if (loading) return <Skel n={3} />;
                  if (rows.length === 0) return (
                    <div style={{ textAlign: "center", padding: "3rem 0" }}>
                      <p style={{ fontFamily: "var(--font-heading,serif)", fontSize: "1.5rem", color: "var(--text-muted)", fontWeight: 400 }}>
                        No classes on {MONTH[selDay.getMonth()]} {selDay.getDate()}
                      </p>
                    </div>
                  );
                  return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {rows.map((s, idx) => {
                        const label = spotsLabel(s);
                        return (
                          <div
                            key={s.id}
                            style={{
                              display: "flex", alignItems: "center", gap: "2rem",
                              padding: "1.25rem 0",
                              borderBottom: "1px solid var(--border,#E5DDD5)",
                              borderTop: idx === 0 ? "1px solid var(--border,#E5DDD5)" : "none",
                            }}
                          >
                            <span style={{
                              fontFamily: "var(--font-heading,'Cormorant Garamond',serif)",
                              fontSize: "1.5rem", color: "var(--primary,#8B7355)",
                              minWidth: "6rem", flexShrink: 0,
                            }}>
                              {fmtTime(s.start_time)}
                            </span>
                            {/* Class thumbnail */}
                            {s.class_image_url && (
                              <img src={s.class_image_url} alt={s.name} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: "var(--radius,2px)", flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1 }}>
                              <p style={{ fontFamily: "var(--font-heading,serif)", fontSize: "1.1rem", fontWeight: 400, color: "var(--text)", margin: 0 }}>
                                {s.name}
                              </p>
                              {s.instructor_name && (() => {
                                const instr = instructors.find((i: any) => i.name === s.instructor_name);
                                return (
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "4px" }}>
                                    {instr?.photo_url && (
                                      <img src={instr.photo_url} alt={s.instructor_name} style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                                    )}
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, letterSpacing: "0.05em" }}>
                                      with {s.instructor_name}{s.duration_minutes ? ` · ${s.duration_minutes} min` : ""}
                                    </p>
                                  </div>
                                );
                              })()}
                            </div>
                            {label && (
                              <span style={{
                                fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em",
                                textTransform: "uppercase", flexShrink: 0,
                                color: s.spots_remaining === 0 ? "var(--text-muted)" : "var(--sage,#7C9070)",
                              }}>
                                {label}
                              </span>
                            )}
                            {s.spots_remaining !== 0 && (
                              <button
                                onClick={() => openSlot(s)}
                                style={{
                                  background: "none", border: "1px solid var(--border,#E5DDD5)",
                                  padding: "0.5rem 1.25rem", cursor: "pointer",
                                  fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.15em",
                                  textTransform: "uppercase", color: "var(--text)",
                                  fontFamily: "var(--font-body,sans-serif)", flexShrink: 0,
                                  transition: "border-color 0.2s,color 0.2s",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
                              >
                                Reserve
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </motion.div>
            )}

          </AnimatePresence>

          {/* Footer CTA */}
          <Reveal delay={0.2}>
            <div className="text-center mt-14">
              <a href="#pricing" className="btn-outline">View Memberships &rarr;</a>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── BOOKING PANEL (bottom slide-up) */}
      <AnimatePresence>
        {slot && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeSlot}
              style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,0.45)", zIndex: 80, backdropFilter: "blur(2px)" }}
            />
            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Reserve your spot"
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                maxWidth: "520px", margin: "0 auto",
                background: "var(--bg-cream,#F0EBE3)",
                borderTop: "1px solid var(--border,#E5DDD5)",
                padding: "2.5rem 2rem 2rem", zIndex: 90,
                maxHeight: "90vh", overflowY: "auto",
              }}
            >
              {/* Drag handle */}
              <div style={{ width: 36, height: 3, background: "var(--border)", borderRadius: 2, margin: "0 auto 2rem" }} />

              {/* Close */}
              <button
                onClick={closeSlot}
                aria-label="Close booking panel"
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                <X size={18} />
              </button>

              {done ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "2rem 0" }}>
                  <p style={{ fontFamily: "var(--font-heading,serif)", fontSize: "2rem", fontWeight: 400, color: "var(--primary)", marginBottom: "0.75rem" }}>
                    You&rsquo;re in.
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                    Confirmation is on its way to {form.email}.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Session info */}
                  <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "0.5rem" }}>
                      Reserve your spot
                    </p>
                    <p style={{ fontFamily: "var(--font-heading,'Cormorant Garamond',serif)", fontSize: "1.6rem", fontWeight: 400, color: "var(--text)", margin: 0 }}>
                      {slot.name}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      {(() => {
                        const d = new Date(slot.scheduled_date + "T00:00:00");
                        return `${DAY_SHORT[d.getDay()]}, ${MONTH[d.getMonth()]} ${d.getDate()} · ${fmtTime(slot.start_time)}${slot.instructor_name ? ` · with ${slot.instructor_name}` : ""}`;
                      })()}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {[
                      { k: "name",  l: "Full Name",       t: "text",  r: true,  ph: "Your full name" },
                      { k: "email", l: "Email Address",   t: "email", r: true,  ph: "you@example.com" },
                      { k: "phone", l: "Phone (optional)",t: "tel",   r: false, ph: "+1 (555) 000-0000" },
                    ].map((f) => (
                      <label key={f.k} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body,sans-serif)" }}>
                          {f.l}
                        </span>
                        <input
                          type={f.t}
                          required={f.r}
                          placeholder={f.ph}
                          value={form[f.k as keyof typeof form]}
                          onChange={(e) => setForm((p) => ({ ...p, [f.k]: e.target.value }))}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary,#8B7355)")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border,#E5DDD5)")}
                          style={{
                            padding: "0.85rem 1rem", background: "#fff",
                            border: "1px solid var(--border,#E5DDD5)",
                            fontSize: "0.9rem", fontFamily: "var(--font-body,sans-serif)",
                            color: "var(--text)", outline: "none", width: "100%",
                            borderRadius: "var(--radius,0px)", transition: "border-color 0.2s",
                          }}
                        />
                      </label>
                    ))}

                    {err && (
                      <p role="alert" style={{ fontSize: "0.8rem", color: "#9B3A2A", padding: "0.75rem 1rem", background: "#FDF0EE", border: "1px solid #F0C8C2" }}>
                        {err}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-primary"
                      style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", opacity: busy ? 0.6 : 1 }}
                    >
                      {busy ? "Reserving…" : "Reserve My Spot"}
                    </button>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                      Free trial · No commitment · Confirmation by email
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

/** Single session row for tables */
function SRow({ s, showClass = false, onBook, instrPhoto }: { s: any; showClass?: boolean; onBook: (s: any) => void; instrPhoto?: string }) {
  const d     = new Date(s.scheduled_date + "T00:00:00");
  const label = spotsLabel(s);
  return (
    <tr
      style={{ borderBottom: "1px solid var(--border,#E5DDD5)", cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-cream,#F0EBE3)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={{ padding: "1rem 0.75rem 1rem 0", fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
        {DAY_SHORT[d.getDay()]}, {MONTH[d.getMonth()]} {d.getDate()}
      </td>
      <td style={{ padding: "1rem 1rem 1rem 0", fontFamily: "var(--font-heading,serif)", fontSize: "1.1rem", color: "var(--primary,#8B7355)", whiteSpace: "nowrap" }}>
        {fmtTime(s.start_time)}
      </td>
      <td style={{ padding: "1rem 1rem 1rem 0", fontSize: "0.85rem", color: "var(--text)" }}>
        {showClass ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {s.class_image_url && (
              <img src={s.class_image_url} alt={s.name} style={{ width: 38, height: 38, borderRadius: "var(--radius,2px)", objectFit: "cover", flexShrink: 0 }} />
            )}
            <span style={{ fontFamily: "var(--font-heading,'Cormorant Garamond',serif)", fontSize: "1rem" }}>{s.name}</span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {instrPhoto
              ? <img src={instrPhoto} alt={s.instructor_name} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              : <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg-cream,#F0EBE3)", flexShrink: 0 }} />
            }
            <span>{s.instructor_name || "—"}</span>
          </div>
        )}
      </td>
      <td style={{ padding: "1rem 0", textAlign: "right" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
          {label && (
            <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: s.spots_remaining === 0 ? "var(--text-muted)" : "var(--sage,#7C9070)" }}>
              {label}
            </span>
          )}
          {s.spots_remaining !== 0 && (
            <button
              onClick={() => onBook(s)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "var(--primary,#8B7355)",
                fontFamily: "var(--font-body,sans-serif)",
                padding: "0.25rem 0", borderBottom: "1px solid var(--primary,#8B7355)",
              }}
            >
              Reserve &rarr;
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/** Loading skeleton */
function Skel({ n = 3 }: { n?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ height: "0.9rem", width: "5rem", background: "var(--bg-cream,#F0EBE3)", borderRadius: 2, opacity: 0.6 }} />
          <div style={{ height: "0.9rem", width: "4rem", background: "var(--bg-cream,#F0EBE3)", borderRadius: 2, opacity: 0.6 }} />
          <div style={{ height: "0.9rem", flex: 1, background: "var(--bg-cream,#F0EBE3)", borderRadius: 2, opacity: 0.6 }} />
        </div>
      ))}
    </div>
  );
}
