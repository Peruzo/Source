import { siteBuilderHandlers } from '@/lib/site-builder/server';

// Generering med Server-Sent Events: se lib/site-builder/handlers.ts. Anropet kan pågå länge;
// Cloud Run-tjänstens tidsgräns är 3 600 s (cloudbuild.yaml), liksom klientens.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 3600;

export async function POST(request: Request) {
  return siteBuilderHandlers().generate(request);
}
