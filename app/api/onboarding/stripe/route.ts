import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import Stripe from 'stripe';
import { sendToAdminPortal } from '@/lib/api/admin-portal';

const stripeSecretKey = process.env.STRIPE_PLATFORM_SECRET;

if (!stripeSecretKey) {
  console.warn('[Stripe] STRIPE_PLATFORM_SECRET not configured');
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
  : null;

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing sessionId' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

    const account = await stripe.accounts.create({
      type: 'express',
      email: session.user.email || undefined,
      metadata: {
        sessionId,
        userSub: session.user.sub || '',
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/onboarding/stripe?sessionId=${sessionId}`,
      return_url: `${baseUrl}/onboarding/success?sessionId=${sessionId}&account=${account.id}`,
      type: 'account_onboarding',
    });

    await sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${sessionId}-stripe-start`,
      sessionId,
      step: 'stripe_started',
      onboardingStatus: 'påbörjad',
      user: {
        email: session.user.email,
        name: session.user.name,
        sub: session.user.sub,
      },
      data: {
        accountId: account.id,
      },
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    });

    return NextResponse.json({ url: accountLink.url, accountId: account.id });
  } catch (error) {
    console.error('[Stripe] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
