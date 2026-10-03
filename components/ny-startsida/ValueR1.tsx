'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { VALUE as ValueContent } from './content';

// Texten kommer som props från serverkomponenten NyStartsida, så att ./content inte hamnar
// i en klientchunk.
type ValueProps = { value: typeof ValueContent };

/*
 * REDESIGN 1, PASS 9: kopia av Value (../sections.tsx) med ett visuellt moment. Texten och
 * dess ordning är exakt densamma. Runt texten ligger små, flata kort för separata, generiska
 * verktyg ("kaoset"). Allt styrs av scrollpositionen, utan sticky-läge eller kapning:
 *   - Varje rad tänds (opacitet 0,4 → 1 på mörk text, vilket ger dagens grå → mörk) när dess
 *     mitt passerar LIGHT_AT av visningsytan, och stryks sedan över (scaleX). Radens kort
 *     glider bort från texten och tonar ut.
 *   - "Eller ett för allt." tänds, och kundportalfönstret under texten tonas fram med fyra
 *     rader och gröna bockar. Fönstret är slutläget (PASS 9B: bron med pills är borttagen).
 * Spelas en gång: när alla kort har tonat ut och fönstret har landat sparas CHAOS_KEY i
 * sessionStorage och slutläget visas därefter direkt (inline-skriptet i PageR1 sätter
 * html[data-r1-chaos-done] före målning).
 */

export const CHAOS_KEY = 'r1-chaos-done';
const LIGHT_AT = 0.62; // radens mitt passerar 62 % av visningsytan
const RAMP = 0.14; // varje rad tar 14 % av visningsytans höjd att tändas och strykas
// PASS 9B: korten börjar glida först CARD_DELAY efter att raden har strukits över och tar
// CARD_SPAN på sig (båda som andel av visningsytans höjd i scroll). Förut började de vid
// 30 % av radens förlopp och tog 0,098 (0,7 × RAMP).
const CARD_DELAY = 0.06;
const CARD_SPAN = 0.196;
const DRIFT = 80; // så långt korten glider bort från texten (px)
const DIM = 0.4; // mörk text med 0,4 i opacitet på #f3f3f0 ger dagens grå (#999997 mot #9a9a94)

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

type CardKind = 'kassa' | 'kalender' | 'fakturor' | 'kalkylark' | 'bokforing' | 'mejl' | 'chatt';
type CardDef = { kind: CardKind; line: number; zone: 'text' | 'portal'; mobile: boolean };

// Koppling rad → kort enligt uppdraget. mobile: de fyra som visas under 1024 px.
const CARDS: CardDef[] = [
  { kind: 'kassa', line: 0, zone: 'text', mobile: true },
  { kind: 'kalender', line: 0, zone: 'text', mobile: false },
  { kind: 'fakturor', line: 1, zone: 'text', mobile: true },
  { kind: 'kalkylark', line: 1, zone: 'text', mobile: false },
  { kind: 'bokforing', line: 2, zone: 'portal', mobile: true },
  { kind: 'mejl', line: 3, zone: 'portal', mobile: true },
  { kind: 'chatt', line: 3, zone: 'text', mobile: false },
];

const PORTAL_ROWS = ['Butik', 'Fakturor', 'Bokföring', 'Utskick'];

function readDone() {
  try {
    return window.sessionStorage.getItem(CHAOS_KEY) === '1';
  } catch {
    return false;
  }
}
function writeDone() {
  try {
    window.sessionStorage.setItem(CHAOS_KEY, '1');
  } catch {}
}

/* ---------- korten: titelrad och neutrala rader ---------- */
function Bar({ w, tone }: { w: string; tone?: 'dark' | 'accent' }) {
  return <span className={`r1-cc-bar${tone ? ` r1-cc-bar-${tone}` : ''}`} style={{ width: w }} />;
}
function CardBody({ kind }: { kind: CardKind }): ReactNode {
  switch (kind) {
    case 'kassa':
      return (
        <>
          <span className="r1-cc-row"><Bar w="58%" /><Bar w="18%" /></span>
          <span className="r1-cc-row"><Bar w="46%" /><Bar w="18%" /></span>
          <span className="r1-cc-row"><Bar w="52%" /><Bar w="18%" /></span>
          <span className="r1-cc-rule" />
          <span className="r1-cc-row"><Bar w="30%" tone="dark" /><Bar w="22%" tone="dark" /></span>
          <span className="r1-cc-btn"><span className="r1-cc-dot" /></span>
        </>
      );
    case 'kalender':
      return (
        <span className="r1-cc-grid r1-cc-grid-7">
          {Array.from({ length: 21 }, (_, i) => (
            <span key={i} className={`r1-cc-cell${i === 9 ? ' r1-cc-cell-on' : ''}`} />
          ))}
        </span>
      );
    case 'fakturor':
      return (
        <>
          {[62, 48, 56, 40].map((w, i) => (
            <span key={i} className="r1-cc-row">
              <span className={`r1-cc-dot${i === 1 ? '' : ' r1-cc-dot-mute'}`} />
              <Bar w={`${w}%`} />
              <Bar w="16%" />
            </span>
          ))}
        </>
      );
    case 'kalkylark':
      return (
        <span className="r1-cc-grid r1-cc-grid-4">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className={`r1-cc-sheet${i < 4 ? ' r1-cc-sheet-head' : ''}`} />
          ))}
        </span>
      );
    case 'bokforing':
      return (
        <>
          <span className="r1-cc-row"><Bar w="38%" tone="dark" /><Bar w="38%" tone="dark" /></span>
          {[0, 1, 2].map((i) => (
            <span key={i} className="r1-cc-row r1-cc-ledger">
              <Bar w="40%" />
              <Bar w="40%" />
            </span>
          ))}
        </>
      );
    case 'mejl':
      return (
        <>
          <span className="r1-cc-field"><span className="r1-cc-label">Till</span><Bar w="62%" /></span>
          <span className="r1-cc-field"><span className="r1-cc-label">Ämne</span><Bar w="48%" /></span>
          <Bar w="92%" />
          <Bar w="80%" />
          <Bar w="56%" />
        </>
      );
    case 'chatt':
      return (
        <>
          <span className="r1-cc-bubble"><Bar w="100%" /></span>
          <span className="r1-cc-bubble r1-cc-bubble-me"><Bar w="100%" tone="dark" /></span>
          <span className="r1-cc-bubble"><Bar w="100%" /></span>
        </>
      );
  }
}
const CARD_TITLE: Record<CardKind, string> = {
  kassa: 'Kassa',
  kalender: 'Kalender',
  fakturor: 'Fakturor',
  kalkylark: 'Kalkylark',
  bokforing: 'Bokföring',
  mejl: 'Nytt mejl',
  chatt: 'Chatt',
};

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="r1-portal-check" aria-hidden="true">
      <circle cx="10" cy="10" r="10" />
      <path d="M5.8 10.4l2.7 2.7 5.7-6" />
    </svg>
  );
}

export function ValueR1({ value: VALUE }: ValueProps) {
  const secRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const txtRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const strikeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const portalRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (readDone()) {
      setDone(true);
      return;
    }
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) {
      setDone(true);
      return;
    }
    const sec = secRef.current;
    if (!sec) return;
    let raf = 0;
    let finished = false;

    // kortens riktning bort från texten: från textblockets mitt mot kortets mitt
    const dirs = new Map<number, { x: number; y: number }>();
    const measureDirs = () => {
      const text = sec.querySelector('.rd-value-h')!.getBoundingClientRect();
      const cx = text.left + text.width / 2;
      const cy = text.top + text.height / 2;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = '';
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - cx;
        const dy = r.top + r.height / 2 - cy;
        // Under 1024 px ligger korten ovanför och under texten: de glider rakt åt sidan, så att
        // de inte lämnar sektionen uppåt in i heron eller nedåt mot fönstret.
        if (window.innerWidth < 1024) {
          dirs.set(i, { x: dx < 0 ? -1 : 1, y: 0 });
          return;
        }
        const n = Math.hypot(dx, dy) || 1;
        dirs.set(i, { x: dx / n, y: dy / n });
      });
    };

    const update = () => {
      raf = 0;
      if (finished) return;
      const vh = window.innerHeight;
      // p: hur långt radens mitt har passerat LIGHT_AT, som andel av visningsytan (ej begränsad)
      const p = lineRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return (vh * LIGHT_AT - (r.top + r.height / 2)) / vh;
      });
      const t = p.map((v) => clamp(v / RAMP));
      // rad 1–4: tänds, stryks, korten glider bort
      for (let i = 0; i < 5; i++) {
        const txt = txtRefs.current[i];
        if (txt) txt.style.opacity = String(DIM + (1 - DIM) * clamp(t[i] / 0.45));
        const st = strikeRefs.current[i];
        if (st) st.style.transform = `scaleX(${clamp((t[i] - 0.5) / 0.5)})`;
      }
      let allGone = true;
      let zoneMin = 1;
      CARDS.forEach((c, i) => {
        const k = clamp((p[c.line] - RAMP - CARD_DELAY) / CARD_SPAN);
        if (k < 1) allGone = false;
        if (c.zone === 'portal') zoneMin = Math.min(zoneMin, k);
        const el = cardRefs.current[i];
        const d = dirs.get(i);
        if (!el || !d) return;
        el.style.transform = `translate(${d.x * DRIFT * k}px, ${d.y * DRIFT * k}px) rotate(var(--rot))`;
        el.style.opacity = String(1 - k);
      });
      // "Eller ett för allt.": kundportalfönstret. Under 1024 px ligger två kort i fönstrets
      // zon, så där väntar fönstret tills de är halvvägs uttonade (annars syns de genom det).
      let tp = clamp((t[4] - 0.45) / 0.55);
      if (window.innerWidth < 1024) tp = Math.min(tp, clamp((zoneMin - 0.5) / 0.5));
      const portal = portalRef.current;
      if (portal) {
        portal.style.opacity = String(tp);
        portal.style.transform = `translateY(${(1 - tp) * 24}px) scale(${0.96 + 0.04 * tp})`;
      }
      rowRefs.current.forEach((row, j) => {
        if (row) row.style.opacity = String(clamp((tp - 0.2 - j * 0.12) / 0.4));
      });
      // klart: alla kort borta och fönstret med alla rader på plats
      if (allGone && tp >= 1) {
        finished = true;
        writeDone();
        setDone(true);
      }
    };
    // Varje scroll begär en ny bildruta (en väntande som aldrig körs får inte låsa uppdateringen).
    const kick = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measureDirs();
      kick();
    };
    measureDirs();
    update();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const line = (i: number, content: ReactNode, close = false) => (
    <span
      key={i}
      ref={(el) => {
        lineRefs.current[i] = el;
      }}
      className={`rd-value-line rd-reveal r1-vline${close ? ' rd-value-close' : ''}`}
      style={close ? undefined : ({ ['--i' as string]: i } as CSSProperties)}
    >
      <span className="r1-vline-inner">
        <span
          ref={(el) => {
            txtRefs.current[i] = el;
          }}
          className="r1-vline-txt"
        >
          {content}
        </span>
        {!close && (
          <span
            ref={(el) => {
              strikeRefs.current[i] = el;
            }}
            className="r1-vline-strike"
            aria-hidden="true"
          />
        )}
      </span>
    </span>
  );

  const card = (c: CardDef, i: number) => (
    <div
      key={c.kind}
      ref={(el) => {
        cardRefs.current[i] = el;
      }}
      className={`r1-cc r1-cc-${c.kind}${c.mobile ? '' : ' r1-cc-desk'}`}
      aria-hidden="true"
    >
      <span className="r1-cc-title">{CARD_TITLE[c.kind]}</span>
      <span className="r1-cc-body">
        <CardBody kind={c.kind} />
      </span>
    </div>
  );

  return (
    <section ref={secRef} id="next-section" className="rd-value r1-value" data-done={done ? '' : undefined}>
      {/* Behåll #value-proposition för befintliga länkar / SEO (som i dagens komponent). */}
      <span id="value-proposition" className="rd-sr" aria-hidden="true" />
      <div className="r1-value-text">
        {CARDS.map((c, i) => (c.zone === 'text' ? card(c, i) : null))}
        <h2 className="rd-value-h">
          {VALUE.lines.map((l, i) => line(i, l))}
          {line(
            4,
            <>
              {VALUE.closingBefore}
              <span className="rd-accent">{VALUE.closingAccent}</span>
              {VALUE.closingAfter}
            </>,
            true,
          )}
        </h2>
      </div>
      <div className="r1-portal-zone">
        {CARDS.map((c, i) => (c.zone === 'portal' ? card(c, i) : null))}
        <div ref={portalRef} className="r1-portal">
          <p className="r1-portal-title">
            <span className="r1-cc-dot" aria-hidden="true" />
            Kundportal
          </p>
          <ul className="r1-portal-rows">
            {PORTAL_ROWS.map((r, j) => (
              <li
                key={r}
                ref={(el) => {
                  rowRefs.current[j] = el;
                }}
                className="r1-portal-row"
              >
                <Check />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
