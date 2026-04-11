'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getOrCreateSessionId } from '@/lib/onboarding/storage';
import { useOnboardingState } from '@/lib/onboarding/backend-state';
import { useOnboardingId } from '@/lib/onboarding/use-onboarding-id';
import { normalizeError } from '@/lib/utils/normalize-error';

export function StripeStart() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shouldAutoStart = searchParams.get('autostart') === 'true';
  const { onboardingId, userSub, loading: onboardingIdLoading, error: onboardingIdError } = useOnboardingId();
  const { state, loading: stateLoading } = useOnboardingState(userSub || '', onboardingId);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const termsScrollRef = useRef<HTMLDivElement>(null);
  const autoStartedRef = useRef(false);

  const loadingState = onboardingIdLoading || stateLoading;

  useEffect(() => {
    // Använd userSub från hook (Auth0 eller anonym sessionId)
    if (userSub) {
      setSessionId(userSub);
    }
  }, [userSub]);

  const loginWithRedirect = (options: { appState?: { returnTo: string } }) => {
    const returnTo = options.appState?.returnTo || pathname;
    window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
    if (isAtBottom) setHasScrolledToBottom(true);
  };

  // Visa fel om onboardingId saknas
  useEffect(() => {
    if (onboardingIdError) {
      setError(`Kunde inte initiera onboarding: ${onboardingIdError}`);
    }
  }, [onboardingIdError]);

  // Auto-start Stripe efter återkomst från Auth0 (returnTo med ?autostart=true)
  useEffect(() => {
    if (shouldAutoStart && !loadingState && onboardingId && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startStripe();
    }
  }, [shouldAutoStart, loadingState, onboardingId]);

  // FSM: Backend-driven guards baserat på formell status
  // Status är enda sanningskällan - inga heuristiska kontroller
  useEffect(() => {
    if (loadingState) return;
    if (!state) return;

    if (state.status === 'started') {
      router.replace('/onboarding/questions');
      return;
    }

    if (state.status === 'code_pending') {
      router.replace('/onboarding/code');
      return;
    }

    if (state.status === 'ready_for_review') {
      router.replace('/onboarding/success');
      return;
    }

    // Tillåt:
    // questions_completed
    // code_completed
    // stripe_started
    // stripe_completed
  }, [state, loadingState, router]);

  const startStripe = async () => {
    if (!onboardingId) {
      setError('Onboarding är inte initierat. Ladda om sidan.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, onboardingId }),
      });

      if (response.status === 401) {
        await loginWithRedirect({ appState: { returnTo: pathname } });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Ett fel uppstod. Försök igen.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      setError(normalizeError(err));
      setLoading(false);
    }
  };

  return (
    <>
      {/* Terms Modal */}
      {showTermsModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div style={{
            background: '#0f1a0f',
            border: '1px solid #1e3a1e',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #1e3a1e',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, color: '#f0fdf4', fontSize: '18px', fontWeight: 700 }}>
                Allmänna Villkor & Integritetspolicy
              </h2>
              <button
                onClick={() => setShowTermsModal(false)}
                style={{
                  background: 'none', border: 'none', color: '#86efac',
                  fontSize: '20px', cursor: 'pointer', padding: '4px 8px'
                }}
              >✕</button>
            </div>

            {/* Scroll indicator */}
            {!hasScrolledToBottom && (
              <div style={{
                background: 'rgba(34,197,94,0.1)',
                borderBottom: '1px solid rgba(34,197,94,0.2)',
                padding: '8px 24px',
                color: '#86efac',
                fontSize: '13px',
                textAlign: 'center'
              }}>
                📜 Scrolla ner för att läsa hela villkoren och godkänna
              </div>
            )}

            {/* Scrollable content */}
            <div
              onScroll={handleTermsScroll}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                color: '#e2e8f0',
                fontSize: '14px',
                lineHeight: '1.7'
              }}
            >
              <h3 style={{ color: '#4ade80', marginTop: 0 }}>Allmänna Villkor (Terms of Service)</h3>
              <p style={{ color: '#86efac' }}>Source Solutions AB — Senast uppdaterad: 2026-04-10</p>

              {[
                { num: '§1', title: 'Definitioner', text: '"Bolaget": Source Solutions AB. "Tjänsten": SaaS-plattform inklusive kundportal, analys, kommunikation, hosting, domän och betalningar. "Kund": användare av Tjänsten. "Slutanvändare": individ vars data behandlas av Kunden via Tjänsten.' },
                { num: '§2', title: 'Avtalets omfattning', text: 'Bolaget tillhandahåller teknisk infrastruktur. Kunden ansvarar för användning och laglighet.' },
                { num: '§3', title: 'Konto', text: 'Kunden ansvarar för konto, åtkomst och säkerhet.' },
                { num: '§4', title: 'Användning', text: 'Förbjudet: olaglig användning, behandling utan laglig grund, intrång. Kunden ansvarar för att följa tillämplig lagstiftning.' },
                { num: '§5', title: 'Multi-tenant', text: 'Kunden = personuppgiftsansvarig. Bolaget = personuppgiftsbiträde. Säkerhet enligt ISO/IEC 27001 och SOC 2 Type II.' },
                { num: '§6', title: 'Dataskydd', text: 'DPA enligt GDPR art. 28 måste vara ingånget innan behandling av personuppgifter påbörjas. Bolaget bistår Kunden enligt GDPR, inklusive hantering av registrerades rättigheter.' },
                { num: '§7', title: 'Spårning och profilering', text: 'Profilering används för analys. Rättslig grund: samtycke eller berättigat intresse. Kunden ansvarar för CMP, Google Consent Mode v2 och efterlevnad av GDPR och ePrivacy.' },
                { num: '§8', title: 'AI', text: 'AI används som stöd. Vid GDPR art. 22 ska människa kunna påverka beslut. Kunden garanterar efterlevnad.' },
                { num: '§9', title: 'Betalningar', text: 'Stripe används. Bolaget lagrar inte kortdata och är inte del av PCI CDE. Stripe är PCI-DSS Level 1-certifierad. Kunden ansvarar för chargebacks och betalningsrelaterade tvister.' },
                { num: '§10', title: 'Avgifter', text: 'Abonnemang eller usage. Ej återbetalning om ej annat anges. Vid gratis testperiod informeras Kunden innan debitering.' },
                { num: '§11', title: 'Tredjepart', text: 'Bolaget ansvarar endast för implementation, konfiguration, API och datamappning.' },
                { num: '§12', title: 'Underbiträden', text: 'Stripe, Auth0, Fortnox, Google, Meta, TikTok, LinkedIn, SendGrid används. Ändringar meddelas minst 14 dagar i förväg.' },
                { num: '§13', title: 'Dataöverföring', text: 'Sker via SCC eller EU-US DPF. Information om skyddsåtgärder tillhandahålls på begäran.' },
                { num: '§14', title: 'Hosting och DNS', text: 'Ingen garanti för tillgänglighet. Bolaget ansvarar inte för innehåll publicerat av Kunden.' },
                { num: '§15', title: 'DSA och innehåll', text: 'Kontakt: legal@sourcesolutions.se. Anmälan hanteras inom 24–72h. Akut innehåll tas bort direkt.' },
                { num: '§16', title: 'Säkerhet', text: 'Skydd enligt ISO/IEC 27001 och SOC 2 Type II eller motsvarande.' },
                { num: '§17', title: 'Incidenter', text: 'Meddelas inom 48 timmar från det att Bolaget fått kännedom.' },
                { num: '§18', title: 'Ansvarsbegränsning', text: 'Bolaget ansvarar inte för indirekta skador. Ansvar begränsas till avgifter senaste 6 månader eller 10 000 SEK.' },
                { num: '§19', title: 'Skadeslöshet', text: 'Kunden ersätter Bolaget för krav inklusive regulatoriska sanktioner.' },
                { num: '§20', title: 'Uppsägning', text: 'Kunden kan avsluta när som helst. Bolaget kan avsluta vid säkerhetsrisk eller lagkrav.' },
                { num: '§21', title: 'Data', text: 'Raderas inom 30–90 dagar. Bekräftelse kan begäras.' },
                { num: '§22', title: 'Ändringar', text: 'Meddelas minst 30 dagar i förväg. Kunden har rätt att säga upp avtalet.' },
                { num: '§23', title: 'Lag', text: 'Svensk lag gäller. Tvister avgörs av svensk domstol.' },
              ].map((section) => (
                <div key={section.num} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(34,197,94,0.1)' }}>
                  <h4 style={{ color: '#4ade80', margin: '0 0 8px' }}>{section.num} {section.title}</h4>
                  <p style={{ margin: 0, color: '#cbd5e1' }}>{section.text}</p>
                </div>
              ))}

              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(34,197,94,0.08)', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.2)' }}>
                <p style={{ margin: 0, color: '#86efac', fontSize: '13px' }}>
                  Fullständiga villkor finns på{' '}
                  <a href="/legal/terms" target="_blank" style={{ color: '#4ade80' }}>yoursource.se/legal/terms</a>
                  {' '}och integritetspolicy på{' '}
                  <a href="/legal/privacy" target="_blank" style={{ color: '#4ade80' }}>yoursource.se/legal/privacy</a>
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #1e3a1e',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              {!hasScrolledToBottom && (
                <span style={{ color: '#6b9e7a', fontSize: '13px', marginRight: 'auto' }}>
                  Scrolla ner för att aktivera godkännande
                </span>
              )}
              <button
                onClick={() => setShowTermsModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px',
                  border: '1px solid #1e3a1e', background: 'transparent',
                  color: '#86efac', cursor: 'pointer', fontSize: '14px'
                }}
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                disabled={!hasScrolledToBottom}
                style={{
                  padding: '10px 24px', borderRadius: '8px',
                  background: hasScrolledToBottom ? 'linear-gradient(135deg,#22c55e,#16a34a)' : '#1e3a1e',
                  color: hasScrolledToBottom ? '#fff' : '#4a7a4a',
                  border: 'none', cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed',
                  fontSize: '14px', fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {hasScrolledToBottom ? 'Jag godkänner villkoren ✓' : 'Läs villkoren först...'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <section style={{
        maxWidth: '600px', margin: '0 auto', padding: '64px 24px',
        background: 'linear-gradient(135deg,#0f1f0f,#0d1a0d)',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#f0fdf4', fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
          Nästan klart!
        </h1>
        <p style={{ color: '#86efac', marginBottom: '40px', fontSize: '16px', lineHeight: 1.7 }}>
          Innan vi kopplar betalningar behöver du läsa och godkänna våra villkor.
        </p>

        {error && <p style={{ color: '#f87171', marginBottom: '16px' }}>{typeof error === 'string' ? error : normalizeError(error)}</p>}

        {/* Terms card */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: termsAccepted ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(34,197,94,0.15)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          transition: 'border-color 0.3s'
        }}>
          {termsAccepted ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <div>
                <p style={{ margin: 0, color: '#4ade80', fontWeight: 600, fontSize: '15px' }}>
                  Villkor godkända
                </p>
                <p style={{ margin: '4px 0 0', color: '#6b9e7a', fontSize: '13px' }}>
                  Du har läst och godkänt användarvillkoren och integritetspolicyn.
                </p>
              </div>
              <button
                onClick={() => { setTermsAccepted(false); setHasScrolledToBottom(false); }}
                style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  color: '#4a7a4a', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline'
                }}
              >
                Ångra
              </button>
            </div>
          ) : (
            <div>
              <p style={{ margin: '0 0 16px', color: '#f0fdf4', fontWeight: 600, fontSize: '15px' }}>
                Läs och godkänn våra villkor
              </p>
              <p style={{ margin: '0 0 20px', color: '#6b9e7a', fontSize: '14px', lineHeight: 1.6 }}>
                För att fortsätta behöver du läsa igenom och godkänna Source användarvillkor och integritetspolicy.
              </p>
              <button
                onClick={() => setShowTermsModal(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', borderRadius: '10px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#4ade80', cursor: 'pointer', fontSize: '14px', fontWeight: 600
                }}
              >
                📋 Läs användarvillkor & integritetspolicy
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={startStripe}
          disabled={loading || !termsAccepted}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px',
            background: termsAccepted ? 'linear-gradient(135deg,#22c55e,#16a34a)' : '#1a2e1a',
            color: termsAccepted ? '#fff' : '#2d5a2d',
            border: 'none', cursor: termsAccepted ? 'pointer' : 'not-allowed',
            fontSize: '16px', fontWeight: 700,
            boxShadow: termsAccepted ? '0 4px 24px rgba(34,197,94,0.25)' : 'none',
            transition: 'all 0.3s'
          }}
        >
          {loading ? 'Förbereder...' : 'Starta Stripe onboarding →'}
        </button>

        {!termsAccepted && (
          <p style={{ color: '#2d5a2d', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
            Du måste godkänna villkoren för att fortsätta
          </p>
        )}
      </section>
    </>
  );
}
