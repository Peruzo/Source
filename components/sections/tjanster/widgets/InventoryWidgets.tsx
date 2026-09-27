'use client';

import { useEffect, useId, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { CardShell, RADIUS } from '@/components/sections/for-dig/payment-cards/primitives';
import { Ean13Barcode } from './Ean13Barcode';

/*
 * The three inventory widgets for StickySteps. Same visual vocabulary as the
 * "För dig" widgets – CardShell, the three radii and the `.text-ui-*` scale –
 * so the service pages read as the same product. They are drawn stills of the
 * portal's own screens (labels as in public/js/inventory-recommendations.js),
 * not screenshots, and the buttons are look-alikes, not controls.
 *
 * `active` is true once the visitor reaches the step. Each widget animates its
 * one change on arrival and never under reduced motion.
 */

type ProductLine = { product: string; variant: string };

function ProductTile() {
  return (
    <span
      aria-hidden="true"
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center bg-surface-stone text-gray-700 ${RADIUS.field}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path strokeLinejoin="round" d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
        <path strokeLinejoin="round" d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
      </svg>
    </span>
  );
}

/** a – camera view with the barcode, and the product it resolved to. */
export function ScanCard({
  active,
  title,
  found,
  ean,
  product,
  variant,
}: { active: boolean; title: string; found: string; ean: string } & ProductLine) {
  const reduce = usePrefersReducedMotion();
  const titleId = useId();

  return (
    <CardShell labelledBy={titleId}>
      <h3 id={titleId} className="text-ui-title">
        {title}
      </h3>

      <div className={`relative mt-3 overflow-hidden bg-gray-900 px-6 py-5 ${RADIUS.field}`}>
        <div className="relative mx-auto max-w-[220px]">
          <Ean13Barcode code={ean} className="block w-full rounded-sm" />
          {/* Viewfinder corners */}
          {['-left-2 -top-2 border-l-2 border-t-2', '-right-2 -top-2 border-r-2 border-t-2', '-bottom-2 -left-2 border-b-2 border-l-2', '-bottom-2 -right-2 border-b-2 border-r-2'].map((pos) => (
            <span key={pos} aria-hidden="true" className={`absolute h-5 w-5 rounded-[3px] border-teal ${pos}`} />
          ))}
          {/* Scan line: sweeps once on arrival, then rests on the code. */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 h-0.5 bg-teal shadow-[0_0_12px_2px_rgba(0,191,166,0.6)]"
            initial={false}
            animate={{ top: active && !reduce ? ['8%', '82%', '45%'] : '45%' }}
            transition={{ duration: reduce ? 0 : 1.4, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <ProductTile />
        <div className="min-w-0 flex-1">
          <p className="text-ui-body truncate text-black">{product}</p>
          <p className="text-ui-label truncate text-gray-600">{variant}</p>
        </div>
        <span className={`text-ui-label bg-teal-light px-2.5 py-1 font-semibold text-teal-darkest ${RADIUS.control}`}>
          {found}
        </span>
      </div>
    </CardShell>
  );
}

/** b – the variant's stock, counting up by the scanned unit. */
export function StockCounter({
  active,
  title,
  from,
  to,
  note,
  product,
  variant,
}: { active: boolean; title: string; from: number; to: number; note: string } & ProductLine) {
  const reduce = usePrefersReducedMotion();
  const titleId = useId();
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!active) {
      setValue(from);
      return;
    }
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(from, to, {
      duration: 0.9,
      delay: 0.35,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [active, reduce, from, to]);

  const done = value === to;

  return (
    <CardShell labelledBy={titleId}>
      <div className="flex items-center gap-3">
        <ProductTile />
        <div className="min-w-0 flex-1">
          <h3 id={titleId} className="text-ui-body truncate text-black">
            {product}
          </h3>
          <p className="text-ui-label truncate text-gray-600">{variant}</p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-ui-label text-gray-600">{title}</p>
          {/* The count is decoration while it runs; screen readers get the result. */}
          <p className="text-ui-amount tabular-nums text-black" aria-live="off">
            <span aria-hidden="true">{value}</span>
            <span className="sr-only">{to}</span>
          </p>
        </div>
        <motion.span
          initial={false}
          animate={{ opacity: done ? 1 : 0, y: done ? 0 : 6 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          className={`text-ui-label bg-teal-light px-2.5 py-1 font-semibold tabular-nums text-teal-darkest ${RADIUS.control}`}
        >
          +{to - from}
        </motion.span>
      </div>

      <p className="text-ui-label mt-3 flex items-center gap-2 text-gray-600">
        <span aria-hidden="true" className="relative flex h-2 w-2">
          {!reduce ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" /> : null}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-dark" />
        </span>
        {note}
      </p>
    </CardShell>
  );
}

/** c – one row of "Rekommenderade inköp", with the suggested quantity. */
export function RestockSuggestion({
  active,
  title,
  priority,
  stock,
  perWeek,
  coverDays,
  suggested,
  reasons,
  snooze,
  product,
  variant,
}: {
  active: boolean;
  title: string;
  priority: string;
  stock: number;
  perWeek: number;
  coverDays: number;
  suggested: number;
  reasons: readonly string[];
  snooze: string;
} & ProductLine) {
  const reduce = usePrefersReducedMotion();
  const titleId = useId();
  const nf = new Intl.NumberFormat('sv-SE');

  const facts: [string, string, boolean?][] = [
    ['Saldo', nf.format(stock)],
    ['Per vecka', nf.format(perWeek)],
    ['Täcker', `${nf.format(coverDays)} dagar`],
    ['Föreslaget', `${nf.format(suggested)} st`, true],
  ];

  return (
    <CardShell labelledBy={titleId}>
      <h3 id={titleId} className="text-ui-title">
        {title}
      </h3>

      <div className="mt-3 flex items-center gap-3">
        <p className="text-ui-body min-w-0 flex-1 truncate text-black">
          {product} – {variant}
        </p>
        <span className={`text-ui-label bg-status-unpaid-bg px-2.5 py-1 font-semibold text-status-unpaid ${RADIUS.control}`}>
          {priority}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2">
        {facts.map(([label, value, strong]) => (
          <div
            key={label}
            className={`px-2.5 py-2 ${RADIUS.field} ${strong ? 'bg-teal-light' : 'bg-gray-100'}`}
          >
            <dt className="text-ui-label text-gray-600">{label}</dt>
            <dd className={`text-ui-body tabular-nums ${strong ? 'font-semibold text-teal-darkest' : 'text-black'}`}>
              {strong ? (
                <motion.span
                  className="inline-block"
                  initial={false}
                  animate={{ scale: active && !reduce ? [1, 1.12, 1] : 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {value}
                </motion.span>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Skäl">
        {reasons.map((reason) => (
          <li key={reason} className={`text-ui-label border border-gray-200 px-2.5 py-0.5 text-gray-700 ${RADIUS.control}`}>
            {reason}
          </li>
        ))}
      </ul>

      <span
        aria-hidden="true"
        className={`text-ui-label mt-3 inline-flex border border-gray-200 px-3 py-1.5 font-semibold text-gray-800 ${RADIUS.control}`}
      >
        {snooze}
      </span>
    </CardShell>
  );
}
