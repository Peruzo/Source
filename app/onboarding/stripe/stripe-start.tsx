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
    window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}&screen_hint=signup`;
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
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.15)'
          }}>
            {/* Modal header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #f0fdf4',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, color: '#111827', fontSize: '18px', fontWeight: 700 }}>
                Allmänna Villkor & Integritetspolicy
              </h2>
              <button
                onClick={() => setShowTermsModal(false)}
                style={{
                  background: '#f3f4f6', border: 'none', color: '#6b7280',
                  fontSize: '16px', cursor: 'pointer', padding: '6px 10px',
                  borderRadius: '8px'
                }}
              >✕</button>
            </div>

            {/* Scroll indicator */}
            {!hasScrolledToBottom && (
              <div style={{
                background: '#f0fdf4',
                borderBottom: '1px solid #d1fae5',
                padding: '8px 24px',
                color: '#059669',
                fontSize: '13px',
                textAlign: 'center',
                fontWeight: 500
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
                color: '#374151',
                fontSize: '14px',
                lineHeight: '1.7'
              }}
            >
              <h3 style={{ color: '#10b981', marginTop: 0 }}>Allmänna Villkor (Terms of Service)</h3>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Source Solutions AB — Senast uppdaterad: 2026-04-10</p>

              {[
                { num: '§1', title: 'Definitioner', text: '"Bolaget": Source Solutions AB. "Tjänsten": SaaS-plattform inklusive kundportal, analys, kommunikation, hosting, domän och betalningar. "Kund": användare av Tjänsten.' },
                { num: '§2', title: 'Avtalets omfattning', text: 'Bolaget tillhandahåller teknisk infrastruktur. Kunden ansvarar för användning och laglighet.' },
                { num: '§3', title: 'Konto', text: 'Kunden ansvarar för konto, åtkomst och säkerhet.' },
                { num: '§4', title: 'Användning', text: 'Förbjudet: olaglig användning, behandling utan laglig grund, intrång. Kunden ansvarar för att följa tillämplig lagstiftning.' },
                { num: '§5', title: 'Multi-tenant', text: 'Kunden = personuppgiftsansvarig. Bolaget = personuppgiftsbiträde. Säkerhet enligt ISO/IEC 27001 och SOC 2 Type II.' },
                { num: '§6', title: 'Dataskydd', text: 'DPA enligt GDPR art. 28 måste vara ingånget innan behandling av personuppgifter påbörjas. Bolaget bistår Kunden enligt GDPR.' },
                { num: '§7', title: 'Spårning och profilering', text: 'Profilering används för analys. Rättslig grund: samtycke eller berättigat intresse. Kunden ansvarar för CMP och Google Consent Mode v2.' },
                { num: '§8', title: 'AI', text: 'AI används som stöd. Vid GDPR art. 22 ska människa kunna påverka beslut. Kunden garanterar efterlevnad.' },
                { num: '§9', title: 'Betalningar', text: 'Stripe används. Bolaget lagrar inte kortdata. Stripe är PCI-DSS Level 1-certifierad. Kunden ansvarar för chargebacks och betalningsrelaterade tvister.' },
                { num: '§10', title: 'Avgifter', text: 'Abonnemang eller usage. Ej återbetalning om ej annat anges. Vid gratis testperiod informeras Kunden innan debitering.' },
                { num: '§11', title: 'Tredjepart', text: 'Bolaget ansvarar för implementation, konfiguration, API och datamappning.' },
                { num: '§12', title: 'Underbiträden', text: 'Stripe, Auth0, Fortnox, Google, Meta, TikTok, LinkedIn, SendGrid används. Ändringar meddelas minst 14 dagar i förväg.' },
                { num: '§13', title: 'Dataöverföring', text: 'Sker via SCC eller EU-US DPF. Information om skyddsåtgärder tillhandahålls på begäran.' },
                { num: '§14', title: 'Hosting och DNS', text: 'Ingen garanti för tillgänglighet. Bolaget ansvarar inte för innehåll publicerat av Kunden.' },
                { num: '§15', title: 'DSA och innehåll', text: 'Kontakt: legal@sourcesolutions.se. Anmälan hanteras inom 24–72h.' },
                { num: '§16', title: 'Säkerhet', text: 'Skydd enligt ISO/IEC 27001 och SOC 2 Type II eller motsvarande.' },
                { num: '§17', title: 'Incidenter', text: 'Meddelas inom 48 timmar från det att Bolaget fått kännedom.' },
                { num: '§18', title: 'Ansvarsbegränsning', text: 'Bolaget ansvarar inte för indirekta skador. Ansvar begränsas till avgifter senaste 6 månader eller 10 000 SEK.' },
                { num: '§19', title: 'Skadeslöshet', text: 'Kunden ersätter Bolaget för krav inklusive regulatoriska sanktioner.' },
                { num: '§20', title: 'Uppsägning', text: 'Kunden kan avsluta när som helst. Bolaget kan avsluta vid säkerhetsrisk eller lagkrav.' },
                { num: '§21', title: 'Data', text: 'Raderas inom 30–90 dagar. Bekräftelse kan begäras.' },
                { num: '§22', title: 'Ändringar', text: 'Meddelas minst 30 dagar i förväg. Kunden har rätt att säga upp avtalet.' },
                { num: '§23', title: 'Lag', text: 'Svensk lag gäller. Tvister avgörs av svensk domstol.' },
              ].map((section) => (
                <div key={section.num} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                  <h4 style={{ color: '#10b981', margin: '0 0 6px', fontSize: '14px' }}>{section.num} {section.title}</h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{section.text}</p>
                </div>
              ))}

              <div style={{ marginTop: '20px', padding: '14px 16px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #d1fae5' }}>
                <p style={{ margin: 0, color: '#059669', fontSize: '13px' }}>
                  Fullständiga villkor: {' '}
                  <a href="/legal/terms" target="_blank" style={{ color: '#10b981', fontWeight: 600 }}>Användarvillkor</a>
                  {' '}&{' '}
                  <a href="/legal/privacy" target="_blank" style={{ color: '#10b981', fontWeight: 600 }}>Integritetspolicy</a>
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'flex-end',
              background: '#fafafa'
            }}>
              {!hasScrolledToBottom && (
                <span style={{ color: '#9ca3af', fontSize: '13px', marginRight: 'auto' }}>
                  Scrolla ner för att aktivera godkännande
                </span>
              )}
              <button
                onClick={() => setShowTermsModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '10px',
                  border: '1px solid #e5e7eb', background: '#fff',
                  color: '#6b7280', cursor: 'pointer', fontSize: '14px'
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
                  padding: '10px 24px', borderRadius: '10px',
                  background: hasScrolledToBottom ? '#10b981' : '#e5e7eb',
                  color: hasScrolledToBottom ? '#fff' : '#9ca3af',
                  border: 'none',
                  cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed',
                  fontSize: '14px', fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {hasScrolledToBottom ? '✓ Jag godkänner villkoren' : 'Läs villkoren först...'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main page */}
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <img src="/twogreenarrows.png" alt="Source" style={{ height: '48px', width: 'auto' }} />
          </div>

          <h1 style={{ color: '#111827', fontSize: '28px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
            Nästan klart!
          </h1>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '40px', fontSize: '16px', lineHeight: 1.6 }}>
            Läs och godkänn våra villkor för att aktivera betalningar.
          </p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
              <p style={{ margin: 0, color: '#dc2626', fontSize: '14px' }}>{typeof error === 'string' ? error : normalizeError(error)}</p>
            </div>
          )}

          {/* Terms card */}
          <div style={{
            border: termsAccepted ? '2px solid #10b981' : '2px solid #e5e7eb',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '24px',
            background: termsAccepted ? '#f0fdf4' : '#fff',
            transition: 'all 0.3s',
            cursor: termsAccepted ? 'default' : 'pointer'
          }}
            onClick={() => !termsAccepted && setShowTermsModal(true)}
          >
            {termsAccepted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#10b981', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0
                }}>
                  <span style={{ color: '#fff', fontSize: '20px' }}>✓</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: '#065f46', fontWeight: 600, fontSize: '15px' }}>Villkor godkända</p>
                  <p style={{ margin: '2px 0 0', color: '#059669', fontSize: '13px' }}>Du har läst och godkänt användarvillkoren och integritetspolicyn.</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setTermsAccepted(false); setHasScrolledToBottom(false); }}
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
                >
                  Ångra
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#f3f4f6', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0
                }}>
                  <span style={{ fontSize: '20px' }}>📋</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: '#111827', fontWeight: 600, fontSize: '15px' }}>Läs & godkänn villkor</p>
                  <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '13px' }}>
                    Klicka för att läsa användarvillkor och integritetspolicy
                  </p>
                </div>
                <span style={{ color: '#10b981', fontSize: '20px' }}>›</span>
              </div>
            )}
          </div>

          {/* CTA button */}
          <button
            type="button"
            onClick={startStripe}
            disabled={loading || !termsAccepted}
            style={{
              width: '100%', padding: '16px', borderRadius: '14px',
              background: termsAccepted ? '#10b981' : '#f3f4f6',
              color: termsAccepted ? '#fff' : '#9ca3af',
              border: 'none',
              cursor: termsAccepted ? 'pointer' : 'not-allowed',
              fontSize: '16px', fontWeight: 700,
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Förbereder...' : 'Starta Stripe onboarding →'}
          </button>

          {!termsAccepted && (
            <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
              Godkänn villkoren för att fortsätta
            </p>
          )}

        </div>
      </div>
    </>
  );
}
