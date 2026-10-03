'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import type { WidgetId } from './content-r1';

// REDESIGN 1, PASS 4: widgetar i kategorisektionen. Samma fönster och språk som pass 3:s
// vyer (vitt platt fönster på stor mjuk yta, accent-600 som enda grönt). Belägg för varje
// påstående står i content-r1.ts. Lätt animerade: en sekvens spelas, står still en stund och
// börjar om. Bara opacitet och transform animeras. Med prefers-reduced-motion visas
// slutläget direkt och inget rör sig. Första renderingen är steg 0 på server och klient.

function useSteps(count: number, stepMs: number, holdMs: number) {
  const reduce = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduce) {
      setStep(count - 1);
      return;
    }
    const delay = step === count - 1 ? holdMs : stepMs;
    const t = setTimeout(() => setStep((s) => (s + 1) % count), delay);
    return () => clearTimeout(t);
  }, [reduce, step, count, stepMs, holdMs]);
  return step;
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="r1w-check">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Frame({ title, label, children }: { title: string; label: string; children: ReactNode }) {
  return (
    <div className="r1v-frame" role="group" aria-label={label}>
      <div className="r1v-bar">
        <span className="r1v-dot" />
        <span>{title}</span>
      </div>
      <div className="r1v-body">{children}</div>
    </div>
  );
}

/* a) Design & e-handel: tre vägar till hemsidan, och AI-hemsidebyggaren som kommer snart. */
const PATHS = [
  { title: 'Vi bygger din hemsida', note: 'Från start, i ditt utseende' },
  { title: 'Vi förbättrar din nuvarande', note: 'Du laddar upp koden, vi tar det därifrån' },
  { title: 'Behåll din hemsida', note: 'Vi kopplar den till kundportalen' },
];
function PathsWidget({ label }: { label: string }) {
  const active = useSteps(3, 2200, 2200);
  return (
    <Frame title="Din hemsida" label={label}>
      <p className="r1v-label">Välj väg</p>
      <ul className="r1w-paths">
        {PATHS.map((p, i) => (
          <li key={p.title} data-active={i === active ? 'true' : undefined}>
            <span className="r1w-radio" aria-hidden="true">
              <span />
            </span>
            <span className="r1w-path-text">
              <span className="r1w-path-title">{p.title}</span>
              <span className="r1w-path-note">{p.note}</span>
            </span>
          </li>
        ))}
      </ul>
      {/* Kommande: inte klickbar, inte färdig. */}
      <div className="r1w-soon" aria-disabled="true">
        <span className="r1w-path-text">
          <span className="r1w-path-title">AI-hemsidebyggare</span>
          <span className="r1w-path-note">Skapar och designar hemsidor med AI</span>
        </span>
        <span className="r1w-soon-pill">Kommer snart</span>
      </div>
    </Frame>
  );
}

/* b) Marknadsföring: AI-assistenten föreslår en plan, och allt samlas på ett ställe. */
function MarketingWidget({ label }: { label: string }) {
  const step = useSteps(5, 1300, 3600);
  return (
    <Frame title="Marknadsföring" label={label}>
      <div className="r1w-chat">
        <p className="r1w-msg r1w-msg-me" data-show={step >= 0 ? 'true' : undefined}>
          Vi vill nå fler kunder i höst.
        </p>
        <p className="r1w-msg r1w-msg-ai" data-show={step >= 1 ? 'true' : undefined}>
          <span className="r1w-who">AI-assistent</span>
          Vilka kanaler vill du använda?
        </p>
        <div className="r1w-options" data-show={step >= 2 ? 'true' : undefined}>
          <span className="r1w-opt r1w-opt-on">Social Media</span>
          <span className="r1w-opt r1w-opt-on">Email Marketing</span>
          <span className="r1w-opt">Google Ads</span>
        </div>
        <div className="r1w-msg r1w-msg-ai r1w-plan" data-show={step >= 3 ? 'true' : undefined}>
          <span className="r1w-who">AI-assistent</span>
          Här är ett förslag på plan för dina kanaler.
          <span className="r1w-plan-card">
            <span>Marknadsföringsplan</span>
            <span className="r1v-pill">Utkast</span>
          </span>
        </div>
      </div>
      <div className="r1w-hub" data-show={step >= 4 ? 'true' : undefined}>
        <p className="r1v-label">Samlat på ett ställe</p>
        <div className="r1w-hub-pills">
          <span className="r1v-pill">Kampanjer</span>
          <span className="r1v-pill">Utskick</span>
          <span className="r1v-pill">Bilder</span>
          <span className="r1v-pill">Kalender</span>
          <span className="r1v-pill">Rapport</span>
        </div>
      </div>
      <p className="r1w-foot">AI-assistenten ingår i Enterprise.</p>
    </Frame>
  );
}

/* c) Ekonomi & logistik: utbetalning → rapport med verifikat → godkänt → Fortnox. */
const PAYOUT_STEPS = [
  { title: 'Utbetalning mottagen', note: 'Från Stripe' },
  { title: 'Bokföringsrapport klar', note: 'Verifikat skapade automatiskt · balanserar' },
  { title: 'Godkänd av dig', note: 'Du granskar innan något skickas' },
  { title: 'Skickat till Fortnox', note: 'Verifikaten finns i din bokföring' },
];
function PayoutWidget({ label }: { label: string }) {
  const step = useSteps(PAYOUT_STEPS.length + 1, 1100, 3400);
  const done = step >= PAYOUT_STEPS.length;
  return (
    <Frame title="Bokföring · Fortnox" label={label}>
      <ol className="r1w-steps">
        {PAYOUT_STEPS.map((s, i) => (
          <li key={s.title} data-show={i <= step ? 'true' : undefined}>
            <span className="r1w-step-icon" aria-hidden="true">
              <Check />
            </span>
            <span className="r1w-path-text">
              <span className="r1w-path-title">{s.title}</span>
              <span className="r1w-path-note">{s.note}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="r1w-confirm" data-show={done ? 'true' : undefined}>
        <Check />
        <span>Klart. Verifikaten är skickade till Fortnox.</span>
      </div>
    </Frame>
  );
}

/* d) Support: illustrerad chatt mellan en kund och en supportperson från Source. */
const CHAT = [
  { from: 'kund', name: 'Robin', text: 'Hej! Hur kopplar jag min hemsida till kundportalen?' },
  {
    from: 'source',
    name: 'Noah · Source',
    text: 'Hej Robin, kul att du hör av dig! Lägg in hemsidans adress under Inställningar → Integrationer, så är den kopplad.',
  },
  { from: 'kund', name: 'Robin', text: 'Klart, nu fungerar det. Tack så mycket!' },
  { from: 'source', name: 'Noah · Source', text: 'Vad roligt! Hör av dig när du vill, vi finns här.' },
];
function SupportWidget({ label }: { label: string }) {
  const step = useSteps(CHAT.length, 1500, 3800);
  return (
    <Frame title="Livechatt med Source" label={label}>
      <p className="r1w-example">Exempel på en chatt</p>
      <div className="r1w-chat">
        {CHAT.map((m, i) => (
          <p
            key={i}
            className={`r1w-msg ${m.from === 'kund' ? 'r1w-msg-me' : 'r1w-msg-ai'}`}
            data-show={i <= step ? 'true' : undefined}
          >
            <span className="r1w-who">{m.name}</span>
            {m.text}
          </p>
        ))}
      </div>
    </Frame>
  );
}

export function CategoryWidget({ widget, label }: { widget: WidgetId; label: string }) {
  if (widget === 'paths') return <PathsWidget label={label} />;
  if (widget === 'marketing') return <MarketingWidget label={label} />;
  if (widget === 'payout') return <PayoutWidget label={label} />;
  return <SupportWidget label={label} />;
}
