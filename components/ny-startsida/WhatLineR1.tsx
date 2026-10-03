'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { KOM_IGANG_HREF } from './links';

/*
 * REDESIGN 1, PASS 8: den slingrande gröna linjen i kategorisektionen, med knappen
 * "Bli kund idag" där den slutar. Ersätter den raka linjen (.rd-timeline-line).
 *
 * Vägen räknas fram ur de verkliga elementens mått (getBoundingClientRect relativt
 * sektionen) och räknas om med ResizeObserver. Två kolumner (från 1024 px):
 *   start där den raka linjen började (vänster om 01:s text) → ner förbi 01:s text →
 *   S-kurva in i mellanrummet → ner förbi 02 → S-kurva ut till höger om högerkolumnen →
 *   ner förbi 03 → S-kurva in i mellanrummet → ner förbi 04 → S-kurva ut till startens x
 *   i höjd med sektionens slut.
 * Varje sväng läggs minst CLEAR px under det innehåll den korsar, och varje rak sträcka
 * ligger mitt i mellanrummet, mitt i utrymmet till höger eller CLEAR px utanför innehållet.
 * Staplade kolumner (under 1024 px): en rak linje till vänster om innehållet.
 *
 * Framritning: stroke-dasharray/-dashoffset. Spetsen följer mjukt en punkt TIP_AT ner på
 * visningsytan (pass 8b). Ingen scrollkapning. När spetsen når slutet poppar knappen upp och stannar kvar, och linjen
 * står kvar färdigritad. Med reducerad rörelse är allt färdigt direkt.
 */

const CLEAR = 24;
const BTN_HALF = 25; // halva knappens höjd (rd-pill: min-height 50px)
const REDUCE = '(prefers-reduced-motion: reduce)';
/** PASS 8B: spetsens mål som andel av visningsytans höjd uppifrån. */
export const TIP_AT = 0.85;
/** Andel av avståndet till målet som tas igen per bildruta vid 60 Hz. */
const FOLLOW = 0.12;
/** Största eftersläpning: spetsens y på skärmen jämfört med målpunkten (eller linjens slut,
    om det ligger ovanför målpunkten), som andel av visningsytans höjd. */
const MAX_LAG = 0.1;
/** Har slutet passerats ritas linjen klar inom så här lång tid. */
const FINISH_MS = 380;

type Box = { l: number; r: number; t: number; b: number };
type Geo = { d: string; w: number; h: number; ex: number; ey: number };

function sCurve(xa: number, ya: number, xb: number, yb: number) {
  const m = (ya + yb) / 2;
  return `C ${xa} ${m} ${xb} ${m} ${xb} ${yb}`;
}

function measure(section: HTMLElement): Geo | null {
  const tl = section.querySelector<HTMLElement>('.rd-timeline');
  if (!tl) return null;
  const s = section.getBoundingClientRect();
  // Layoutmått relativt sektionen via offset-kedjan: textblocken och korten tonas in med
  // transform (.rd-reveal), och den ska inte flytta linjen. Sektionen är position: relative.
  const rel = (el: HTMLElement): Box => {
    let x = 0;
    let y = 0;
    let n: HTMLElement | null = el;
    while (n && n !== section) {
      x += n.offsetLeft;
      y += n.offsetTop;
      n = n.offsetParent as HTMLElement | null;
    }
    return { l: x, r: x + el.offsetWidth, t: y, b: y + el.offsetHeight };
  };
  const t = rel(tl);
  const cs = getComputedStyle(tl);
  const padL = parseFloat(cs.paddingLeft) || 0;
  const rows = [...tl.querySelectorAll<HTMLElement>('.rd-service')].map((a) => {
    const text = rel(a.querySelector<HTMLElement>('.rd-service-text')!);
    const fig = rel(a.querySelector<HTMLElement>('.rd-service-fig')!);
    const left = text.l <= fig.l ? text : fig;
    const right = text.l <= fig.l ? fig : text;
    return { text, fig, left, right, stacked: right.l < left.r };
  });
  if (!rows.length) return null;
  const w = s.width;
  const h = s.height;
  const lastBottom = Math.max(...rows.map((r) => Math.max(r.text.b, r.fig.b)));
  const stacked = rows.length !== 4 || rows.some((r) => r.stacked);

  if (stacked) {
    // Rak linje CLEAR + 4 px till vänster om innehållet (r1.css ger plats på smal skärm).
    const x0 = t.l + padL - CLEAR - 4;
    const ey = lastBottom + CLEAR + BTN_HALF;
    return { d: `M ${x0} ${t.t} L ${x0} ${ey}`, w, h, ex: x0, ey };
  }

  const [r1, r2, r3, r4] = rows;
  const x0 = t.l + padL / 2 + 1; // samma x som den raka linjen
  const gap = (row: (typeof rows)[number]) => (row.left.r + row.right.l) / 2;
  const xr = (Math.max(...rows.map((r) => r.right.r)) + w) / 2;
  const g1 = gap(r1);
  const g2 = gap(r2);
  const g4 = gap(r4);

  const a = r1.left.b + CLEAR;
  const b = Math.min(a + 180, r2.left.t - CLEAR);
  const c = r2.right.b + CLEAR;
  const d = r3.right.t - CLEAR;
  const e = r3.right.b + CLEAR;
  const f = r4.right.t - CLEAR;
  const g = r4.left.b + CLEAR;
  const ey = Math.max(g + 100, h - CLEAR - BTN_HALF);

  const path = [
    `M ${x0} ${t.t}`,
    `L ${x0} ${a}`,
    sCurve(x0, a, g1, b),
    `L ${g2} ${c}`,
    sCurve(g2, c, xr, d),
    `L ${xr} ${e}`,
    sCurve(xr, e, g4, f),
    `L ${g4} ${g}`,
    sCurve(g4, g, x0, ey),
  ].join(' ');
  return { d: path, w, h, ex: x0, ey };
}

export function WhatLineR1() {
  const hostRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const lutRef = useRef<{ len: number[]; y: number[]; total: number } | null>(null);
  const doneRef = useRef(false);
  const shownLen = useRef(0);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [shown, setShown] = useState(false);
  const [instant, setInstant] = useState(false);

  // Mät vägen och räkna om vid storleksändringar (bilder, typsnitt, fönster).
  useEffect(() => {
    const section = hostRef.current?.closest<HTMLElement>('.rd-what');
    if (!section) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setGeo(measure(section)));
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(section);
    section.querySelectorAll('.rd-service, .rd-service-text, .rd-service-fig').forEach((el) => ro.observe(el));
    window.addEventListener('resize', run);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', run);
    };
  }, []);

  // Uppslagstabell längd → y (vägen går hela tiden nedåt, så y växer med längden).
  useEffect(() => {
    const p = pathRef.current;
    if (!p || !geo) return;
    const total = p.getTotalLength();
    const n = Math.max(2, Math.ceil(total / 6));
    const len: number[] = [];
    const y: number[] = [];
    for (let i = 0; i <= n; i++) {
      const l = (total * i) / n;
      len.push(l);
      y.push(p.getPointAtLength(l).y);
    }
    lutRef.current = { len, y, total };
    p.style.strokeDasharray = `${total} ${total}`;
    p.style.strokeDashoffset = doneRef.current ? '0' : `${total}`;
    p.style.opacity = '1';
  }, [geo]);

  // PASS 8B: framritning med mjuk följning. Målet är spetsen vid TIP_AT av visningsytans höjd.
  // Den visade längden närmar sig mållängden med en tidsbaserad interpolation (FOLLOW per
  // bildruta vid 60 Hz, samma förlopp vid 120 Hz) och ligger aldrig mer än MAX_LAG av
  // visningsytans höjd efter i y. Är slutet redan passerat ritas linjen klar inom FINISH_MS.
  // Loopen körs bara tills den visade längden har nått målet och startas igen vid scroll
  // eller storleksändring.
  useEffect(() => {
    const p = pathRef.current;
    const section = hostRef.current?.closest<HTMLElement>('.rd-what');
    if (!p || !section || !geo) return;
    const mql = window.matchMedia(REDUCE);
    let raf = 0;
    let last = 0;
    let finishFrom: { t: number; rest: number } | null = null;

    const lenAtY = (lut: NonNullable<typeof lutRef.current>, ty: number) => {
      if (ty >= lut.y[lut.y.length - 1]) return lut.total;
      if (ty <= lut.y[0]) return 0;
      let lo = 0;
      let hi = lut.y.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (lut.y[mid] < ty) lo = mid;
        else hi = mid;
      }
      const span = lut.y[hi] - lut.y[lo] || 1;
      return lut.len[lo] + ((ty - lut.y[lo]) / span) * (lut.len[hi] - lut.len[lo]);
    };
    const finish = () => {
      p.style.strokeDashoffset = '0';
      shownLen.current = lutRef.current?.total ?? 0;
      doneRef.current = true;
      setShown(true);
    };

    const tick = (now: number) => {
      raf = 0;
      const lut = lutRef.current;
      if (!lut) return;
      if (mql.matches || doneRef.current) {
        if (mql.matches) setInstant(true);
        finish();
        return;
      }
      const dt = last ? Math.min(now - last, 100) : 16.7;
      last = now;
      const vh = window.innerHeight;
      const secTop = section.getBoundingClientRect().top;
      const targetY = vh * TIP_AT - secTop;
      const target = lenAtY(lut, targetY);
      let cur = Math.min(shownLen.current, lut.total);
      if (target > cur) {
        // tidsbaserad interpolation: andelen per bildruta räknas om efter verklig bildrutetid
        cur += (target - cur) * (1 - Math.pow(1 - FOLLOW, dt / 16.7));
        // Eftersläpningen i visningsytans koordinater: spetsens y på skärmen får ligga högst
        // MAX_LAG × visningsytans höjd ovanför målpunkten, eller ovanför linjens slut om slutet
        // redan har passerat målpunkten. Gäller i alla lägen.
        const endScreen = secTop + lut.y[lut.y.length - 1];
        const capScreen = Math.min(vh * TIP_AT, endScreen) - vh * MAX_LAG;
        const minLen = lenAtY(lut, capScreen - secTop);
        if (cur < minLen) cur = minLen;
        if (target < lut.total) {
          finishFrom = null;
        } else {
          // slutet passerat: ritas klart inom FINISH_MS i stället för att hoppa dit
          if (!finishFrom) finishFrom = { t: now, rest: lut.total - cur };
          const linear = lut.total - finishFrom.rest * (1 - Math.min((now - finishFrom.t) / FINISH_MS, 1));
          if (linear > cur) cur = linear;
        }
        if (target - cur < 0.5) cur = target;
      } else {
        // uppåt före slutet: linjen följer målet tillbaka utan eftersläpning
        cur = target;
        finishFrom = null;
      }
      shownLen.current = cur;
      if (cur >= lut.total - 0.5) {
        finish();
        return;
      }
      p.style.strokeDashoffset = `${lut.total - cur}`;
      if (Math.abs(target - cur) > 0.01) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    kick();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    mql.addEventListener('change', kick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      mql.removeEventListener('change', kick);
    };
  }, [geo]);

  return (
    <div ref={hostRef} className="r1-line-host">
      {geo && (
        <svg className="r1-line-svg" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
          <path ref={pathRef} d={geo.d} className="r1-line-path" />
        </svg>
      )}
      <Link
        href={KOM_IGANG_HREF}
        className="rd-pill r1-line-cta"
        data-shown={shown ? '' : undefined}
        data-instant={instant ? '' : undefined}
        tabIndex={shown ? undefined : -1}
        aria-hidden={shown ? undefined : true}
        style={geo ? { left: `${geo.ex}px`, top: `${geo.ey - BTN_HALF}px` } : undefined}
      >
        Bli kund idag
      </Link>
    </div>
  );
}
