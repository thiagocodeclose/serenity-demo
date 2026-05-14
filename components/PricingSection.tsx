'use client';

/**
 * PricingSection — Serenity Template
 *
 * Fully native (no iframe). Fetches plans from the public pricing API.
 * On "Join Now" click: opens a bottom slide-up panel with:
 *   Step 1 — Registration form (name, email, phone)
 *   Step 2 — Stripe Embedded Checkout (via /api/membership-checkout proxy)
 *   Step 3 — Success confirmation
 *
 * Requires: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel env vars.
 * Falls back gracefully when Stripe is not configured (CTA scrolls to #classes).
 *
 * Design tokens: --bg-cream, --primary, --accent, --sage, --text-muted, --border
 * Fonts: Cormorant Garamond (heading), DM Sans (body)
 */

import { Reveal } from '@/components/Reveal';
import { useSiteData } from '@/components/SiteDataProvider';
import { useKorivaElement } from '@/hooks/useKorivaElement';
import { koriva } from '@/lib/site-data';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, CheckCircle2, Loader2, Lock, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_months: number;
  billing_interval: string | null;
  trial_days: number | null;
  setup_fee: number | null;
  features: unknown[];
  is_active: boolean;
}

// ─── Stripe (lazy-loaded once) ────────────────────────────────────────────────

const stripePromise =
  typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(n);
}

function formatInterval(interval: string | null, months: number) {
  if (interval === 'year' || months === 12) return '/year';
  if (interval === 'week') return '/week';
  return '/month';
}

function getCtaLabel(billingEnabled: boolean, mode: string) {
  if (!billingEnabled) return 'Learn More';
  if (mode === 'trial_enabled') return 'Start Free Trial';
  if (mode === 'full_signup') return 'Join Now';
  return 'Learn More';
}

// ─── Shared inline styles ────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem 1rem',
  background: '#FAF8F5',
  border: '1px solid var(--border)',
  fontFamily: 'var(--font-body), DM Sans, sans-serif',
  fontSize: '0.9rem',
  color: 'var(--text)',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body), DM Sans, sans-serif',
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-muted)',
  marginBottom: '0.4rem',
};

// ─── CheckoutPanel ────────────────────────────────────────────────────────────

function CheckoutPanel({
  plan,
  slug,
  onClose,
}: {
  plan: Plan;
  slug: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/membership-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          planId: plan.id,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start checkout.');
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !submitting && form.firstName.trim().length > 0 && form.email.trim().length > 0;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="checkout-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,23,20,0.5)',
          backdropFilter: 'blur(3px)',
          zIndex: 80,
        }}
      />

      {/* Slide-up panel */}
      <motion.div
        key="checkout-panel"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label="Membership checkout"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          maxWidth: '560px',
          margin: '0 auto',
          background: 'var(--bg-cream, #F0EBE3)',
          borderTop: '1px solid var(--border)',
          borderLeft: '1px solid var(--border)',
          borderRight: '1px solid var(--border)',
          borderRadius: '16px 16px 0 0',
          zIndex: 90,
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0 0.5rem' }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border)' }} />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '1.25rem', right: '1.5rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '0.25rem',
            display: 'flex', alignItems: 'center',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ padding: '1rem 2rem 3rem' }}>

          {/* ── Success ─────────────────────────────────────────────── */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0f7ee', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--sage, #7C9070)' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading), Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--text)', marginBottom: '0.75rem' }}>
                Welcome to Serenity.
              </h3>
              <p style={{ fontFamily: 'var(--font-body), sans-serif', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Your membership is being activated.<br />
                Check your email for login details.
              </p>
              <button onClick={onClose} className="btn-outline" style={{ marginTop: '2rem' }}>
                Back to Studio
              </button>
            </div>
          )}

          {/* ── Info form ────────────────────────────────────────────── */}
          {step === 'info' && (
            <>
              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Join Serenity</p>
                <h3 style={{ fontFamily: 'var(--font-heading), Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, color: 'var(--text)', marginBottom: '0.3rem' }}>
                  {plan.name}
                </h3>
                <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '0.95rem' }}>
                  <strong style={{ color: 'var(--primary)' }}>{formatPrice(plan.price)}</strong>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                    {formatInterval(plan.billing_interval, plan.duration_months)}
                  </span>
                  {plan.trial_days && plan.trial_days > 0 && (
                    <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--sage)' }}>
                      · {plan.trial_days}-day free trial
                    </span>
                  )}
                </p>
              </div>

              <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>First Name *</label>
                    <input type="text" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="Jane" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input type="text" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Smith" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone (optional)</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+1 (310) 000-0000" style={inputStyle} />
                </div>

                {error && (
                  <p style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 4, padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#DC2626' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-primary"
                  style={{ justifyContent: 'center', opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Lock size={14} /> Continue to Payment</>}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-light)', fontSize: '0.75rem' }}>
                  <ShieldCheck size={13} />
                  Secure checkout · Powered by Stripe
                </div>
              </form>
            </>
          )}

          {/* ── Stripe Embedded Checkout ──────────────────────────────── */}
          {step === 'payment' && clientSecret && stripePromise && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button onClick={() => setStep('info')} aria-label="Back" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--text-muted)', display: 'flex' }}>
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 2 }}>Secure Payment</p>
                  <p style={{ fontFamily: 'var(--font-heading), serif', fontSize: '1.1rem', color: 'var(--text)' }}>
                    {plan.name} · {formatPrice(plan.price)}{formatInterval(plan.billing_interval, plan.duration_months)}
                  </p>
                </div>
              </div>
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret, onComplete: () => setStep('success') }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ─── PricingSection (main export) ────────────────────────────────────────────

export function PricingSection() {
  const siteData = useSiteData();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const widgetConfig = (siteData as unknown as { widgetConfig?: Record<string, unknown> })?.widgetConfig;
  const billingEnabled = !!(widgetConfig?.billing_enabled);
  const conversionMode = (widgetConfig?.conversion_mode as string) || 'lead_only';
  const slug = siteData?.gym?.slug || koriva.gymSlug;

  const eyebrow = useKorivaElement('pricing_eyebrow', { content: 'Membership', visible: true }, { section: 'Pricing', label: 'Eyebrow', type: 'eyebrow' });
  const headline = useKorivaElement('pricing_headline', { content: 'Your Journey Starts Here', visible: true }, { section: 'Pricing', label: 'Headline', type: 'text' });
  const descEl = useKorivaElement('pricing_description', { content: 'Simple, transparent pricing. No hidden fees. Cancel anytime.', visible: true }, { section: 'Pricing', label: 'Description', type: 'text' });

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_CODEGYM_URL || 'https://app.codegyms.com';
    const gymSlug = slug || koriva.gymSlug;
    if (!gymSlug) { setLoading(false); return; }
    fetch(`${baseUrl}/api/public/pricing?slug=${encodeURIComponent(gymSlug)}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data?.plans)) setPlans(data.plans); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const popularId =
    plans.length > 1
      ? [...plans].sort((a, b) => a.price - b.price)[Math.floor(plans.length / 2)]?.id
      : null;

  const ctaLabel = getCtaLabel(billingEnabled, conversionMode);
  const checkoutEnabled =
    billingEnabled &&
    (conversionMode === 'full_signup' || conversionMode === 'trial_enabled') &&
    !!stripePromise;

  const handleCta = (plan: Plan) => {
    if (checkoutEnabled) {
      setSelectedPlan(plan);
    } else {
      document.querySelector('#classes')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const gridCols =
    plans.length >= 3 ? 'grid-cols-1 sm:grid-cols-3' :
    plans.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
    'grid-cols-1 max-w-md mx-auto';

  return (
    <section id="pricing" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container-tight">
        {/* Section header */}
        <div className="text-center mb-16">
          <Reveal>
            <p {...eyebrow.editProps} className="eyebrow mb-4">{eyebrow.content}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              {...headline.editProps}
              className="font-heading text-ink"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {headline.content}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="divider" />
          </Reveal>
          <Reveal delay={0.25}>
            <p
              {...descEl.editProps}
              className="font-body text-muted max-w-md mx-auto leading-relaxed"
              style={{ fontSize: '0.95rem' }}
            >
              {descEl.content}
            </p>
          </Reveal>
        </div>

        {/* Plan cards */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontFamily: 'var(--font-heading), serif', fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              Membership details available upon request.
            </p>
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-6`}>
            {plans.map((plan, idx) => {
              const isPopular = plan.id === popularId;
              return (
                <Reveal key={plan.id} delay={idx * 0.1}>
                  <article
                    style={{
                      background: '#FFFFFF',
                      border: `${isPopular ? 2 : 1}px solid ${isPopular ? 'var(--primary)' : 'var(--border)'}`,
                      overflow: 'hidden',
                      boxShadow: isPopular
                        ? '0 12px 40px rgba(139,115,85,0.2)'
                        : '0 2px 16px rgba(0,0,0,0.06)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = 'translateY(-5px)';
                      el.style.boxShadow = '0 20px 48px rgba(139,115,85,0.22)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = '';
                      el.style.boxShadow = isPopular
                        ? '0 12px 40px rgba(139,115,85,0.2)'
                        : '0 2px 16px rgba(0,0,0,0.06)';
                    }}
                  >
                    {isPopular && (
                      <div style={{ background: 'var(--primary)', padding: '0.5rem', textAlign: 'center', fontFamily: 'var(--font-body), sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFF' }}>
                        Most Popular
                      </div>
                    )}

                    <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                      {/* Name + description */}
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-heading), Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: plan.description ? '0.4rem' : 0 }}>
                          {plan.name}
                        </h3>
                        {plan.description && (
                          <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            {plan.description}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.25rem' }}>
                          <span style={{ fontFamily: 'var(--font-heading), Cormorant Garamond, serif', fontSize: '3.4rem', fontWeight: 400, lineHeight: 1, color: 'var(--primary)' }}>
                            {formatPrice(plan.price)}
                          </span>
                          <span style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)', paddingBottom: '0.4rem' }}>
                            {formatInterval(plan.billing_interval, plan.duration_months)}
                          </span>
                        </div>
                        {plan.trial_days && plan.trial_days > 0 && (
                          <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '0.78rem', color: 'var(--sage)', fontWeight: 600, marginTop: '0.3rem', letterSpacing: '0.04em' }}>
                            {plan.trial_days}-day free trial included
                          </p>
                        )}
                        {plan.setup_fee && plan.setup_fee > 0 && (
                          <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                            + {formatPrice(plan.setup_fee)} enrollment fee
                          </p>
                        )}
                      </div>

                      {/* Feature list */}
                      {Array.isArray(plan.features) && plan.features.length > 0 && (
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {plan.features.map((feat, i) => {
                            const text =
                              typeof feat === 'string'
                                ? feat
                                : (feat as Record<string, string>)?.name ||
                                  (feat as Record<string, string>)?.label || '';
                            return (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                                <Check size={14} style={{ color: 'var(--sage, #7C9070)', flexShrink: 0, marginTop: '0.22rem' }} />
                                <span style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                                  {text}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {/* CTA */}
                      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                        <button
                          onClick={() => handleCta(plan)}
                          className={isPopular ? 'btn-primary' : 'btn-outline'}
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          {ctaLabel}
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Trust signals */}
        {!loading && plans.length > 0 && (
          <Reveal delay={0.35}>
            <div className="flex flex-wrap justify-center gap-8 mt-14">
              {['✓ Cancel anytime', '✓ First class free', '✓ No commitment', '✓ Pause your membership'].map((item) => (
                <span key={item} className="font-body text-muted text-sm tracking-wide">{item}</span>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {/* ── Checkout slide-up panel ─────────────────────────────────── */}
      <AnimatePresence>
        {selectedPlan && (
          <CheckoutPanel
            plan={selectedPlan}
            slug={slug}
            onClose={() => setSelectedPlan(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

