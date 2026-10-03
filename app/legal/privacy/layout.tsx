import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasDraftMarkers } from './content';

// Läs APP_BASE_URL vid varje anrop, inte vid bygget: prod och dev byggs identiskt.
export const dynamic = 'force-dynamic';

// Dev-tjänstens APP_BASE_URL (Cloud Run-tjänsten source-develop) samt lokal utveckling.
const DRAFT_ALLOWED_HOSTS = new Set([
  'source-develop-809785351172.europe-north1.run.app',
  'localhost',
  '127.0.0.1',
]);

function isDevOrLocalhost(): boolean {
  const raw = (process.env.APP_BASE_URL || '').trim();
  if (!raw) return false;
  try {
    return DRAFT_ALLOWED_HOSTS.has(new URL(raw).hostname);
  } catch {
    return false;
  }
}

export function generateMetadata(): Metadata {
  return {
    title: { absolute: 'Integritetspolicy – Source Solutions' },
    ...(hasDraftMarkers() ? { robots: { index: false, follow: false } } : {}),
  };
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  // Utkast med oifyllda markeringar visas bara i dev och lokalt; okänd eller saknad miljö ger 404.
  if (hasDraftMarkers() && !isDevOrLocalhost()) notFound();
  return children;
}
