import { Suspense } from 'react';
import { CodeUploadForm } from './code-upload-form';

/**
 * KRITISK: Onboarding-sidor kräver INTE Auth0.
 * Custom signup + onboarding måste fungera helt utan Auth0.
 * Auth0 är ett val, inte ett hinder.
 * 
 * Next.js 15 App Router: force-dynamic för useSearchParams()
 */
export const dynamic = 'force-dynamic';

export default async function CodePage() {
  // Tillåt anonyma sessioner - frontend hanterar sessionId via cookie/hook
  // Suspense för useSearchParams() i client-komponent
  return (
    <Suspense fallback={<div>Laddar...</div>}>
      <CodeUploadForm />
    </Suspense>
  );
}
