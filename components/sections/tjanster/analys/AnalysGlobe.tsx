'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { analysGeo } from '@/lib/data/tjanster/analys';

/*
 * "Global analys" on /analys. The globe fills the section and a green line runs from Sweden
 * and from Italy to a card with visits per city (example data, lib/data/tjanster/analys.ts).
 *
 * The countries are points in the photo's own pixels (globe3.png, 1376 × 768). They are mapped
 * onto the section through object-fit: cover and the computed object-position, so the lines
 * start on the countries at every width. From xl the cards sit on the globe at the end of each
 * line. Below xl there is no room beside the heading, so the lines end in a dot and the cards
 * stack under the globe.
 *
 * The lines draw like the section's earlier line (1.5 s, same easing and opacity), each time the
 * globe comes into view. Under reduced motion they are drawn from the start.
 */

const IMAGE = { src: '/globe3.png', width: 1376, height: 768 };
// Measured in globe3.png: Sweden on the land west of the Gulf of Bothnia, Italy on the boot
// between the Tyrrhenian coast and the Adriatic.
const COUNTRY_POINTS = {
  sverige: { x: 803, y: 415 },
  italien: { x: 836, y: 596 },
} as const;
const WIDE_QUERY = '(min-width: 1280px)';
const CARD_WIDTH = 264;
const EDGE = 24;
const GAP = 12;

type CountryId = keyof typeof COUNTRY_POINTS;
type Point = { x: number; y: number };
type Arc = { id: CountryId; start: Point; end: Point; d: string };
type Layout = { width: number; height: number; wide: boolean; arcs: Arc[] };

const nf = new Intl.NumberFormat('sv-SE');

function arcPath(start: Point, end: Point) {
  const dx = end.x - start.x;
  const lift = Math.min(90, Math.abs(dx) * 0.6);
  const top = Math.min(start.y, end.y) - lift;
  return `M ${start.x} ${start.y} C ${start.x + dx * 0.14} ${top + lift * 0.1}, ${start.x + dx * 0.42} ${top}, ${end.x} ${end.y}`;
}

/** "62%" → 0.62. object-position is always computed to percentages or px for an img. */
function positionFraction(value: string, free: number) {
  if (value.endsWith('%')) return parseFloat(value) / 100;
  if (value.endsWith('px') && free !== 0) return parseFloat(value) / free;
  return 0.5;
}

/** A point in the photo's pixels → a point in the box, for object-fit: cover. */
function mapPoint(img: HTMLImageElement, width: number, height: number, p: Point): Point {
  const nw = img.naturalWidth || IMAGE.width;
  const nh = img.naturalHeight || IMAGE.height;
  const scale = Math.max(width / nw, height / nh);
  const freeX = width - nw * scale;
  const freeY = height - nh * scale;
  const [posX = '50%', posY = '50%'] = getComputedStyle(img).objectPosition.split(' ');
  const k = nw / IMAGE.width;
  return {
    x: freeX * positionFraction(posX, freeX) + p.x * k * scale,
    y: freeY * positionFraction(posY, freeY) + p.y * k * scale,
  };
}

function CountryCard({ id }: { id: CountryId }) {
  const titleId = useId();
  const country = analysGeo.countries.find((c) => c.id === id)!;
  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className="w-full rounded-2xl border border-white/[0.08] bg-[rgba(20,20,20,0.62)] p-4 text-white shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[20px] backdrop-saturate-[140%]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-base font-semibold leading-tight">
          {country.name}
        </h3>
        <span className="text-[11px] uppercase tracking-[0.14em] text-white/60">{analysGeo.exampleLabel}</span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {country.cities.map((city) => (
          <li key={city.name}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate text-white/90">{city.name}</span>
              <span className="shrink-0 tabular-nums text-white/70">
                <span className="font-semibold text-white">{city.share} %</span> · {nf.format(city.visits)} {analysGeo.visitsLabel}
              </span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-white/10" aria-hidden="true">
              <div className="h-full rounded-full bg-[#00BFA6]" style={{ width: `${city.share}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-white/10 pt-3 text-sm">
        <span className="text-white/75">
          {analysGeo.totalLabel} {country.name}
        </span>
        <span className="font-semibold tabular-nums">
          {nf.format(country.total)} {analysGeo.visitsLabel}
        </span>
      </div>
    </div>
  );
}

export function AnalysGlobe() {
  const reduce = usePrefersReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const hasAnimatedRef = useRef(false);
  const [layout, setLayout] = useState<Layout | null>(null);
  const gradientId = useId().replace(/:/g, '');
  const ready = layout !== null;

  const compute = useCallback(() => {
    const box = boxRef.current;
    const img = imgRef.current;
    if (!box || !img || !img.complete || !img.naturalWidth) return;
    const width = box.clientWidth;
    const height = box.clientHeight;
    const wide = window.matchMedia(WIDE_QUERY).matches;
    const se = mapPoint(img, width, height, COUNTRY_POINTS.sverige);
    const it = mapPoint(img, width, height, COUNTRY_POINTS.italien);
    const seEnd = wide
      ? { x: Math.min(se.x + 230, width - EDGE - CARD_WIDTH - GAP), y: se.y - 70 }
      : { x: Math.min(se.x + 110, width - 28), y: se.y - 40 };
    const itEnd = wide
      ? { x: Math.max(it.x - 240, EDGE + CARD_WIDTH + GAP), y: it.y - 30 }
      : { x: Math.max(it.x - 110, 28), y: it.y - 30 };
    setLayout({
      width,
      height,
      wide,
      arcs: [
        { id: 'sverige', start: se, end: seEnd, d: arcPath(se, seEnd) },
        { id: 'italien', start: it, end: itEnd, d: arcPath(it, itEnd) },
      ],
    });
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    compute();
    const observer = new ResizeObserver(() => compute());
    observer.observe(box);
    return () => observer.disconnect();
  }, [compute]);

  // Draw the lines when the globe is in view, and again after it has left and come back.
  useEffect(() => {
    const box = boxRef.current;
    if (!ready || !box) return;
    const paths = pathRefs.current.filter((p): p is SVGPathElement => p !== null);
    const finalState = () =>
      paths.forEach((p) => {
        p.style.strokeDashoffset = '0';
        p.style.opacity = p.dataset.final ?? '1';
      });
    const initialState = () =>
      paths.forEach((p) => {
        p.style.strokeDashoffset = '1';
        p.style.opacity = '0';
      });

    if (reduce) {
      finalState();
      return;
    }
    if (!hasAnimatedRef.current) initialState();

    let running = false;
    const run = () => {
      if (running) return;
      running = true;
      initialState();
      const timing: KeyframeAnimationOptions = { duration: 1500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' };
      const animations = paths.flatMap((p) => [
        p.animate([{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }], timing),
        p.animate(
          p.dataset.kind === 'glow'
            ? [{ opacity: 0 }, { opacity: 0.7 }, { opacity: 0.6 }]
            : [{ opacity: 0 }, { opacity: 1 }, { opacity: 0.92 }],
          timing
        ),
      ]);
      Promise.all(animations.map((a) => a.finished))
        .catch(() => {})
        .finally(() => {
          finalState();
          hasAnimatedRef.current = true;
          running = false;
        });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!hasAnimatedRef.current) run();
            return;
          }
          if (!entry.isIntersecting || entry.intersectionRatio < 0.4) hasAnimatedRef.current = false;
        });
      },
      { threshold: [0.4, 0.5, 0.6] }
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, [ready, reduce]);

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div ref={boxRef} className="relative min-h-[100svh]" data-globe-box="">
        <Image
          ref={imgRef}
          src={IMAGE.src}
          alt=""
          fill
          sizes="100vw"
          onLoad={compute}
          className="object-cover [object-position:62%_100%] xl:[object-position:50%_100%]"
        />
        {/* Keeps the heading, text and button readable where they overlap the bright top of the
            globe: a darker top band, and a soft dark ellipse behind the text block itself. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-black/85 via-black/45 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_32%_at_50%_30%,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.7)_55%,rgba(0,0,0,0)_90%)] md:bg-[radial-gradient(ellipse_46%_34%_at_50%_30%,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.6)_50%,rgba(0,0,0,0)_85%)]"
        />

        {layout ? (
          <>
            <svg
              className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              aria-hidden="true"
            >
              <defs>
                {layout.arcs.map((arc) => (
                  <linearGradient
                    key={arc.id}
                    id={`${gradientId}-${arc.id}`}
                    gradientUnits="userSpaceOnUse"
                    x1={arc.start.x}
                    y1={0}
                    x2={arc.end.x}
                    y2={0}
                  >
                    <stop offset="0%" stopColor="rgba(0,191,166,0.35)" />
                    <stop offset="45%" stopColor="rgba(0,191,166,0.9)" />
                    <stop offset="100%" stopColor="rgba(140,255,236,0.8)" />
                  </linearGradient>
                ))}
                <filter id={`${gradientId}-glow`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>
              {layout.arcs.map((arc, i) => (
                <g key={arc.id} data-arc={arc.id} data-start-x={arc.start.x} data-start-y={arc.start.y}>
                  <path
                    ref={(el) => {
                      pathRefs.current[i * 2] = el;
                    }}
                    data-kind="glow"
                    data-final="0.6"
                    d={arc.d}
                    fill="none"
                    stroke="rgba(0,191,166,0.35)"
                    strokeWidth={6}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    filter={`url(#${gradientId}-glow)`}
                  />
                  <path
                    ref={(el) => {
                      pathRefs.current[i * 2 + 1] = el;
                    }}
                    data-kind="main"
                    data-final="0.92"
                    d={arc.d}
                    fill="none"
                    stroke={`url(#${gradientId}-${arc.id})`}
                    strokeWidth={2}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                  />
                </g>
              ))}
            </svg>

            {layout.arcs.map((arc) => (
              <span key={arc.id} aria-hidden="true">
                <span
                  className="pointer-events-none absolute z-[2] block h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#75FFE8] shadow-[0_0_0_4px_rgba(117,255,232,0.14)]"
                  style={{ left: arc.start.x, top: arc.start.y }}
                />
                <span
                  className="pointer-events-none absolute z-[2] block h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#75FFE8] shadow-[0_0_0_6px_rgba(117,255,232,0.15),0_0_24px_rgba(0,191,166,0.75)]"
                  style={{ left: arc.end.x, top: arc.end.y }}
                />
              </span>
            ))}

            {layout.wide
              ? layout.arcs.map((arc) => (
                  <div
                    key={arc.id}
                    data-country-card={arc.id}
                    className="absolute z-[3] -translate-y-1/2"
                    style={{
                      width: CARD_WIDTH,
                      top: arc.end.y,
                      left: arc.id === 'sverige' ? arc.end.x + GAP : arc.end.x - GAP - CARD_WIDTH,
                    }}
                  >
                    <CountryCard id={arc.id} />
                  </div>
                ))
              : null}
          </>
        ) : null}

        <div className="relative z-[4] mx-auto flex w-full max-w-[1120px] flex-col items-center px-6 pt-24 text-center md:pt-28">
          <p className="text-[12px] uppercase tracking-[0.35em] text-white/60">GLOBAL ANALYS</p>
          <h2 className="mt-5 max-w-[640px] text-4xl font-semibold leading-[1.06] tracking-tight md:text-5xl xl:text-[3.5rem]">
            Spara och skala med datadrivna beslut
          </h2>
          <p className="mt-5 max-w-[560px] text-base leading-relaxed text-white/85 md:text-lg">
            Se besökare, visningar, köp och intäkter per land och stad.
          </p>
          <Link
            href="/kontakt"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/55 bg-black/55 px-[18px] py-2.5 text-sm font-medium leading-tight text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Se hur det fungerar
          </Link>
        </div>
      </div>

      {/* Below xl the cards stack under the globe. */}
      <div className="relative z-[4] mx-auto grid max-w-[640px] gap-4 px-6 pb-20 sm:grid-cols-2 xl:hidden">
        {analysGeo.countries.map((c) => (
          <CountryCard key={c.id} id={c.id} />
        ))}
      </div>
    </section>
  );
}
