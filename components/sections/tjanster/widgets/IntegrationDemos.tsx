'use client';

import { useId, type ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { RADIUS } from '@/components/sections/for-dig/payment-cards/primitives';
import {
  Box,
  Card,
  CheckMark,
  PressButton,
  StatusPill,
  money,
  useStep,
} from '@/components/sections/tjanster/widgets/CampaignDemos';

/*
 * Widgets for /integrationer. The two scenes (Fortnox connect, Stripe to Fortnox)
 * follow the ScrollScene contract of CampaignDemos and BookkeepingDemos: they take
 * the scene's progress (0 → 1), only opacity, transforms and text change while
 * they play, every box keeps its size from the first frame, and at 1 they rest in
 * the final state – which is also what reduced motion shows. The three cards are
 * static.
 *
 * Third-party names are text. Only Fortnox has a logo, the file already on the
 * site (public/fortnoxlogo.png), always with its name as alt text.
 */

/** A pill that is already in its final state (the static cards). */
function Pill({ tone, children }: { tone: 'done' | 'muted'; children: ReactNode }) {
  return tone === 'done' ? (
    <span className={`text-ui-label inline-flex items-center gap-1 whitespace-nowrap bg-teal-light px-2.5 py-0.5 font-semibold text-teal-darker ${RADIUS.control}`}>
      <CheckMark />
      {children}
    </span>
  ) : (
    <span className={`text-ui-label whitespace-nowrap bg-gray-100 px-2.5 py-0.5 text-gray-700 ${RADIUS.control}`}>{children}</span>
  );
}

/**
 * The file has wide white margins round the wordmark (about a quarter of the height
 * above and below, a tenth of the width to the left). The negative margins take them
 * back, so the wordmark sits on the text line at about the height of the names.
 */
function FortnoxLogo({ src, size = 'sm' }: { src: string; size?: 'sm' | 'md' }) {
  const fit = size === 'md' ? 'h-9 -my-[9px] -ml-[10px]' : 'h-[30px] -my-[7px] -ml-2';
  // A plain <img>: next.config has images.unoptimized, and the logo needs no srcset.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="Fortnox" width={2955} height={1040} className={`block w-auto max-w-none ${fit}`} />;
}

/* ── I1 / I8 – the integrations in the portal ─────────────────────────────── */

export type IntegrationListContent = {
  title: string;
  connect: string;
  connected: string;
  comingSoon: string;
  items: { id: string; name: string; description: string; logo?: string; comingSoon?: boolean }[];
};

/** `connected` shows every live integration as connected (the closing section). */
export function IntegrationListCard({ content, connected = false }: { content: IntegrationListContent; connected?: boolean }) {
  const titleId = useId();
  const c = content;
  return (
    <Card titleId={titleId} title={c.title}>
      <ul className="mt-3 divide-y divide-gray-100">
        {c.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-2.5">
            <div className="min-w-0 flex-1">
              {item.logo ? (
                <p>
                  <FortnoxLogo src={item.logo} />
                </p>
              ) : (
                <p className="text-ui-body font-semibold text-black">{item.name}</p>
              )}
              <p className="text-ui-label text-gray-600">{item.description}</p>
            </div>
            {item.comingSoon ? (
              <Pill tone="muted">{c.comingSoon}</Pill>
            ) : connected ? (
              <Pill tone="done">{c.connected}</Pill>
            ) : (
              <span className={`text-ui-label whitespace-nowrap border border-teal-dark px-3 py-1 font-semibold text-teal-dark ${RADIUS.control}`}>
                {c.connect}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── I2 – connecting Fortnox (scene) ───────────────────────────────────── */

export type FortnoxConnectDemoContent = {
  title: string;
  logo: string;
  description: string;
  status: { idle: string; done: string };
  connect: string;
  consent: { title: string; scopes: string[] };
  mapping: { title: string; rows: { label: string; account: string }[]; save: string; saved: string };
};

function Scope({ progress, at, children }: { progress: MotionValue<number>; at: number; children: ReactNode }) {
  const on = useStep(progress, at, at + 0.04);
  const dim = useTransform(on, [0, 1], [0.5, 1]);
  return (
    <motion.li style={{ opacity: dim }} className={`text-ui-label inline-flex items-center gap-1 border border-gray-200 bg-white px-2 py-0.5 text-black ${RADIUS.control}`}>
      <motion.span style={{ opacity: on }} className="text-teal-dark">
        <CheckMark />
      </motion.span>
      {children}
    </motion.li>
  );
}

function MappingRow({ progress, at, row }: { progress: MotionValue<number>; at: number; row: FortnoxConnectDemoContent['mapping']['rows'][number] }) {
  const opacity = useStep(progress, at, at + 0.05);
  return (
    <motion.div style={{ opacity }} className="text-ui-label flex items-center justify-between gap-3 py-1 text-black">
      <dt className="text-gray-700">{row.label}</dt>
      <dd className={`min-w-[4.5rem] border border-gray-200 bg-white px-2 py-0.5 text-right tabular-nums ${RADIUS.field}`}>{row.account}</dd>
    </motion.div>
  );
}

export function FortnoxConnectDemo({ progress, content }: { progress: MotionValue<number>; content: FortnoxConnectDemoContent }) {
  const titleId = useId();
  const c = content;
  const consentIn = useStep(progress, 0.14, 0.2);
  const connected = useStep(progress, 0.44, 0.5);
  const mappingIn = useStep(progress, 0.5, 0.56);
  const saved = useStep(progress, 0.88, 0.94);

  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={connected} idle={c.status.idle} done={c.status.done} />}>
      <div className={`mt-3 flex items-center justify-between gap-3 border border-gray-200 bg-white px-3.5 py-2.5 ${RADIUS.field}`}>
        <div className="min-w-0">
          <FortnoxLogo src={c.logo} size="md" />
          <p className="text-ui-label mt-1 text-gray-600">{c.description}</p>
        </div>
        <PressButton progress={progress} at={0.1}>
          {c.connect}
        </PressButton>
      </div>

      <motion.div style={{ opacity: consentIn }} className={`mt-2 border border-dashed border-gray-300 bg-gray-50 px-3.5 py-2.5 ${RADIUS.field}`}>
        <p className="text-ui-label text-gray-700">{c.consent.title}</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {c.consent.scopes.map((scope, i) => (
            <Scope key={scope} progress={progress} at={0.2 + i * 0.035}>
              {scope}
            </Scope>
          ))}
        </ul>
      </motion.div>

      <motion.div style={{ opacity: mappingIn }} className={`mt-2 border border-gray-200 bg-white px-3.5 pb-2 pt-2.5 ${RADIUS.field}`}>
        <p className="text-ui-label font-semibold text-black">{c.mapping.title}</p>
        <dl className="mt-1">
          {c.mapping.rows.map((row, i) => (
            <MappingRow key={row.label} progress={progress} at={0.56 + i * 0.045} row={row} />
          ))}
        </dl>
      </motion.div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <motion.p style={{ opacity: saved }} className="text-ui-label flex items-center gap-1 font-semibold text-teal-darker">
          <CheckMark />
          {c.mapping.saved}
        </motion.p>
        <PressButton progress={progress} at={0.84}>
          {c.mapping.save}
        </PressButton>
      </div>
    </Card>
  );
}

/* ── I3 – from a Stripe payout to Fortnox (scene) ───────────────────────── */

export type PayoutChainDemoContent = {
  title: string;
  status: { idle: string; done: string };
  who: { portal: string; you: string };
  steps: {
    system: string;
    title: string;
    detail: string;
    amount?: number;
    by?: 'portal' | 'you';
    action?: string;
  }[];
};

/** Where each step of the chain lands in the scene: [reached, action pressed]. */
const CHAIN_TIMES = [0.06, 0.28, 0.54, 0.8];

function ChainStep({ progress, step, index, who, last }: { progress: MotionValue<number>; step: PayoutChainDemoContent['steps'][number]; index: number; who: PayoutChainDemoContent['who']; last: boolean }) {
  const at = CHAIN_TIMES[index];
  const pressAt = at - 0.04;
  const reached = useStep(progress, at, at + 0.06);
  const labelOpacity = useTransform(reached, [0, 1], [0.5, 1]);
  const line = useStep(progress, at + 0.06, (CHAIN_TIMES[index + 1] ?? 1) - 0.02);

  return (
    <li className="relative flex gap-3 pb-3 last:pb-0">
      {/* Marker and the line down to the next step. */}
      <span className="relative flex w-5 flex-shrink-0 justify-center" aria-hidden="true">
        <span className="relative z-10 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white">
          <motion.span style={{ opacity: reached, scale: reached }} className="absolute inset-[-1px] flex items-center justify-center rounded-full bg-teal-dark text-white">
            <CheckMark />
          </motion.span>
        </span>
        {!last ? (
          <>
            <span className="absolute bottom-[-2px] top-6 w-0.5 bg-gray-200" />
            <motion.span style={{ scaleY: line }} className="absolute bottom-[-2px] top-6 w-0.5 origin-top bg-teal-dark" />
          </>
        ) : null}
      </span>

      <motion.div style={{ opacity: labelOpacity }} className={`min-w-0 flex-1 border border-gray-200 bg-white px-3 py-2 ${RADIUS.field}`}>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-ui-label bg-gray-100 px-2 py-0.5 font-semibold text-gray-800 ${RADIUS.control}`}>{step.system}</span>
          {step.by ? (
            <span className="text-ui-label text-gray-600">{step.by === 'portal' ? who.portal : who.you}</span>
          ) : null}
        </div>
        <p className="text-ui-body mt-1 font-semibold text-black">{step.title}</p>
        <div className="mt-0.5 flex items-center justify-between gap-3">
          <p className="text-ui-label text-gray-600">
            {step.detail}
            {step.amount ? <span className="tabular-nums"> {money(step.amount)}</span> : null}
          </p>
          {step.action ? (
            <PressButton progress={progress} at={pressAt}>
              {step.action}
            </PressButton>
          ) : null}
        </div>
      </motion.div>
    </li>
  );
}

export function PayoutChainDemo({ progress, content }: { progress: MotionValue<number>; content: PayoutChainDemoContent }) {
  const titleId = useId();
  const c = content;
  const done = useStep(progress, 0.86, 0.92);
  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={done} idle={c.status.idle} done={c.status.done} />}>
      <ol className="mt-3">
        {c.steps.map((step, i) => (
          <ChainStep key={step.title} progress={progress} step={step} index={i} who={c.who} last={i === c.steps.length - 1} />
        ))}
      </ol>
    </Card>
  );
}

/* ── I4 – where the invoice is created (static) ─────────────────────────── */

export type InvoiceProviderContent = {
  title: string;
  customer: { label: string; value: string };
  providerLabel: string;
  providers: string[];
  selected: string;
  note: string;
  submit: string;
};

/** `compact` leaves out the customer and the note – for the card over the photo in I4, which must stay low enough to clear the faces. */
export function InvoiceProviderCard({ content, compact = false }: { content: InvoiceProviderContent; compact?: boolean }) {
  const titleId = useId();
  const c = content;
  return (
    <Card titleId={titleId} title={c.title}>
      {compact ? null : (
        <Box label={c.customer.label} className="mt-3">
          {c.customer.value}
        </Box>
      )}
      <div className={compact ? 'mt-3' : 'mt-2'}>
        <p className="text-ui-label text-gray-600">{c.providerLabel}</p>
        <ul className={`mt-1 grid gap-1 bg-gray-100 p-1 ${RADIUS.field}`} style={{ gridTemplateColumns: `repeat(${c.providers.length}, minmax(0, 1fr))` }}>
          {c.providers.map((provider) => {
            const selected = provider === c.selected;
            return (
              <li
                key={provider}
                aria-current={selected ? 'true' : undefined}
                className={`text-ui-body flex items-center justify-center gap-1 px-2 py-1.5 ${RADIUS.control} ${selected ? 'bg-white font-semibold text-black shadow-sm' : 'text-gray-600'}`}
              >
                {selected ? <CheckMark className="h-3 w-3 text-teal-dark" /> : null}
                {provider}
              </li>
            );
          })}
        </ul>
      </div>
      {compact ? null : <p className="text-ui-label mt-2 text-gray-700">{c.note}</p>}
      <span className={`text-ui-body mt-3 flex w-full items-center justify-center bg-teal-dark px-4 py-2 text-white ${RADIUS.control}`}>{c.submit}</span>
    </Card>
  );
}

/* ── I5 – the PostNord settings (static) ────────────────────────────────── */

export type PostNordSettingsContent = {
  title: string;
  enabled: string;
  filled: string;
  fields: string[];
  optional: { label: string; value: string };
};

export function PostNordSettingsCard({ content }: { content: PostNordSettingsContent }) {
  const titleId = useId();
  const c = content;
  return (
    <Card titleId={titleId} title={c.title} badge={<Pill tone="done">{c.enabled}</Pill>}>
      <dl className="mt-3 divide-y divide-gray-100">
        {c.fields.map((field) => (
          <div key={field} className="flex items-center justify-between gap-3 py-2">
            <dt className="text-ui-body text-black">{field}</dt>
            <dd className="text-ui-label flex items-center gap-1 whitespace-nowrap font-semibold text-teal-darker">
              <CheckMark />
              {c.filled}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 py-2">
          <dt className="text-ui-body text-black">{c.optional.label}</dt>
          <dd>
            <Pill tone="muted">{c.optional.value}</Pill>
          </dd>
        </div>
      </dl>
    </Card>
  );
}
