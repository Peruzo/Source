'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';

/*
 * Shared building blocks for the three payment cards.
 *
 * Corner radii – exactly three, one per level, never mixed:
 *   card    → RADIUS.card    (24px)
 *   field   → RADIUS.field   (12px)
 *   control → RADIUS.control (pill – buttons and switches alike)
 */
export const RADIUS = {
  card: 'rounded-3xl',
  field: 'rounded-xl',
  control: 'rounded-full',
} as const;

/** Swedish money format: "1 245,00 kr". Non-breaking space as thousands separator. */
export function formatMoney(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Same as formatMoney without the currency symbol – for fields that show it separately. */
export function formatNumber(amount: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

type CardShellProps = {
  /** Accessible name for the card when it has no visible heading. */
  label?: string;
  /** Id of the visible heading that names the card. */
  labelledBy?: string;
  /** The emphasised middle card: slightly larger and lifted from `lg`. */
  featured?: boolean;
  /** Content that sits flush against the card edge (e.g. an image header). */
  flush?: boolean;
  children: ReactNode;
};

export function CardShell({ label, labelledBy, featured, flush, children }: CardShellProps) {
  return (
    <div
      role="group"
      aria-label={label}
      aria-labelledby={labelledBy}
      className={`relative w-full overflow-hidden bg-white text-left text-black ${RADIUS.card} ${
        flush ? '' : 'p-5'
      } ${
        featured
          ? 'z-10 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08)] lg:scale-[1.06]'
          : 'shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)]'
      }`}
    >
      {children}
    </div>
  );
}

/** Title row: back arrow · title · optional three-dot menu. The icons are illustration, not controls. */
export function CardHeader({
  titleId,
  title,
  withMenu = false,
}: {
  titleId: string;
  title: string;
  withMenu?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center bg-gray-100 text-black ${RADIUS.control}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 4.5 7 10l5.5 5.5" />
        </svg>
      </span>

      <h3 id={titleId} className="text-ui-title flex-1 truncate">
        {title}
      </h3>

      {withMenu ? (
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center text-gray-600 ${RADIUS.control}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <circle cx="4" cy="10" r="1.6" />
            <circle cx="10" cy="10" r="1.6" />
            <circle cx="16" cy="10" r="1.6" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}

/** Read-only field: small label over a value, in a bordered box. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={`border border-gray-200 bg-white px-3.5 py-2.5 ${RADIUS.field}`}>
      <p className="text-ui-label text-gray-600">{label}</p>
      <div className="text-ui-body mt-0.5 text-black">{children}</div>
    </div>
  );
}

export function Subheading({ children }: { children: ReactNode }) {
  return <p className="text-ui-overline text-gray-600">{children}</p>;
}

/**
 * Button look-alike. Rendered as a span on purpose: these cards illustrate an
 * interface, and a focusable button that does nothing is a dead tab stop.
 */
export function FauxButton({
  children,
  variant = 'solid',
  icon,
}: {
  children: ReactNode;
  variant?: 'solid' | 'quiet';
  icon?: ReactNode;
}) {
  return (
    <span
      className={`text-ui-label inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 ${RADIUS.control} ${
        variant === 'solid' ? 'bg-black text-white' : 'border border-gray-200 text-black'
      }`}
    >
      {icon}
      {children}
    </span>
  );
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <path strokeLinecap="round" d="M10 4.5v11M4.5 10h11" />
    </svg>
  );
}

/**
 * A real switch: native button, `role="switch"`, `aria-checked` follows state,
 * name comes from the visible label. Space/Enter toggle it for free since it is
 * a <button>. Uncontrolled – `defaultOn` sets the starting state, which is also
 * what a static render (Remotion texture) shows.
 *
 * On-state is `teal-dark`, not `teal`: the track has to clear 3:1 against the
 * white card (WCAG 1.4.11). `teal` only reaches ~2.3:1, and knob position alone
 * is not enough for a single switch with nothing next to it to compare against.
 */
export function SwitchRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  const labelId = useId();

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span id={labelId} className="text-ui-body text-black">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={labelId}
        onClick={() => setOn((value) => !value)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${RADIUS.control} ${
          on ? 'bg-teal-dark' : 'bg-gray-300'
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-5 w-5 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-200 ${RADIUS.control} ${
            on ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
