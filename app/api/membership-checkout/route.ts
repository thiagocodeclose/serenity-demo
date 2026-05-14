// Proxy: forwards membership checkout requests to codegym backend
// Avoids CORS by keeping the Stripe API call server-side

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_CODEGYM_URL || 'https://app.codegyms.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, planId, firstName, lastName, email, phone } = body;

    if (!slug || !planId || !firstName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, planId, firstName, email' },
        { status: 400 }
      );
    }

    // Basic email validation at the edge
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const upstream = await fetch(`${BACKEND_URL}/api/stripe/widget-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, planId, firstName, lastName, email, phone }),
      // server-to-server — no CORS issues
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('[membership-checkout] proxy error:', err);
    return NextResponse.json(
      { error: 'Checkout unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
