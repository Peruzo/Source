'use client';

import { useId } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { CardShell, RADIUS } from '../payment-cards/primitives';
import type { ChatCardContent, StatsOverviewContent, StudioScreenContent } from '@/lib/data/for-dig/foretag-etablerade';

/*
 * Widgets for /foretag-etablerad (Företag Etablerade). Content comes from
 * lib/data/for-dig/foretag-etablerade.ts; nothing here is page copy. Same vocabulary
 * as the other "För dig" widgets – CardShell, the three radii, the `.text-ui-*`
 * scale – and no figures: they show what the screens look like, not results.
 */

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

/**
 * The marketing studio as it would show on the tablet's screen: campaign header,
 * tabs, the assistant's plan and the image formats. Sized by its container (the
 * screen area): everything is in em of a font size set in cqw, so it scales with
 * the screen, and the image column only shows once the screen is wide enough.
 * Buttons are look-alikes.
 */
export function StudioScreen({ content }: { content: StudioScreenContent }) {
  return (
    <div className="flex h-full w-full flex-col bg-[#f5f5f3] text-left text-[clamp(6px,2.5cqw,15px)] leading-[1.35] text-black">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-[0.8em] border-b border-gray-200 bg-white px-[1.2em] py-[0.8em]">
        <div className="min-w-0">
          <p className="text-[0.8em] text-gray-600">{content.section}</p>
          <p className="truncate text-[1.15em] font-semibold">{content.campaign}</p>
        </div>
        <span className="shrink-0 rounded-full border border-gray-300 px-[0.7em] py-[0.2em] text-[0.8em] text-gray-700">{content.status}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-[1.1em] border-b border-gray-200 bg-white px-[1.2em]">
        {content.tabs.map((tab) => (
          <span
            key={tab}
            className={`border-b-2 py-[0.55em] text-[0.85em] ${
              tab === content.activeTab ? 'border-teal-dark font-semibold text-black' : 'border-transparent text-gray-600'
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-[0.9em] p-[1.1em] @min-[26rem]:grid-cols-[1.45fr_1fr]">
        <div className="flex min-h-0 flex-col rounded-[0.8em] bg-white p-[0.9em] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-gray-200">
          <p className="text-[0.95em] font-semibold">{content.plan.title}</p>
          <p className="mt-[0.35em] text-[0.8em] text-gray-600">
            {content.plan.goal.label}: <span className="text-black">{content.plan.goal.value}</span>
          </p>
          <ul className="mt-[0.6em] divide-y divide-gray-100">
            {content.plan.channels.map((row) => (
              <li key={row.id} className="flex items-center gap-[0.6em] py-[0.45em]">
                <span className="w-[7em] shrink-0 whitespace-nowrap rounded-full bg-gray-100 px-[0.6em] py-[0.15em] text-center text-[0.75em] text-gray-800">
                  {row.channel}
                </span>
                <span className="min-w-0 truncate text-[0.85em]">{row.idea}</span>
              </li>
            ))}
          </ul>
          <span className="mt-[0.7em] inline-flex self-start rounded-full bg-teal-dark px-[0.9em] py-[0.35em] text-[0.8em] font-medium text-white">
            {content.plan.action}
          </span>
          {/* Follow-up question to the assistant – a look-alike field. */}
          <span className="mt-auto flex items-center justify-between gap-[0.6em] rounded-full border border-gray-300 px-[0.9em] py-[0.4em] text-[0.8em] text-gray-500">
            <span className="truncate">{content.plan.followUp}</span>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[1.1em] w-[1.1em] shrink-0" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h11M11 5.5 15.5 10 11 14.5" />
            </svg>
          </span>
        </div>

        <div className="hidden min-h-0 flex-col rounded-[0.8em] bg-white p-[0.9em] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-gray-200 @min-[26rem]:flex">
          <p className="text-[0.95em] font-semibold">{content.images.title}</p>
          <div className="mt-[0.6em] grid flex-1 grid-cols-2 gap-[0.45em]">
            {content.images.formats.map((format, i) => (
              <span
                key={format}
                className="flex items-end rounded-[0.5em] p-[0.4em] text-[0.7em] text-white"
                style={{
                  background: [
                    'linear-gradient(135deg, #0c3b34 0%, #00806d 100%)',
                    'linear-gradient(160deg, #1b1b1b 0%, #4a4a48 100%)',
                    'linear-gradient(135deg, #2a2723 0%, #7a6f62 100%)',
                    'linear-gradient(200deg, #00564a 0%, #121212 100%)',
                  ][i % 4],
                }}
              >
                {format}
              </span>
            ))}
          </div>
          <p className="mt-[0.5em] text-[0.75em] text-gray-600">{content.images.note}</p>
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
