import type { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

/**
 * Auth0 route handler för App Router.
 * Exponerar GET /api/auth/login, /api/auth/callback, /api/auth/logout.
 * Samma request hanteras av middleware; denna route säkerställer att
 * /api/auth/* alltid får ett svar (t.ex. om middleware returnerar next() vid fel).
 * returnTo (t.ex. /onboarding/questions) läses av SDK från query och används efter callback.
 */
export async function GET(
  request: NextRequest,
  _context: { params: Promise<{ auth0: string[] }> }
) {
  return auth0.middleware(request);
}
