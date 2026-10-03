import { siteBuilderHandlers } from '@/lib/site-builder/server';

// Hemsidebyggaren: se lib/site-builder/handlers.ts. Kräver Auth0-session och ägarskap av onboardingId.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  return siteBuilderHandlers().improve(request);
}
