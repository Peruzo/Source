'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { CARD_EDGE, RADIUS } from '../payment-cards/primitives';

/*
 * Building blocks for the interactive "För dig" widgets. Same three radii as the
 * payment cards (card 24 / field 12 / control pill), but a LARGER type scale: the
 * shared `.text-ui-*` classes stop at 12 px for labels (they are also Remotion
 * textures), and these widgets have to read at 13 px and up on desktop.
 *
 *   T.title  18 px / 600     T.body  15 px / 500     T.label  13 px / 500
 *
 * Everything that moves uses opacity and transform only, so nothing on the page
 * shifts while a sequence plays, and every transition is switched off under
 * reduced motion (the sequence then shows its final step straight away).
 */
export const T = {
  title: 'text-[1.125rem] font-semibold leading-snug tracking-[-0.01em]',
  body: 'text-[0.9375rem] font-medium leading-[1.45]',
  label: 'text-[0.8125rem] font-medium leading-[1.4]',
  amount: 'text-[1.75rem] font-semibold leading-none tracking-[-0.02em] md:text-[2rem]',
  overline: 'text-[0.75rem] font-semibold uppercase leading-[1.4] tracking-[0.08em]',
} as const;

/** Calm motion: one ease, no overshoot. */
export const EASE = 'ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none';

/**
 * The white card every widget sits in: title, optional actions on the right, the
 * body, and a quiet "Spela igen" button at the bottom – a real button, so the
 * replay is reachable with the keyboard. `label` names the example for screen
 * readers ("Exempel: …").
 */
export function WidgetShell({
  title,
  label,
  actions,
  onReplay,
  replayLabel = 'Spela igen',
  children,
  className = '',
  innerRef,
}: {
  title: string;
  label: string;
  actions?: ReactNode;
  onReplay?: () => void;
  replayLabel?: string;
  children: ReactNode;
  className?: string;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  const titleId = useId();

  return (
    <div
      ref={innerRef}
      role="group"
      aria-labelledby={titleId}
      className={`@container relative w-full bg-white p-4 text-left text-black sm:p-5 md:p-6 ${CARD_EDGE} ${RADIUS.card} ${className}`}
    >
      <p className="sr-only">{label}</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id={titleId} className={T.title}>
          {title}
        </h3>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      <div className="mt-4">{children}</div>

      {onReplay ? <ReplayButton onClick={onReplay} label={replayLabel} /> : null}
    </div>
  );
}

/** "Spela igen": plays the example from the start. */
export function ReplayButton({ onClick, label = 'Spela igen' }: { onClick: () => void; label?: string }) {
  return (
    <div className="mt-4 flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className={`${T.label} inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${RADIUS.control}`}
      >
        <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
    </div>
  );
}

/**
 * Button look-alike inside the illustration (a span: a focusable button that does
 * nothing would be a dead tab stop – its text is still read). `pressed` sinks it
 * for a moment, the way a click looks.
 */
export function UiButton({
  children,
  tone = 'accent',
  pressed = false,
  icon,
  block = false,
  className = '',
}: {
  children: ReactNode;
  tone?: 'accent' | 'dark' | 'quiet' | 'danger';
  pressed?: boolean;
  icon?: ReactNode;
  block?: boolean;
  className?: string;
}) {
  const tones = {
    accent: 'bg-teal-dark text-white',
    dark: 'bg-black text-white',
    quiet: 'border border-gray-300 bg-white text-black',
    danger: 'border border-gray-300 bg-white text-red-700',
  } as const;

  return (
    <span
      className={`${T.label} ${block ? 'flex w-full justify-center' : 'inline-flex'} items-center gap-1.5 whitespace-nowrap px-3.5 py-2 transition-[transform,box-shadow] duration-150 ${EASE} ${RADIUS.control} ${tones[tone]} ${
        pressed ? 'scale-95 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] ring-4 ring-teal-dark/20' : ''
      } ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

/** Read-only field: label over value in a bordered box, at the larger scale. */
export function UiField({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 border border-gray-200 bg-white px-3.5 py-2.5 ${RADIUS.field} ${className}`}>
      <p className={`${T.label} text-gray-600`}>{label}</p>
      <div className={`${T.body} mt-0.5 min-w-0 truncate text-black`}>{children}</div>
    </div>
  );
}

export function PlusGlyph({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path strokeLinecap="round" d="M10 4.5v11M4.5 10h11" />
    </svg>
  );
}

/**
 * A dialog drawn over the widget's body: a soft dim and a white panel that
 * fades and lifts in. Absolutely positioned inside the body, so opening it
 * never moves anything. Not a real dialog (no focus trap): it is part of the
 * illustration, and hidden from assistive tech while closed.
 */
export function Popup({
  open,
  title,
  children,
  align = 'center',
  className = '',
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  align?: 'center' | 'top';
  className?: string;
}) {
  const titleId = useId();

  return (
    <div
      aria-hidden={!open}
      className={`absolute inset-0 z-20 flex justify-center p-2 transition-opacity duration-300 sm:p-4 ${EASE} ${
        align === 'center' ? 'items-center' : 'items-start'
      } ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div className={`absolute inset-0 bg-black/25 ${RADIUS.card}`} />
      <div
        role="group"
        aria-labelledby={titleId}
        className={`relative w-full max-w-[26rem] bg-white p-4 text-left text-black shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.04)] transition-transform duration-300 sm:p-5 ${EASE} ${RADIUS.card} ${
          open ? 'translate-y-0 scale-100' : 'translate-y-3 scale-[0.98]'
        } ${className}`}
      >
        <h4 id={titleId} className={T.title}>
          {title}
        </h4>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

/**
 * A list with a fixed number of visible rows where a new row slides in at the
 * top. All rows are rendered at all times; the stack is moved with a transform
 * inside a clipped frame of exactly `visible` rows, so the frame never changes
 * height and nothing below it moves. Before `added` the new row sits just above
 * the frame; after it, the stack slides down one row and the last row leaves
 * through the bottom edge.
 *
 * `rowHeight` must hold the tallest row at every width – pass a CSS length.
 */
export function SlideInList<T extends { id: string }>({
  label,
  newRow,
  rows,
  added,
  rowHeight,
  render,
}: {
  label: string;
  newRow: T;
  rows: T[];
  added: boolean;
  rowHeight: string;
  render: (row: T, isNew: boolean) => ReactNode;
}) {
  const visible = rows.length;

  return (
    <div className="relative overflow-hidden border-y border-gray-200" style={{ height: `calc(${rowHeight} * ${visible})` }}>
      <ul
        aria-label={label}
        className={`transition-transform duration-500 ${EASE}`}
        style={{ transform: added ? 'translateY(0)' : `translateY(calc(-1 * ${rowHeight}))` }}
      >
        <li
          aria-hidden={!added}
          className={`flex items-center border-b border-gray-200 transition-colors duration-[1200ms] ${added ? 'bg-teal/5' : 'bg-white'}`}
          style={{ height: rowHeight }}
        >
          {render(newRow, true)}
        </li>
        {rows.map((row, i) => (
          <li
            key={row.id}
            // The row pushed out through the bottom edge leaves the accessibility tree too.
            aria-hidden={added && i === rows.length - 1}
            className="flex items-center border-b border-gray-200 last:border-b-0"
            style={{ height: rowHeight }}
          >
            {render(row, false)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Small outlined pill (kind, status). */
export function Pill({ children, tone = 'outline' }: { children: ReactNode; tone?: 'outline' | 'solid' | 'paid' | 'muted' }) {
  const tones = {
    outline: 'border border-gray-300 text-gray-700',
    solid: 'bg-black text-white',
    paid: 'bg-status-paid-bg text-status-paid',
    muted: 'bg-gray-100 text-black',
  } as const;
  return (
    <span className={`${T.label} inline-flex shrink-0 items-center whitespace-nowrap px-2.5 py-0.5 ${RADIUS.control} ${tones[tone]}`}>
      {children}
    </span>
  );
}
