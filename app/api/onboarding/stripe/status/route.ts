import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_PLATFORM_SECRET;

if (!stripeSecretKey) {
  console.warn('[Stripe] STRIPE_PLATFORM_SECRET not configured');
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
  : null;

export async function GET(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ success: false, message: 'Missing accountId' }, { status: 400 });
    }

    const account = await stripe.accounts.retrieve(accountId);
    return NextResponse.json({
      success: true,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });
  } catch (error) {
    console.error('[Stripe Status] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
