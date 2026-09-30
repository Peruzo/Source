import type { CSSProperties, ReactNode } from 'react';
import { analysDashboard as d } from '@/lib/data/tjanster/analys';

/*
 * The customer portal's Analyser page (analyser-layout2.html, CSS/analyser-layout2.css) as it
 * fills the laptop screen in "Se vad besökarna tittar på just nu". Light and flat like the
 * portal: solid white cards with a thin border, 14 px radius, pills with the green accent,
 * no shadows or gradients. Example data only (lib/data/tjanster/analys.ts).
 *
 * Everything is sized in em from one font size of 100cqw / 70 on the root, so the page is laid
 * out at 70 × 46.45 em (1 120 × 743 px at 16 px) and scales sharply with the screen it sits in
 * (DeviceShowcase `screen`, a size container). Font sizes are set only on text leaves, so the
 * em values of the boxes around them stay in root ems.
 */

const ACCENT = '#1AB65C';
// Darker shade of the accent for text on white (4.5:1+); the accent itself is 2.6:1.
const ACCENT_TEXT = '#137c40';
const TEXT = '#111827';
const MUTED = '#6b7280';
const BORDER = '#e5e7eb';

const root: CSSProperties = { fontSize: 'calc(100cqw / 70)', color: TEXT };

// Chart geometry in tenths of an em: the plot box is 63.5 em × 7.2 em.
const VB = { w: 635, h: 72 };
const PLOT = { left: 34, right: 628, top: 5, bottom: 56 };
const Y_MIN = 250;
const Y_MAX = 400;
const Y_TICKS = [250, 300, 350, 400];

function chartPoints(values: readonly number[]) {
  const step = (PLOT.right - PLOT.left) / (values.length - 1);
  return values.map((v, i) => ({
    x: PLOT.left + i * step,
    y: PLOT.bottom - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (PLOT.bottom - PLOT.top),
  }));
}

/** A smooth line through the points (Catmull-Rom as cubic Béziers). */
function smoothPath(pts: { x: number; y: number }[]) {
  let path = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    path += ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

function Pill({ active, children }: { active?: boolean; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full border px-[1em] py-[0.4em]"
      style={{
        borderColor: active ? ACCENT : BORDER,
        background: active ? 'color-mix(in srgb, #1AB65C 13%, transparent)' : 'transparent',
      }}
    >
      <span className="text-[0.8125em] font-medium leading-[1.2]">{children}</span>
    </span>
  );
}

const card = 'rounded-[0.875em] border bg-white';

export function AnalysDashboard() {
  const pts = chartPoints(d.trend.values);
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${PLOT.bottom} L ${pts[0].x} ${PLOT.bottom} Z`;

  return (
    <div className="h-full w-full overflow-hidden bg-[#f6f7f9] px-[2em] pt-[1.4em] pb-[1em]" style={root}>
      {/* Page header: title with live visitors, and the period pills. */}
      <div className="flex items-start justify-between gap-[0.75em]">
        <div className="min-w-0">
          <p className="flex items-center gap-[0.6em]">
            <span className="text-[1.375em] font-bold leading-[1.2] tracking-[-0.02em]">{d.title}</span>
            <span className="flex items-center gap-[0.4em]" style={{ color: MUTED }}>
              <span className="block h-[0.5em] w-[0.5em] rounded-full motion-safe:animate-pulse" style={{ background: ACCENT }} />
              <span className="text-[0.8125em] font-medium">
                <span className="tabular-nums" style={{ color: TEXT }}>{d.live}</span> {d.liveLabel}
              </span>
            </span>
          </p>
          <p className="mt-[0.25em]" style={{ color: MUTED }}>
            <span className="text-[0.8125em]">{d.subtitle}</span>
          </p>
        </div>
        <div className="flex items-center gap-[0.5em]">
          <span style={{ color: MUTED }}>
            <span className="text-[0.8125em]">{d.periodLabel}</span>
          </span>
          {d.periods.map((p, i) => (
            <Pill key={p} active={i === d.activePeriod}>
              {p}
            </Pill>
          ))}
        </div>
      </div>

      {/* KPI row: three flat cards. */}
      <div className="mt-[0.8em] grid grid-cols-3 gap-[1em]">
        {d.kpis.map((k) => (
          <div key={k.label} className={`${card} flex flex-col gap-[0.3em] px-[1.25em] py-[0.75em]`} style={{ borderColor: BORDER }}>
            <p style={{ color: MUTED }}>
              <span className="text-[0.8125em] font-medium leading-[1.3]">{k.label}</span>
            </p>
            <p>
              <span className="text-[1.6em] font-bold leading-[1.1] tracking-[-0.02em] tabular-nums">{k.value}</span>
            </p>
            <p className="flex items-baseline gap-[0.375em]">
              {'delta' in k ? (
                <>
                  <span className="text-[0.8125em] font-semibold tabular-nums" style={{ color: ACCENT_TEXT }}>
                    {k.delta}
                  </span>
                  <span className="text-[0.8125em]" style={{ color: MUTED }}>
                    {k.deltaText}
                  </span>
                </>
              ) : (
                <span className="text-[0.8125em]">&nbsp;</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Visit trend: one series, smooth line with a light fill, dates on the x axis. */}
      <div className={`${card} mt-[0.7em] px-[1.25em] pt-[0.9em] pb-[0.7em]`} style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between gap-[0.75em]">
          <p>
            <span className="text-[0.9375em] font-semibold">{d.trend.title}</span>
          </p>
          <div className="flex gap-[0.5em]">
            {d.trend.series.map((s, i) => (
              <Pill key={s.label} active={i === 0}>
                {s.label} <span className="ml-[0.25em] font-semibold tabular-nums">{s.total}</span>
              </Pill>
            ))}
          </div>
        </div>
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          preserveAspectRatio="none"
          className="mt-[0.6em] block h-[7.2em] w-full"
          role="img"
          aria-label={`${d.trend.title}: ${d.trend.series[0].label} per dag, ${d.trend.ticks[0].label} till ${d.trend.ticks[d.trend.ticks.length - 1].label}`}
        >
          {Y_TICKS.map((t) => {
            const y = PLOT.bottom - ((t - Y_MIN) / (Y_MAX - Y_MIN)) * (PLOT.bottom - PLOT.top);
            return (
              <g key={t}>
                <line x1={PLOT.left} x2={PLOT.right} y1={y} y2={y} stroke={BORDER} strokeWidth={0.6} />
                <text x={PLOT.left - 6} y={y + 2.6} textAnchor="end" fontSize={7.5} fill={MUTED}>
                  {t}
                </text>
              </g>
            );
          })}
          <path d={area} fill={ACCENT} fillOpacity={0.09} />
          <path d={line} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {d.trend.ticks.map((t) => (
            <text key={t.label} x={pts[t.index].x} y={VB.h - 3} textAnchor="middle" fontSize={7.5} fill={MUTED}>
              {t.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Page views per page. */}
      <div className={`${card} mt-[0.7em] px-[1.25em] pt-[0.9em] pb-[0.8em]`} style={{ borderColor: BORDER }}>
        <p>
          <span className="text-[0.9375em] font-semibold">{d.table.title}</span>
        </p>
        <div className="mt-[0.6em] overflow-hidden rounded-[0.75em] border" style={{ borderColor: BORDER }}>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {d.table.columns.map((c) => (
                  <th key={c} className="px-[0.75em] py-[0.5em] font-semibold" style={{ color: MUTED }}>
                    <span className="text-[0.75em] uppercase tracking-[0.03em]">{c}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.table.rows.map((r, i) => (
                <tr key={r.path} style={i < d.table.rows.length - 1 ? { borderBottom: `1px solid ${BORDER}` } : undefined}>
                  <td className="px-[0.75em] py-[0.3em]">
                    <span className="text-[0.875em] font-medium">{r.path}</span>
                  </td>
                  <td className="px-[0.75em] py-[0.3em]">
                    <span className="text-[0.875em] font-semibold tabular-nums">{r.views}</span>
                  </td>
                  <td className="px-[0.75em] py-[0.3em]">
                    <span className="text-[0.875em] tabular-nums">{r.unique}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
