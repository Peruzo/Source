import { NextResponse } from 'next/server';
import { userOwnsOnboarding } from '@/lib/storage/onboarding-sessions';

export { userOwnsOnboarding };

/**
 * Enhetligt 404-svar för onboarding-routes.
 *
 * Används både när anroparen saknar session och när onboardingId inte tillhör
 * anroparen. Svaret skiljer avsiktligt inte på fallen, så att ett giltigt id
 * inte kan bekräftas genom att jämföra svar.
 */
export function onboardingNotFound(): NextResponse {
  return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 });
}

/**
 * Ägarskapsgrind för routes som tar emot onboardingId från klienten.
 *
 * Returnerar ett 404-svar som routen ska returnera direkt om userSub saknas
 * eller om onboardingId inte är bundet till userSub, annars null.
 *
 *   const denied = await requireOnboardingOwner(userSub, onboardingId);
 *   if (denied) return denied;
 */
export async function requireOnboardingOwner(
  userSub: string | null | undefined,
  onboardingId: string
): Promise<NextResponse | null> {
  if (!userSub) {
    return onboardingNotFound();
  }
  const owns = await userOwnsOnboarding(userSub, onboardingId);
  if (!owns) {
    console.warn('[Onboarding Ownership] Denied: onboardingId not bound to caller', { onboardingId });
    return onboardingNotFound();
  }
  return null;
}
