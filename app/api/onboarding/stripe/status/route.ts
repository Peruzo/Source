import { NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * KRITISK: Stripe SDK-init sker på runtime (request scope), inte module scope.
 * Detta förhindrar SDK-init under build och gör att env-validering sker vid runtime.
 */
function getStripeClient(): Stripe | null {
  const stripeSecretKey = process.env.STRIPE_PLATFORM_SECRET;
  
  if (!stripeSecretKey) {
    // Warning är OK, men får inte kasta eller blockera build
    console.warn('[Stripe] STRIPE_PLATFORM_SECRET not configured');
    return null;
  }
  
  return new Stripe(stripeSecretKey, { apiVersion: '2025-12-15.clover' });
}

export async function GET(request: Request) {
  try {
    // Initiera Stripe SDK på runtime (request scope)
    const stripe = getStripeClient();
    
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
