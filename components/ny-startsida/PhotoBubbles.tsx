import type { CSSProperties } from 'react';

// REDESIGN 1, PASS 6: de gröna bubblorna som kod ovanpå de nya fotona i kategorisektionen.
// Alla mått är i cqw (procent av bildens bredd, .r1-photo är container) och kommer från
// mätningen av originalbubblorna i de tidigare kategoribilderna på startsidan (1920 × 1080).
// Varje bubbla har en motsvarighet i originalet och tar dess versalhöjd, padding, radellavstånd,
// hörnradie och färger. Typsnitt: General Sans 500 med -0.02em spärrning (närmast originalet).
// Versalhöjd 0.7175em i General Sans 500 ger font-size = versalhöjd / 0.7175.

const CAP_EM = 0.7175;

type Pill = {
  kind: 'pill';
  lines: string[];
  /** Versalhöjd i procent av bildens bredd. */
  cap: number;
  /** Radavstånd i em. */
  lh: number;
  padX: number;
  padY: number;
  radius: number;
  fill: string;
  color: string;
  /** Placering i procent av bildens bredd (x) och höjd (y). */
  pos: { left?: string; right?: string; top?: string; bottom?: string };
};

type Truck = {
  kind: 'truck';
  lines: string[];
  cap: number;
  lh: number;
  color: string;
  /** Lastbilsikonens bredd och höjd samt avståndet till texten, i procent av bildens bredd. */
  iconW: number;
  iconH: number;
  gap: number;
  pos: { left?: string; right?: string; top?: string; bottom?: string };
};

type Bubble = Pill | Truck;

/* Motsvarigheter i originalen (versal, padding X/Y, radie i % av bredden, radavstånd i em):
   A "Helt skräddarsydd design"   3.125  2.50/2.31  6.02  1.05  #075B3C / #B6DAA9
   B "Mer interaktiv" (ljus)      1.510  1.51/1.47  2.19  1.20  #3AAD89 / #A0DA9A
   C "100% fler konverteringar"   2.135  0.76/2.29  2.86  1.05  #015D43 / #9CCFA1
   D "28 809 nya klickningar"     2.812  1.77/2.55  3.59  0.86  #005D27 / #C3E6B1
   E "Ny Marknadsföringskampanj"  2.865  2.21/2.97  5.08  1.03  #00673B / #ACEDA6
   F "Kampanjtillväxt" (ljus)     1.562  2.24/0.96  2.55  1.10  #32B176 / #F5F9F2
   G "Ny Order"                   3.698  4.92/2.38  4.66  1.20  #08673A / #B2E29A
   H "Leverans slutförd"          3.385  5.16/1.46  4.45  0.98  #02643C / #B8E1B9
   I "Skicka order" (ikon+text)   3.542  ikon 8.44 × 6.15, mellanrum 1.46, 0.87  #C7ECC3 */

export const PHOTO_BUBBLES: Record<string, Bubble[]> = {
  hemsida: [
    { kind: 'pill', lines: ['Din butik,', 'din design'], cap: 3.125, lh: 1.05, padX: 2.5, padY: 2.31, radius: 6.02, fill: '#075B3C', color: '#B6DAA9', pos: { right: '6%', top: '5%' } },
    { kind: 'pill', lines: ['Klar inom 24 timmar'], cap: 1.51, lh: 1.2, padX: 1.51, padY: 1.47, radius: 2.19, fill: '#3AAD89', color: '#A0DA9A', pos: { left: '3%', bottom: '7%' } },
    { kind: 'pill', lines: ['Ny beställning'], cap: 2.135, lh: 1.05, padX: 0.76, padY: 2.29, radius: 2.86, fill: '#015D43', color: '#9CCFA1', pos: { right: '3%', bottom: '9%' } },
  ],
  marknadsforing: [
    { kind: 'pill', lines: ['Kampanjen', 'är live'], cap: 2.812, lh: 0.86, padX: 1.77, padY: 2.55, radius: 3.59, fill: '#005D27', color: '#C3E6B1', pos: { left: '4%', top: '6%' } },
    { kind: 'pill', lines: ['All data', 'på ett ställe'], cap: 2.865, lh: 1.03, padX: 2.21, padY: 2.97, radius: 5.08, fill: '#00673B', color: '#ACEDA6', pos: { right: '2%', top: '4%' } },
    { kind: 'pill', lines: ['AI-förslag:', 'nytt utskick'], cap: 1.562, lh: 1.1, padX: 2.24, padY: 0.96, radius: 2.55, fill: '#32B176', color: '#F5F9F2', pos: { right: '4%', bottom: '24%' } },
  ],
  logistik: [
    { kind: 'pill', lines: ['Ny order'], cap: 3.698, lh: 1.2, padX: 4.92, padY: 2.38, radius: 4.66, fill: '#08673A', color: '#B2E29A', pos: { left: '3%', top: '3%' } },
    { kind: 'pill', lines: ['Packad', 'och klar'], cap: 3.385, lh: 0.98, padX: 5.16, padY: 1.46, radius: 4.45, fill: '#02643C', color: '#B8E1B9', pos: { right: '3%', top: '4%' } },
    { kind: 'truck', lines: ['Skicka', 'order'], cap: 3.542, lh: 0.87, color: '#C7ECC3', iconW: 8.44, iconH: 6.15, gap: 1.46, pos: { left: '6%', top: '74%' } },
  ],
};

function cqw(n: number) {
  return `${n}cqw`;
}

function TruckIcon() {
  // Ritad efter originalets ikon: fylld lastlåda, förarhytt med fönster, chassi och två hjul.
  return (
    <svg viewBox="0 0 162 118" aria-hidden="true" className="r1-bub-truck-icon">
      <rect x="0" y="1" width="103" height="78" rx="6" fill="currentColor" />
      <path d="M112 86 V28 H131 L156 54 V86" fill="none" stroke="currentColor" strokeWidth="10" strokeLinejoin="round" />
      <rect x="112" y="56" width="44" height="30" fill="currentColor" />
      <rect x="0" y="83" width="160" height="10" rx="5" fill="currentColor" />
      <circle cx="37" cy="99" r="12.5" fill="none" stroke="currentColor" strokeWidth="12" />
      <circle cx="131" cy="99" r="12.5" fill="none" stroke="currentColor" strokeWidth="12" />
    </svg>
  );
}

// Raderna är block, med ett mellanslag mellan dem så att DOM-texten blir "Din butik, din design".
function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((l, j) => (
        <span key={j} className="r1-bub-line">
          {j > 0 ? ' ' : null}
          {l}
        </span>
      ))}
    </>
  );
}

export function PhotoBubbles({ set }: { set: string }) {
  const bubbles = PHOTO_BUBBLES[set];
  if (!bubbles) return null;
  return (
    <div className="r1-bubs">
      {bubbles.map((b, i) => {
        const base: CSSProperties = {
          ...b.pos,
          fontSize: cqw(b.cap / CAP_EM),
          lineHeight: b.lh,
          color: b.color,
        };
        if (b.kind === 'truck') {
          return (
            <p key={i} className="r1-bub r1-bub-truck" style={{ ...base, gap: cqw(b.gap) }}>
              <span className="r1-bub-icon" style={{ width: cqw(b.iconW), height: cqw(b.iconH) }}>
                <TruckIcon />
              </span>
              <span>
                <Lines lines={b.lines} />
              </span>
            </p>
          );
        }
        return (
          <p
            key={i}
            className="r1-bub r1-bub-pill"
            style={{
              ...base,
              background: b.fill,
              padding: `${cqw(b.padY)} ${cqw(b.padX)}`,
              borderRadius: cqw(b.radius),
            }}
          >
            <Lines lines={b.lines} />
          </p>
        );
      })}
    </div>
  );
}
