'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import { cubicBezier, motion, useTransform, type MotionValue } from 'framer-motion';
import { CARD_EDGE, RADIUS, formatMoney } from '@/components/sections/for-dig/payment-cards/primitives';

/*
 * Scroll-driven demos for /tjanster/kampanjer (A1–A4). Each takes the scene's
 * progress (0 → 1, from ScrollScene) and plays one flow from the customer
 * portal forward: a campaign price, a code at checkout, a mailout, a tracking
 * link with its QR code. At 1 every demo rests in its final state, which is
 * also what reduced motion shows.
 *
 * Only opacity, transforms and text change while they play. Every box keeps
 * its size from the first frame, so nothing shifts the layout. No springs,
 * one calm easing curve, and nothing loops.
 *
 * Built from the payment-cards primitives – same three radii, same `.text-ui-*`
 * scale – so they read as the same product as the other campaign widgets.
 * Products are an unbranded carton, never a photo of a real product.
 */

export const smooth = cubicBezier(0.4, 0, 0.2, 1);
const CURRENCY = 'SEK';
const LOCALE = 'sv-SE';

/** 0 → 1 between `from` and `to` of the scene, clamped and eased. */
export function useStep(progress: MotionValue<number>, from: number, to: number) {
  return useTransform(progress, [from, to], [0, 1], { ease: smooth });
}

export const money = (amount: number) => formatMoney(amount, CURRENCY, LOCALE);
const count = (value: number) => new Intl.NumberFormat(LOCALE).format(value);

/* ── Shared pieces ──────────────────────────────────────────────────────── */

export function Card({ titleId, title, badge, children }: { titleId: string; title: string; badge?: ReactNode; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={`@container w-full bg-white p-5 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id={titleId} className="text-ui-title">
          {title}
        </h3>
        {badge}
      </div>
      {children}
    </div>
  );
}

export function Box({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`border border-gray-200 bg-white px-3.5 py-2.5 ${RADIUS.field} ${className}`}>
      <p className="text-ui-label text-gray-600">{label}</p>
      <div className="text-ui-body mt-0.5 text-black">{children}</div>
    </div>
  );
}

/** An unbranded carton – stands in for any product, in any line of business. */
export function Carton({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M5 11.5 16 6l11 5.5-11 5.5z" fill="#E2C9A1" />
      <path d="M5 11.5v11L16 28V17z" fill="#C9A57A" />
      <path d="M27 11.5v11L16 28V17z" fill="#B48F63" />
      <path d="m10.5 8.75 11 5.5v3.5" fill="none" stroke="#F3E6CF" strokeWidth="1.6" />
    </svg>
  );
}

function Thumb() {
  return (
    <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center bg-[#F4EEE5] ${RADIUS.field}`}>
      <Carton />
    </span>
  );
}

export function CheckMark({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.5 6.2 2.3 2.3 4.7-5" />
    </svg>
  );
}

/** Two labels in one spot, the second fading in over the first. */
function Swap({ show, from, to, className = '' }: { show: MotionValue<number>; from: ReactNode; to: ReactNode; className?: string }) {
  const hide = useTransform(show, (v) => 1 - v);
  return (
    <span className={`grid ${className}`}>
      <motion.span style={{ opacity: hide }} className="col-start-1 row-start-1" aria-hidden="true">
        {from}
      </motion.span>
      <motion.span style={{ opacity: show }} className="col-start-1 row-start-1">
        {to}
      </motion.span>
    </span>
  );
}

export function StatusPill({ show, idle, done }: { show: MotionValue<number>; idle: string; done: string }) {
  const hide = useTransform(show, (v) => 1 - v);
  return (
    <span className="text-ui-label relative inline-grid whitespace-nowrap">
      <motion.span style={{ opacity: hide }} className={`col-start-1 row-start-1 bg-gray-100 px-2.5 py-0.5 text-center text-gray-700 ${RADIUS.control}`} aria-hidden="true">
        {idle}
      </motion.span>
      <motion.span style={{ opacity: show }} className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-1 bg-teal-light px-2.5 py-0.5 font-semibold text-teal-darker ${RADIUS.control}`}>
        <CheckMark />
        {done}
      </motion.span>
    </span>
  );
}

/** A solid button look-alike that dips once when the scene "clicks" it. Illustration, not a control. */
export function PressButton({ progress, at, children, full = false }: { progress: MotionValue<number>; at: number; children: ReactNode; full?: boolean }) {
  const scale = useTransform(progress, [at - 0.03, at, at + 0.03], [1, 0.96, 1], { ease: smooth });
  return (
    <motion.span
      style={{ scale }}
      className={`text-ui-body inline-flex items-center justify-center gap-1.5 whitespace-nowrap bg-teal-dark px-4 py-2 text-white ${RADIUS.control} ${full ? 'w-full' : ''}`}
    >
      {children}
    </motion.span>
  );
}

/* ── A1 – a campaign price ──────────────────────────────────────────────── */

export type CampaignPriceDemoContent = {
  title: string;
  status: { idle: string; done: string };
  product: { label: string; name: string; note: string };
  discountType: { label: string; value: string };
  discountValue: { label: string; percent: number };
  start: { label: string; placeholder: string; value: string };
  end: { label: string; placeholder: string; value: string };
  activate: string;
  pricesTitle: string;
  priceLabels: { ordinary: string; sale: string };
  variants: { name: string; price: number }[];
};

function DateBox({ progress, from, to, content }: { progress: MotionValue<number>; from: number; to: number; content: CampaignPriceDemoContent['start'] }) {
  const show = useStep(progress, from, to);
  return (
    <Box label={content.label}>
      <Swap show={show} from={<span className="text-gray-500">{content.placeholder}</span>} to={<span className="tabular-nums">{content.value}</span>} />
    </Box>
  );
}

function VariantPrice({ progress, variant, rate, labels }: { progress: MotionValue<number>; variant: { name: string; price: number }; rate: number; labels: CampaignPriceDemoContent['priceLabels'] }) {
  const sale = Math.round(variant.price * (1 - rate) * 100) / 100;
  const strike = useStep(progress, 0.64, 0.72);
  const dim = useTransform(strike, [0, 1], [1, 0.62]);
  const saleIn = useStep(progress, 0.66, 0.74);
  const ticking = useTransform(progress, [0.7, 0.95], [variant.price, sale], { ease: smooth });
  const saleText = useTransform(ticking, (v) => money(Math.round(v)));

  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-ui-body flex min-w-0 items-center gap-2.5">
        <Thumb />
        <span className="truncate">{variant.name}</span>
      </span>
      <span className="flex flex-shrink-0 flex-col items-end tabular-nums">
        <motion.span style={{ opacity: saleIn }} className="text-ui-body font-semibold text-teal-dark">
          <span className="sr-only">{labels.sale} </span>
          <motion.span>{saleText}</motion.span>
        </motion.span>
        <motion.span style={{ opacity: dim }} className="text-ui-label relative text-black">
          <span className="sr-only">{labels.ordinary} </span>
          {money(variant.price)}
          <motion.span
            aria-hidden="true"
            style={{ scaleX: strike }}
            className="absolute left-0 right-0 top-1/2 h-px origin-left bg-current"
          />
        </motion.span>
      </span>
    </li>
  );
}

export function CampaignPriceDemo({ progress, content }: { progress: MotionValue<number>; content: CampaignPriceDemoContent }) {
  const titleId = useId();
  const c = content;
  const selected = useStep(progress, 0.02, 0.12);
  const percent = useTransform(progress, [0.14, 0.3], [0, c.discountValue.percent], { ease: smooth });
  const percentText = useTransform(percent, (v) => String(Math.round(v)));
  const active = useStep(progress, 0.58, 0.64);
  const rate = c.discountValue.percent / 100;

  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={active} idle={c.status.idle} done={c.status.done} />}>
      <div className="mt-4 space-y-2">
        <Box label={c.product.label}>
          <span className="flex items-center gap-2.5">
            <Thumb />
            <span className="min-w-0 flex-1 truncate">
              {c.product.name} <span className="text-gray-600">· {c.product.note}</span>
            </span>
            <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-gray-400">
              <motion.span
                style={{ opacity: selected, scale: selected }}
                className="absolute inset-[-1px] flex items-center justify-center rounded-full bg-teal-dark text-white"
              >
                <CheckMark />
              </motion.span>
            </span>
          </span>
        </Box>
        <div className="grid grid-cols-1 gap-2 @xs:grid-cols-2">
          <Box label={c.discountType.label}>
            <span className="block truncate">{c.discountType.value}</span>
          </Box>
          <Box label={c.discountValue.label}>
            <motion.span className="tabular-nums">{percentText}</motion.span>
          </Box>
          <DateBox progress={progress} from={0.32} to={0.42} content={c.start} />
          <DateBox progress={progress} from={0.42} to={0.52} content={c.end} />
        </div>
      </div>

      <div className="mt-3">
        <PressButton progress={progress} at={0.57} full>
          {c.activate}
        </PressButton>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3">
        <p className="text-ui-overline text-gray-600">{c.pricesTitle}</p>
        <ul className="divide-y divide-gray-100">
          {c.variants.map((variant) => (
            <VariantPrice key={variant.name} progress={progress} variant={variant} rate={rate} labels={c.priceLabels} />
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ── A2 – a code at checkout ────────────────────────────────────────────── */

export type CodeKind = 'percent' | 'amount';

export type PromoCheckoutDemoContent = {
  toggle: { label: string; options: Record<CodeKind, string> };
  codes: Record<CodeKind, { code: string; percent?: number; amount?: number; rules: string }>;
  title: string;
  item: { name: string; note: string; price: number };
  codeLabel: string;
  codePlaceholder: string;
  valid: string;
  subtotal: string;
  discount: string;
  total: string;
};

function KindToggle({ content, value, onChange }: { content: PromoCheckoutDemoContent['toggle']; value: CodeKind; onChange: (v: CodeKind) => void }) {
  const labelId = useId();
  const name = useId();
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <p id={labelId} className="text-ui-label whitespace-nowrap text-gray-700">
        {content.label}
      </p>
      <div role="radiogroup" aria-labelledby={labelId} className={`grid grid-cols-2 gap-1 border border-gray-500 bg-white p-1 ${RADIUS.control}`}>
        {(Object.keys(content.options) as CodeKind[]).map((option) => {
          const checked = option === value;
          return (
            <label key={option} className="relative block cursor-pointer">
              <input type="radio" name={name} value={option} checked={checked} onChange={() => onChange(option)} className="peer sr-only" />
              <span
                className={`text-ui-label block whitespace-nowrap px-3 py-1 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-teal peer-focus-visible:ring-offset-2 ${RADIUS.control} ${
                  checked ? 'bg-teal-dark text-white' : 'text-black'
                }`}
              >
                {content.options[option]}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function Checkout({ progress, content, kind }: { progress: MotionValue<number>; content: PromoCheckoutDemoContent; kind: CodeKind }) {
  const titleId = useId();
  const c = content;
  const code = c.codes[kind];
  const off = kind === 'percent' ? Math.round(c.item.price * (code.percent ?? 0)) / 100 : code.amount ?? 0;

  const typed = useTransform(progress, [0.06, 0.4], [0, code.code.length]);
  const typedText = useTransform(typed, (v) => code.code.slice(0, Math.floor(v + 0.0001)));
  const placeholder = useTransform(progress, [0.04, 0.06], [1, 0]);
  const caret = useTransform(progress, [0.03, 0.05, 0.42, 0.44], [0, 1, 1, 0]);
  const valid = useStep(progress, 0.46, 0.54);
  const fieldBorder = useTransform(valid, [0, 1], ['rgb(229 231 235)', 'rgb(0 128 109)']);
  const rules = useStep(progress, 0.5, 0.58);
  const discountIn = useStep(progress, 0.56, 0.62);
  const discount = useTransform(progress, [0.58, 0.88], [0, off], { ease: smooth });
  const discountText = useTransform(discount, (v) => `−${money(Math.round(v))}`);
  const totalText = useTransform(discount, (v) => money(c.item.price - Math.round(v)));

  return (
    <Card titleId={titleId} title={c.title}>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-ui-body flex min-w-0 items-center gap-2.5">
          <Thumb />
          <span className="truncate">
            {c.item.name} <span className="text-gray-600">· {c.item.note}</span>
          </span>
        </span>
        <span className="text-ui-body flex-shrink-0 tabular-nums">{money(c.item.price)}</span>
      </div>

      <motion.div style={{ borderColor: fieldBorder }} className={`mt-4 border bg-white px-3.5 py-2.5 ${RADIUS.field}`}>
        <p className="text-ui-label text-gray-600">{c.codeLabel}</p>
        <div className="text-ui-body mt-0.5 flex items-center justify-between gap-3">
          <span className="relative flex min-w-0 items-center font-mono font-semibold tracking-[0.14em]">
            <motion.span style={{ opacity: placeholder }} className="absolute left-0 whitespace-nowrap font-sans font-normal tracking-normal text-gray-500" aria-hidden="true">
              {c.codePlaceholder}
            </motion.span>
            <motion.span>{typedText}</motion.span>
            <motion.span style={{ opacity: caret }} aria-hidden="true" className="ml-px inline-block h-[1.1em] w-px bg-black" />
          </span>
          <motion.span style={{ opacity: valid }} className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-dark text-white">
            <CheckMark />
          </motion.span>
        </div>
      </motion.div>
      <div className="mt-1.5 min-h-[2.5rem] px-1">
        <motion.p style={{ opacity: valid }} className="text-ui-label font-semibold text-teal-darker">
          {c.valid}
        </motion.p>
        <motion.p style={{ opacity: rules }} className="text-ui-label text-gray-600">
          {code.rules}
        </motion.p>
      </div>

      <dl className="mt-2 space-y-1.5 border-t border-gray-200 pt-3 tabular-nums">
        <div className="text-ui-body flex justify-between gap-3">
          <dt className="text-gray-600">{c.subtotal}</dt>
          <dd>{money(c.item.price)}</dd>
        </div>
        <motion.div style={{ opacity: discountIn }} className="text-ui-body flex justify-between gap-3">
          <dt className="text-gray-600">{c.discount}</dt>
          <dd className="text-teal-dark">
            <motion.span>{discountText}</motion.span>
          </dd>
        </motion.div>
        <div className="text-ui-title flex justify-between gap-3 pt-1">
          <dt>{c.total}</dt>
          <dd>
            <motion.span>{totalText}</motion.span>
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export function PromoCheckoutDemo({ progress, content }: { progress: MotionValue<number>; content: PromoCheckoutDemoContent }) {
  const [kind, setKind] = useState<CodeKind>('percent');
  return (
    <div>
      <KindToggle content={content.toggle} value={kind} onChange={setKind} />
      {/* Keyed, so switching example starts a fresh checkout with its own transforms. */}
      <Checkout key={kind} progress={progress} content={content} kind={kind} />
    </div>
  );
}

/* ── A3 – a mailout ─────────────────────────────────────────────────────── */

export type EmailSendDemoContent = {
  title: string;
  recipients: { label: string; value: string; count: number; suffix: string };
  mail: { subject: string; button: string; fromLabel: string; from: string; unsubscribe: string };
  test: string;
  send: string;
  status: { idle: string; done: string };
  sent: string;
};

export function EmailSendDemo({ progress, content }: { progress: MotionValue<number>; content: EmailSendDemoContent }) {
  const titleId = useId();
  const c = content;
  const counted = useTransform(progress, [0.04, 0.32], [0, c.recipients.count], { ease: smooth });
  const countText = useTransform(counted, (v) => count(Math.round(v)));
  const fly = useStep(progress, 0.42, 0.62);
  const flyX = useTransform(fly, [0, 1], [0, 16]);
  const flyY = useTransform(fly, [0, 1], [0, -20]);
  const flyOpacity = useTransform(fly, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
  const sent = useStep(progress, 0.62, 0.74);

  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={sent} idle={c.status.idle} done={c.status.done} />}>
      <Box label={c.recipients.label} className="mt-4">
        <span className="block truncate">{c.recipients.value}</span>
      </Box>
      <p className="text-ui-label mt-1.5 px-1 text-gray-700">
        <motion.span className="font-semibold tabular-nums text-black">{countText}</motion.span> {c.recipients.suffix}
      </p>

      {/* The mail itself, as the recipient sees it. */}
      <div className={`mt-3 border border-gray-200 bg-gray-50 p-3.5 ${RADIUS.field}`}>
        <p className="text-ui-body font-semibold">{c.mail.subject}</p>
        <div aria-hidden="true" className={`mt-2.5 h-14 overflow-hidden bg-teal-light ${RADIUS.field}`}>
          <div className="ml-auto mr-6 mt-3 h-12 w-12 rounded-full bg-teal/30" />
        </div>
        <div aria-hidden="true" className="mt-3 space-y-1.5">
          <div className="h-1.5 w-11/12 rounded-full bg-gray-200" />
          <div className="h-1.5 w-8/12 rounded-full bg-gray-200" />
        </div>
        <span className={`text-ui-label mt-3 inline-flex bg-black px-3 py-1 text-white ${RADIUS.control}`}>{c.mail.button}</span>
        <p className="text-ui-label mt-3 border-t border-gray-200 pt-2 text-gray-600">
          {c.mail.fromLabel} {c.mail.from} · <span className="underline underline-offset-2">{c.mail.unsubscribe}</span>
        </p>
      </div>

      <div className="relative mt-3 flex flex-wrap items-center justify-end gap-2">
        <span className={`text-ui-label inline-flex whitespace-nowrap border border-gray-200 px-3.5 py-2 text-black ${RADIUS.control}`}>{c.test}</span>
        <PressButton progress={progress} at={0.4}>
          {c.send}
        </PressButton>
        {/* A small envelope leaves the button: the only movement in the send. */}
        <motion.span
          aria-hidden="true"
          style={{ x: flyX, y: flyY, opacity: flyOpacity }}
          className="pointer-events-none absolute bottom-2.5 right-0 text-teal-dark"
        >
          <svg viewBox="0 0 20 16" className="h-4 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1.5" y="1.5" width="17" height="13" rx="2" fill="white" />
            <path d="m2 3 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </div>
      <motion.p style={{ opacity: sent }} className="text-ui-label mt-2 flex items-center justify-end gap-1 font-semibold text-teal-darker">
        <CheckMark />
        {c.sent}
      </motion.p>
    </Card>
  );
}

/* ── A4 – a tracking link and its QR code ───────────────────────────────── */

export type TrackingDemoContent = {
  title: string;
  channel: { label: string; value: string };
  linkLabel: string;
  link: string;
  copy: string;
  qrButton: string;
  qr: { label: string; caption: string; rows: string[] };
  results: { title: string; unit: string; channels: { name: string; value: number }[] };
};

/** One group of QR modules, drawn together. */
function QrLayer({ d, opacity }: { d: string; opacity: MotionValue<number> }) {
  return <motion.path d={d} style={{ opacity }} />;
}

function QrLayerAt({ progress, d, from, to }: { progress: MotionValue<number>; d: string; from: number; to: number }) {
  const opacity = useStep(progress, from, to);
  return <QrLayer d={d} opacity={opacity} />;
}

const QR_START = 0.24;
const QR_END = 0.58;
const QR_LAYERS = 12;

/**
 * A real, scannable QR code (rows of '1'/'0' from the data file), drawn module by
 * module: the three finder squares first, then the rest in diagonal sweeps from
 * the top left. At the end of the sweep every module is on.
 */
function QrCode({ progress, rows, label }: { progress: MotionValue<number>; rows: string[]; label: string }) {
  const size = rows.length;
  const quiet = 4;
  const layers = useMemo(() => {
    const isFinder = (x: number, y: number) =>
      (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
    const paths: string[] = Array.from({ length: QR_LAYERS + 1 }, () => '');
    rows.forEach((row, y) => {
      for (let x = 0; x < size; x++) {
        if (row[x] !== '1') continue;
        const layer = isFinder(x, y) ? 0 : 1 + Math.min(QR_LAYERS - 1, Math.floor(((x + y) / (2 * size - 1)) * QR_LAYERS));
        paths[layer] += `M${x + quiet} ${y + quiet}h1v1h-1z`;
      }
    });
    return paths;
  }, [rows, size]);

  const span = (QR_END - QR_START) / (QR_LAYERS + 1);
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${size + quiet * 2} ${size + quiet * 2}`}
      shapeRendering="crispEdges"
      className="block h-auto w-full"
    >
      <rect width={size + quiet * 2} height={size + quiet * 2} fill="#fff" />
      <g fill="#111">
        {layers.map((d, i) => (
          <QrLayerAt key={i} progress={progress} d={d} from={QR_START + i * span} to={QR_START + (i + 1) * span} />
        ))}
      </g>
    </svg>
  );
}

function ResultBar({ progress, name, value, max, index, unit }: { progress: MotionValue<number>; name: string; value: number; max: number; index: number; unit: string }) {
  const from = 0.62 + index * 0.06;
  const grow = useStep(progress, from, from + 0.2);
  const width = useTransform(grow, [0, 1], [0, value / max]);
  const valueText = useTransform(grow, (v) => count(Math.round(v * value)));
  return (
    <li>
      <div className="text-ui-label flex items-baseline justify-between gap-2">
        <span className="truncate text-gray-700">{name}</span>
        <span className="tabular-nums text-black">
          <motion.span>{valueText}</motion.span>
          <span className="sr-only"> {unit}</span>
        </span>
      </div>
      <div className={`mt-1 h-2 overflow-hidden bg-gray-100 ${RADIUS.control}`}>
        <motion.div style={{ scaleX: width }} className={`h-full origin-left bg-teal-dark ${RADIUS.control}`} />
      </div>
    </li>
  );
}

export function TrackingDemo({ progress, content }: { progress: MotionValue<number>; content: TrackingDemoContent }) {
  const titleId = useId();
  const c = content;
  const linkIn = useStep(progress, 0.04, 0.2);
  const linkClip = useTransform(linkIn, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`);
  const buttonsIn = useStep(progress, 0.18, 0.24);
  const max = Math.max(...c.results.channels.map((ch) => ch.value));
  const shownLink = c.link.replace(/^https?:\/\//, '');

  return (
    <Card titleId={titleId} title={c.title}>
      <Box label={c.channel.label} className="mt-4">
        <span className="block truncate">{c.channel.value}</span>
      </Box>

      <div className={`mt-2 border border-gray-200 bg-gray-50 px-3.5 py-2.5 ${RADIUS.field}`}>
        <p className="text-ui-label text-gray-600">{c.linkLabel}</p>
        <motion.p style={{ clipPath: linkClip }} className="text-ui-label mt-0.5 truncate font-mono text-black">
          {shownLink}
        </motion.p>
        <motion.div style={{ opacity: buttonsIn }} className="mt-2 flex gap-2" aria-hidden="true">
          <span className={`text-ui-label border border-gray-300 bg-white px-3 py-1 ${RADIUS.control}`}>{c.copy}</span>
          <span className={`text-ui-label border border-gray-300 bg-white px-3 py-1 ${RADIUS.control}`}>{c.qrButton}</span>
        </motion.div>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] items-start gap-4 @xs:grid-cols-[minmax(0,9rem)_minmax(0,1fr)]">
        <figure>
          <div className={`overflow-hidden border border-gray-200 ${RADIUS.field}`}>
            <QrCode progress={progress} rows={c.qr.rows} label={c.qr.label} />
          </div>
          <figcaption className="text-ui-label mt-1.5 text-gray-600">{c.qr.caption}</figcaption>
        </figure>
        <div>
          <p className="text-ui-overline text-gray-600">{c.results.title}</p>
          <ul className="mt-2 space-y-2.5">
            {c.results.channels.map((ch, i) => (
              <ResultBar key={ch.name} progress={progress} name={ch.name} value={ch.value} max={max} index={i} unit={c.results.unit} />
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
