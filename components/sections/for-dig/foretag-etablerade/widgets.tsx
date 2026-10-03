'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { CardShell, RADIUS } from '../payment-cards/primitives';
import { usePrefersReducedMotion } from '../useReveal';
import type { ChatCardContent, StatsArea, StatsAreasContent, StatsOverviewContent, StudioScreenContent } from '@/lib/data/for-dig/foretag-etablerade';

/*
 * Widgets for /foretag-etablerad (Företag Etablerade). Content comes from
 * lib/data/for-dig/foretag-etablerade.ts; nothing here is page copy. Same vocabulary
 * as the other "För dig" widgets – CardShell, the three radii, the `.text-ui-*`
 * scale – and no figures, except the statistics widget, which shows clearly marked
 * example figures (decision 2026-10-03).
 */

/* ── Statistics widget ───────────────────────────────────────────────── */

const AUTO_MS = 6500;

function Bars({ chart }: { chart: NonNullable<StatsArea['chart']> }) {
  const max = Math.max(...chart.points.map((p) => p.value));
  return (
    <div className="flex h-32 items-end gap-2" aria-hidden="true">
      {chart.points.map((p) => (
        <div key={p.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
          <span className="text-ui-label tabular-nums text-gray-700">
            {p.value.toLocaleString('sv-SE')}
            {chart.unit ? ` ${chart.unit}` : ''}
          </span>
          <span className="w-full rounded-t-md bg-teal-dark" style={{ height: `${(p.value / max) * 72}%` }} />
          <span className="text-ui-label w-full truncate text-center text-gray-600">{p.label}</span>
        </div>
      ))}
    </div>
  );
}

function Line({ chart }: { chart: NonNullable<StatsArea['chart']> }) {
  const W = 300;
  const H = 96;
  const values = chart.points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const xy = values.map((v, i) => [(i / (values.length - 1)) * W, H - 8 - ((v - min) / (max - min || 1)) * (H - 20)] as const);
  const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <div aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full text-teal-dark" preserveAspectRatio="none">
        <path d={`${d} L${W} ${H} L0 ${H} Z`} fill="currentColor" opacity="0.1" />
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 flex justify-between">
        {chart.points.map((p) => (
          <span key={p.label} className="text-ui-label text-gray-600">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AreaPanel({ area }: { area: StatsArea }) {
  return (
    <div className="space-y-4">
      {area.kpis.length ? (
        <dl className={`grid gap-3 ${area.kpis.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {area.kpis.map((k) => (
            <div key={k.label} className={`min-w-0 bg-gray-50 px-3 py-2.5 ${RADIUS.field}`}>
              <dt className="text-ui-label truncate text-gray-600">{k.label}</dt>
              <dd className="mt-0.5 truncate text-lg font-semibold tabular-nums tracking-tight text-black">{k.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {area.chart ? (
        <div>
          <p className="text-ui-label mb-2 font-semibold text-gray-700">{area.chart.title}</p>
          {area.chart.kind === 'bars' ? <Bars chart={area.chart} /> : <Line chart={area.chart} />}
        </div>
      ) : null}
      {area.list ? (
        <div>
          <p className="text-ui-label mb-1.5 font-semibold text-gray-700">{area.list.title}</p>
          <table className="w-full table-fixed text-left">
            <thead>
              <tr>
                {area.list.columns.map((col, i) => (
                  <th key={col} scope="col" className={`text-ui-label pb-1.5 font-medium text-gray-600 ${i ? 'text-right' : ''}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {area.list.rows.map((row) => (
                <tr key={row.join('|')} className="border-t border-gray-100">
                  {row.map((cell, i) => (
                    <td key={i} className={`text-ui-body truncate py-1.5 ${i ? 'text-right tabular-nums text-gray-800' : 'text-black'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The statistics areas the portal has, one tab each. Click (or arrow keys) to switch; while
 * the widget is on screen it also moves on by itself, slowly, until the visitor picks a tab,
 * hovers or focuses it. Under reduced motion it never moves by itself and panels swap without
 * a fade. The tab row wraps from sm and scrolls sideways on a phone.
 */
export function StatsAreasWidget({ content }: { content: StatsAreasContent }) {
  const c = content;
  const titleId = useId();
  const baseId = useId();
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || picked || paused || !inView) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % c.areas.length), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [active, reduce, picked, paused, inView, c.areas.length]);

  // Keep the active tab visible in the sideways-scrolling row on phones.
  useEffect(() => {
    const tab = tabRefs.current[active];
    const row = tab?.parentElement;
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: tab.offsetLeft - row.clientWidth / 2 + tab.clientWidth / 2, behavior: reduce ? 'instant' : 'smooth' });
  }, [active, reduce]);

  const choose = (i: number) => {
    setPicked(true);
    setActive(i);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = c.areas.length;
    const next = e.key === 'ArrowRight' ? (active + 1) % n : e.key === 'ArrowLeft' ? (active - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(next);
    tabRefs.current[next]?.focus();
  };

  const area = c.areas[active];

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <CardShell labelledBy={titleId}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 id={titleId} className="text-ui-title">
            {c.title}
          </h3>
          <p className="text-ui-label text-gray-600">{c.note}</p>
        </div>

        <div
          role="tablist"
          aria-label={c.title}
          onKeyDown={onKey}
          className="-mx-5 mt-3 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {c.areas.map((a, i) => (
            <button
              key={a.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${a.id}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => choose(i)}
              className={`text-ui-label shrink-0 whitespace-nowrap px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-dark focus-visible:ring-offset-1 ${RADIUS.control} ${
                i === active ? 'bg-teal-dark font-semibold text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {a.tab}
            </button>
          ))}
        </div>

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${area.id}`} className="mt-4 min-h-[17.5rem]">
          <motion.div key={area.id} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.35, ease: [0.25, 0.1, 0.25, 1] }}>
            <AreaPanel area={area} />
          </motion.div>
        </div>
      </CardShell>
    </div>
  );
}

/** A small line with no axis and no values – the shape of a trend, not data. */
function Sparkline({ points }: { points: readonly number[] }) {
  const W = 96;
  const H = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * W;
      const y = H - 3 - ((v - min) / (max - min || 1)) * (H - 6);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-24 shrink-0" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** "Ledningsöversikt": the statistics modules the leadership follows, each with its trend line. */
export function StatsOverviewCard({ content }: { content: StatsOverviewContent }) {
  const titleId = useId();
  return (
    <CardShell labelledBy={titleId}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-ui-title">
          {content.title}
        </h3>
        <p className="text-ui-label text-gray-600">{content.period}</p>
      </div>
      <ul className="mt-2 divide-y divide-gray-100">
        {content.rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 py-2">
            <span className="text-ui-body text-gray-800">{row.label}</span>
            <span className="text-teal-dark">
              <Sparkline points={row.trend} />
            </span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

/*
 * Kundportalens tokens för marknadsföringssidan (public/css/layout2.css 134–135, 185–186):
 * accent #1AB65C med tonad bakgrund #E9F5EC, ram #e5e7eb, vita flata kort utan skugga.
 * Text i accentfärg använder hemsidans accent-700 (#0F7A3C, 5,0:1 mot #E9F5EC) – accent-600
 * når inte 4,5:1 mot vitt.
 */
const PORTAL = { accent: '#1AB65C', accentBg: '#E9F5EC', accentText: '#0F7A3C', border: '#e5e7eb', page: '#f6f7f6' } as const;

const TONE: Record<StudioScreenContent['campaigns']['items'][number]['tone'], string> = {
  active: 'bg-[#E9F5EC] text-[#0F7A3C]',
  planned: 'bg-status-unpaid-bg text-status-unpaid',
  done: 'bg-gray-100 text-gray-700',
};

/** Neutrala tonade plattor i stället för foton – en per format. */
const PLATES = [
  'linear-gradient(140deg, #dfe9e2 0%, #b9d3c2 100%)',
  'linear-gradient(160deg, #e6e3dc 0%, #c9c3b6 100%)',
  'linear-gradient(150deg, #dde3e8 0%, #b8c3cc 100%)',
  'linear-gradient(130deg, #e9e6df 0%, #d2cdbf 100%)',
];

/**
 * Kundportalens marknadsföringssida som den visas på surfplattans skärm: rubriken, målen,
 * kampanjkorten och bildformaten. Storleken kommer från behållaren (skärmytan): allt är i em av
 * en teckenstorlek i cqw, så det skalas skarpt med skärmen. Bildkortet visas bara när skärmen är
 * bred nog. Chips och kort är bilder av gränssnittet, inte kontroller.
 */
export function StudioScreen({ content }: { content: StudioScreenContent }) {
  const c = content;
  return (
    <div className="flex h-full w-full flex-col gap-[0.8em] p-[1.2em] text-left text-[clamp(5px,2.15cqw,14px)] leading-[1.35] text-black" style={{ background: PORTAL.page }}>
      <div>
        <p className="text-[1.45em] font-bold tracking-[-0.02em]">{c.title}</p>
        <p className="mt-[0.15em] truncate text-[0.82em] text-gray-600">{c.subtitle}</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-[0.8em] @min-[24rem]:grid-cols-[1.6fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[0.8em]">
          {/* Vad vill du uppnå? */}
          <div className="rounded-[0.9em] border bg-white p-[0.85em]" style={{ borderColor: PORTAL.border }}>
            <p className="text-[0.95em] font-semibold">{c.goals.title}</p>
            <div className="mt-[0.55em] flex flex-wrap gap-[0.4em]">
              {c.goals.chips.map((chip) => {
                const on = chip === c.goals.active;
                return (
                  <span
                    key={chip}
                    className="whitespace-nowrap rounded-full border px-[0.75em] py-[0.25em] text-[0.78em]"
                    style={on ? { borderColor: PORTAL.accent, background: PORTAL.accentBg, color: PORTAL.accentText, fontWeight: 600 } : { borderColor: PORTAL.border, color: '#404040' }}
                  >
                    {chip}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Din marknadsföring */}
          <div className="flex min-h-0 flex-1 flex-col rounded-[0.9em] border bg-white p-[0.85em]" style={{ borderColor: PORTAL.border }}>
            <p className="text-[0.95em] font-semibold">{c.campaigns.title}</p>
            <div className="mt-[0.55em] grid grid-cols-1 gap-[0.5em] @min-[30rem]:grid-cols-3">
              {c.campaigns.items.map((item, i) => (
                <div key={item.id} className={`rounded-[0.75em] border p-[0.65em] ${i > 1 ? 'hidden @min-[30rem]:block' : ''}`} style={{ borderColor: PORTAL.border }}>
                  <p className="truncate text-[0.9em] font-semibold">{item.name}</p>
                  <div className="mt-[0.35em] flex flex-wrap gap-[0.3em]">
                    <span className="whitespace-nowrap rounded-full bg-gray-100 px-[0.55em] py-[0.1em] text-[0.7em] text-gray-700">{item.purpose}</span>
                    <span className={`whitespace-nowrap rounded-full px-[0.55em] py-[0.1em] text-[0.7em] font-semibold ${TONE[item.tone]}`}>{item.status}</span>
                  </div>
                  <p className="mt-[0.4em] truncate text-[0.72em] text-gray-600">{item.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dina bilder: formaten som tonade plattor, utan foton och utan text i bilderna. */}
        <div className="hidden min-h-0 flex-col rounded-[0.9em] border bg-white p-[0.85em] @min-[24rem]:flex" style={{ borderColor: PORTAL.border }}>
          <p className="text-[0.95em] font-semibold">{c.images.title}</p>
          <div className="mt-[0.6em] grid flex-1 grid-cols-2 content-start items-end gap-x-[0.6em] gap-y-[0.7em]">
            {c.images.formats.map((format, i) => (
              <div key={format.label} className="flex flex-col items-center gap-[0.3em]">
                <span aria-hidden="true" className="flex w-full items-end justify-center" style={{ height: '5.6em' }}>
                  <span
                    className="block rounded-[0.45em]"
                    style={{
                      background: PLATES[i % PLATES.length],
                      aspectRatio: String(format.ratio),
                      height: format.ratio >= 1 ? 'auto' : '100%',
                      width: format.ratio >= 1 ? '100%' : 'auto',
                      maxHeight: '100%',
                    }}
                  />
                </span>
                <span className="text-[0.7em] text-gray-600">{format.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The AI support handing over to live chat: three messages and the handoff row. */
export function ChatCard({ content }: { content: ChatCardContent }) {
  const titleId = useId();
  return (
    <CardShell labelledBy={titleId}>
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>
      <ul className="mt-3 space-y-2">
        {content.messages.map((m) => (
          <li key={m.id} className={`flex ${m.from === 'kund' ? 'justify-end' : 'justify-start'}`}>
            <span
              className={`text-ui-body max-w-[85%] px-3 py-2 ${RADIUS.field} ${
                m.from === 'kund' ? 'bg-teal-dark text-white' : 'bg-gray-100 text-black'
              }`}
            >
              {m.text}
            </span>
          </li>
        ))}
      </ul>
      <div className={`mt-4 flex items-center gap-3 border border-gray-200 px-3 py-2.5 ${RADIUS.field}`}>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center bg-teal-dark text-white ${RADIUS.control}`}>
          <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="text-ui-body block">{content.handoff.title}</span>
          <span className="text-ui-label block text-gray-600">{content.handoff.note}</span>
        </span>
      </div>
    </CardShell>
  );
}
