'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircleIcon, CheckIcon, EnvelopeIcon } from '@heroicons/react/20/solid';
import { CARD_EDGE, formatMoney, RADIUS } from '../payment-cards/primitives';
import { EASE, ReplayButton, T, UiButton } from './ui';
import { useSequence } from './useSequence';

type Service = { id: string; name: string; minutes: number; price: number };
type DayState = 'free' | 'few' | 'full' | 'closed' | 'none';

export type BookingWidgetContent = {
  label: string;
  tabs: { label: string; customer: string; settings: string };
  steps: string[];
  stepOf: string;
  services: { heading: string; items: Service[]; selectedId: string; minutesLabel: string };
  staff: { heading: string; options: string[]; selected: string };
  time: {
    heading: string;
    month: string;
    weekdays: string[];
    /** Leading empty cells before day 1. */
    offset: number;
    days: DayState[];
    selectedDay: number;
    legend: { free: string; few: string; full: string; closed: string };
    slotsHeading: string;
    slots: string[];
    selectedSlot: string;
  };
  details: { heading: string; fields: { label: string; value: string }[]; links: string };
  payment: {
    heading: string;
    rows: { label: string; value: string }[];
    deposit: { label: string; amount: number };
    payLabel: string;
  };
  done: {
    title: string;
    summary: string;
    email: { title: string; from: string; text: string; cancelLink: string };
  };
  settings: { id: string; title: string; rows: { label: string; value: string; on?: boolean }[] }[];
};

/*
 * "Låt kunderna boka själva": the booking system in two tabs.
 *
 * "Kundens vy" plays the customer's way through a booking in the portal's own
 * steps – Tjänst, Utförare, Tid, Uppgifter – then the card payment and the
 * confirmation with its cancel link:
 *   0 services → 1 service chosen → 2 staff → 3 day chosen → 4 time chosen →
 *   5 details → 6 payment → 7 pay pressed → 8 confirmed
 * "Din konfiguration" shows what the business sets up, one card at a time.
 *
 * Only what works end to end in the portal is shown – no reminders, waiting list,
 * add-ons, SMS, calendar sync, customer rescheduling or embed code.
 */
const CUSTOMER = [1000, 800, 1300, 900, 1000, 1500, 1400, 450];
const SETTINGS_STEP = 260;

const STAGE_OF_STEP = [0, 0, 1, 2, 2, 3, 4, 4, 5];

export function BookingWidget({ content: c, currency, locale }: { content: BookingWidgetContent; currency: string; locale: string }) {
  const [tab, setTab] = useState<'customer' | 'settings'>('customer');
  const customer = useSequence(CUSTOMER);
  const settings = useSequence(c.settings.map(() => SETTINGS_STEP));
  const tabsId = useId();
  const money = (n: number) => formatMoney(n, currency, locale);

  const step = customer.step;
  const stage = STAGE_OF_STEP[step];

  const choose = (next: 'customer' | 'settings') => {
    if (next === tab) return;
    setTab(next);
    (next === 'customer' ? customer : settings).replay();
  };

  return (
    <div
      ref={customer.ref}
      role="group"
      aria-label={c.label}
      className={`@container w-full bg-white p-4 text-left text-black sm:p-5 md:p-6 ${CARD_EDGE} ${RADIUS.card}`}
    >
      {/* Tabs: switching plays that tab again. */}
      <div role="tablist" aria-label={c.tabs.label} className={`inline-flex gap-1 border border-gray-300 p-1 ${RADIUS.control}`}>
        {(['customer', 'settings'] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`${tabsId}-${key}`}
            aria-selected={tab === key}
            aria-controls={`${tabsId}-${key}-panel`}
            onClick={() => choose(key)}
            className={`${T.label} px-4 py-1.5 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${RADIUS.control} ${
              tab === key ? 'bg-teal-dark text-white' : 'text-black hover:bg-gray-100'
            }`}
          >
            {key === 'customer' ? c.tabs.customer : c.tabs.settings}
          </button>
        ))}
      </div>

      {/* Kundens vy */}
      <div role="tabpanel" id={`${tabsId}-customer-panel`} aria-labelledby={`${tabsId}-customer`} hidden={tab !== 'customer'} className="mt-5">
        <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-[11rem_minmax(0,1fr)]">
          {/* Progress: a step list from 48rem, one line below that. */}
          <ol className="hidden space-y-1 @3xl:block">
            {c.steps.map((label, i) => (
              <li
                key={label}
                className={`${T.label} flex items-center gap-2.5 px-3 py-2 transition-colors duration-300 ${RADIUS.field} ${
                  i === stage ? 'bg-teal/10 font-semibold text-black' : i < stage ? 'text-gray-700' : 'text-gray-500'
                }`}
                aria-current={i === stage ? 'step' : undefined}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center text-[0.8125rem] font-semibold ${RADIUS.control} ${
                    i < stage ? 'bg-teal-dark text-white' : i === stage ? 'border-2 border-teal-dark text-teal-dark' : 'border border-gray-300 text-gray-500'
                  }`}
                >
                  {i < stage ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
          <div className="@3xl:hidden">
            <p className={`${T.label} text-gray-600`}>
              {c.stepOf.replace('{n}', String(stage + 1)).replace('{total}', String(c.steps.length))} · <span className="font-semibold text-black">{c.steps[stage]}</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden bg-gray-100" aria-hidden="true">
              <div className={`h-full bg-teal-dark transition-transform duration-500 ${EASE} origin-left`} style={{ transform: `scaleX(${(stage + 1) / c.steps.length})` }} />
            </div>
          </div>

          {/* The stage: every step is a layer in one fixed area, so nothing moves. */}
          <div className="relative h-[29rem] @lg:h-[27rem] @3xl:h-[21rem]">
            <Layer show={stage === 0}>
              <StageTitle>{c.services.heading}</StageTitle>
              <ul className="mt-3 space-y-2">
                {c.services.items.map((s) => {
                  const on = step >= 1 && s.id === c.services.selectedId;
                  return (
                    <li key={s.id} className={`flex items-center justify-between gap-3 border px-4 py-3 transition-colors duration-300 ${RADIUS.field} ${on ? 'border-teal-dark bg-teal/5 ring-1 ring-teal-dark' : 'border-gray-200'}`}>
                      <span className="min-w-0">
                        <span className={`${T.body} block font-semibold`}>{s.name}</span>
                        <span className={`${T.label} text-gray-600`}>
                          {s.minutes} {c.services.minutesLabel}
                        </span>
                      </span>
                      <span className={`${T.body} shrink-0 tabular-nums`}>{money(s.price)}</span>
                    </li>
                  );
                })}
              </ul>
            </Layer>

            <Layer show={stage === 1}>
              <StageTitle>{c.staff.heading}</StageTitle>
              <ul className="mt-3 grid grid-cols-1 gap-2 @md:grid-cols-3">
                {c.staff.options.map((o) => (
                  <li key={o} className={`border px-4 py-3 ${T.body} ${RADIUS.field} ${o === c.staff.selected ? 'border-teal-dark bg-teal/5 font-semibold ring-1 ring-teal-dark' : 'border-gray-200'}`}>
                    {o}
                  </li>
                ))}
              </ul>
            </Layer>

            <Layer show={stage === 2}>
              <StageTitle>{c.time.heading}</StageTitle>
              <div className="mt-3 grid grid-cols-1 gap-4 @xl:grid-cols-[minmax(0,1fr)_12rem]">
                <div>
                  <p className={`${T.label} font-semibold`}>{c.time.month}</p>
                  <div className="mt-2 grid grid-cols-7 gap-1 text-center" aria-hidden="true">
                    {c.time.weekdays.map((d) => (
                      <span key={d} className="text-[0.8125rem] font-medium text-gray-500">
                        {d}
                      </span>
                    ))}
                    {Array.from({ length: c.time.offset }, (_, i) => (
                      <span key={`e${i}`} />
                    ))}
                    {c.time.days.map((state, i) => (
                      <DayCell key={i} day={i + 1} state={state} selected={step >= 3 && i + 1 === c.time.selectedDay} />
                    ))}
                  </div>
                  <p className={`${T.label} mt-2 flex flex-wrap gap-x-3 gap-y-1 text-gray-600`}>
                    <Legend dot="bg-teal-dark">{c.time.legend.free}</Legend>
                    <Legend dot="bg-amber-500">{c.time.legend.few}</Legend>
                    <Legend dot="bg-gray-300">{c.time.legend.full}</Legend>
                    <Legend dot="bg-white ring-1 ring-gray-400">{c.time.legend.closed}</Legend>
                  </p>
                </div>
                <div>
                  <p className={`${T.label} font-semibold`}>{c.time.slotsHeading}</p>
                  <ul className="mt-2 grid grid-cols-4 gap-2 @xl:grid-cols-2">
                    {c.time.slots.map((s) => (
                      <li
                        key={s}
                        className={`${T.body} border py-1.5 text-center tabular-nums transition-colors duration-300 ${RADIUS.control} ${
                          step >= 4 && s === c.time.selectedSlot ? 'border-teal-dark bg-teal-dark text-white' : 'border-gray-300'
                        }`}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Layer>

            <Layer show={stage === 3}>
              <StageTitle>{c.details.heading}</StageTitle>
              <div className="mt-3 grid grid-cols-1 gap-2 @lg:grid-cols-2">
                {c.details.fields.map((f) => (
                  <div key={f.label} className={`border border-gray-200 px-3.5 py-2.5 ${RADIUS.field}`}>
                    <p className={`${T.label} text-gray-600`}>{f.label}</p>
                    <p className={`${T.body} truncate`}>{f.value}</p>
                  </div>
                ))}
              </div>
              <p className={`${T.label} mt-3 text-gray-600`}>{c.details.links}</p>
            </Layer>

            <Layer show={stage === 4}>
              <StageTitle>{c.payment.heading}</StageTitle>
              <dl className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
                {c.payment.rows.map((r) => (
                  <div key={r.label} className="flex justify-between gap-3 py-2">
                    <dt className={`${T.label} text-gray-600`}>{r.label}</dt>
                    <dd className={`${T.body} text-right`}>{r.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-3 py-2.5 text-[1.0625rem] font-semibold">
                  <dt>{c.payment.deposit.label}</dt>
                  <dd className="tabular-nums">{money(c.payment.deposit.amount)}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <UiButton block pressed={step === 7}>
                  {c.payment.payLabel.replace('{amount}', money(c.payment.deposit.amount))}
                </UiButton>
              </div>
            </Layer>

            <Layer show={stage === 5}>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="h-8 w-8 shrink-0 text-teal-dark" aria-hidden="true" />
                <div>
                  <p className={T.title}>{c.done.title}</p>
                  <p className={`${T.body} text-gray-700`}>{c.done.summary}</p>
                </div>
              </div>
              <div className={`mt-4 border border-gray-200 bg-gray-50 p-4 ${RADIUS.field}`}>
                <p className={`${T.label} flex items-center gap-2 font-semibold`}>
                  <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
                  {c.done.email.title}
                </p>
                <p className={`${T.label} text-gray-600`}>{c.done.email.from}</p>
                <p className={`${T.body} mt-2`}>{c.done.email.text}</p>
                <p className={`${T.body} mt-2 font-semibold text-teal-dark underline underline-offset-2`}>{c.done.email.cancelLink}</p>
              </div>
            </Layer>
          </div>
        </div>
        <ReplayButton onClick={customer.replay} />
      </div>

      {/* Din konfiguration */}
      <div role="tabpanel" id={`${tabsId}-settings-panel`} aria-labelledby={`${tabsId}-settings`} hidden={tab !== 'settings'} className="mt-5">
        <ul className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
          {c.settings.map((card, i) => (
            <li
              key={card.id}
              className={`border border-gray-200 p-4 transition-[opacity,transform] duration-500 ${EASE} ${RADIUS.field} ${
                settings.step > i ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
            >
              <p className={`${T.body} font-semibold`}>{card.title}</p>
              <dl className="mt-2 space-y-1">
                {card.rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3">
                    <dt className={`${T.label} text-gray-600`}>{r.label}</dt>
                    <dd className={`${T.label} shrink-0 text-right font-semibold`}>
                      {r.on ? <span className="inline-flex items-center gap-1 text-teal-dark"><CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />{r.value}</span> : r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <ReplayButton onClick={settings.replay} />
      </div>
    </div>
  );
}

function StageTitle({ children }: { children: ReactNode }) {
  return <p className={T.title}>{children}</p>;
}

function Legend({ dot, children }: { dot: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" />
      {children}
    </span>
  );
}

function DayCell({ day, state, selected }: { day: number; state: DayState; selected: boolean }) {
  const tone =
    state === 'closed'
      ? 'text-gray-400 line-through'
      : state === 'full'
        ? 'text-gray-400'
        : state === 'none'
          ? 'text-gray-300'
          : 'text-black';
  const dot = state === 'free' ? 'bg-teal-dark' : state === 'few' ? 'bg-amber-500' : state === 'full' ? 'bg-gray-300' : '';
  return (
    <span
      className={`relative flex h-8 flex-col items-center justify-center text-[0.8125rem] tabular-nums transition-colors duration-300 ${RADIUS.field} ${
        selected ? 'bg-teal-dark font-semibold text-white' : tone
      }`}
    >
      {day}
      {dot && !selected ? <span className={`absolute bottom-0.5 h-1 w-1 rounded-full ${dot}`} /> : null}
    </span>
  );
}

/** One step of the stage: fades in and out, hidden from assistive tech while out. */
function Layer({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden={!show}
      // The old step fades out quickly, the new one fades in after it, so the two never mix.
      className={`absolute inset-0 transition-opacity ${EASE} ${show ? 'opacity-100 delay-150 duration-500' : 'pointer-events-none opacity-0 duration-150'}`}
    >
      {children}
    </div>
  );
}
