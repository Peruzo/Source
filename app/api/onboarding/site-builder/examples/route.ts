import { siteBuilderHandlers } from '@/lib/site-builder/server';

// Hemsidebyggaren: se lib/site-builder/handlers.ts. Kräver Auth0-session och ägarskap av onboardingId.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  return siteBuilderHandlers().examples(request);
}
