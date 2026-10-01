'use client';

import { BellIcon, CalendarDaysIcon } from '@heroicons/react/20/solid';
import { RADIUS } from '../payment-cards/primitives';
import { EASE, PlusGlyph, T, UiButton, WidgetShell } from './ui';
import { useSequence } from './useSequence';

type Deadline = { id: string; title: string; date: string; daysLeft: number };

export type DeadlinesWidgetContent = {
  label: string;
  title: string;
  subtitle: string;
  manageLabel: string;
  /** Badge text: `{n}` is the number of days. */
  daysLabel: string;
  dayLabel: string;
  nextLabel: string;
  /** The system dates, sorted by date – the first one is the next. */
  deadlines: Deadline[];
  reminder: string;
  addLabel: string;
  custom: Deadline & { pill: string };
  calendarNote: string;
};

/*
 * "Kommande datum": the portal's "Viktiga datum" card on the dashboard.
 *
 *   0 empty list → 1–3 the system dates come in, one at a time →
 *   4 the next date is singled out, with its e-mail reminder →
 *   5 "Lägg till eget datum" is pressed → 6 the own date is in the list
 *
 * Every row is rendered from the start and only fades in (opacity and a short
 * lift), so the card never changes height. Badges turn red under seven days,
 * as in the portal.
 */
const STEPS = [450, 350, 350, 750, 1000, 450];

export function DeadlinesWidget({ content: c }: { content: DeadlinesWidgetContent }) {
  const { ref, step, replay } = useSequence(STEPS);
  const days = (n: number) => (n === 1 ? c.dayLabel : c.daysLabel).replace('{n}', String(n));

  return (
    <WidgetShell
      innerRef={(el) => {
        ref.current = el;
      }}
      title={c.title}
      label={c.label}
      onReplay={replay}
      actions={<UiButton tone="quiet">{c.manageLabel}</UiButton>}
    >
      <p className={`${T.label} -mt-2 text-gray-600`}>{c.subtitle}</p>

      <ul className="mt-3 space-y-2">
        {c.deadlines.map((d, i) => {
          const shown = step > i;
          const next = i === 0 && step >= 4;
          return (
            <li
              key={d.id}
              aria-hidden={!shown}
              className={`border px-3.5 py-2.5 transition-[opacity,transform,background-color,border-color] duration-500 ${EASE} ${RADIUS.field} ${
                shown ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-0'
              } ${next ? 'border-teal-dark bg-teal/5' : 'border-gray-200 bg-white'}`}
            >
              <Row d={d} badge={days(d.daysLeft)} />
              {i === 0 ? (
                <p
                  aria-hidden={!next}
                  className={`${T.label} mt-1.5 flex items-start gap-1.5 text-gray-700 transition-opacity duration-500 ${EASE} ${next ? 'opacity-100' : 'opacity-0'}`}
                >
                  <BellIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-dark" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-teal-dark">{c.nextLabel}</span> · {c.reminder}
                  </span>
                </p>
              ) : null}
            </li>
          );
        })}
        <li
          aria-hidden={step < 6}
          className={`border border-gray-200 bg-white px-3.5 py-2.5 transition-[opacity,transform] duration-500 ${EASE} ${RADIUS.field} ${
            step >= 6 ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-0'
          }`}
        >
          <Row d={c.custom} badge={days(c.custom.daysLeft)} pill={c.custom.pill} />
        </li>
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <UiButton tone="quiet" pressed={step === 5} icon={<PlusGlyph />}>
          {c.addLabel}
        </UiButton>
        <p className={`${T.label} flex items-center gap-1.5 text-gray-600`}>
          <CalendarDaysIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {c.calendarNote}
        </p>
      </div>
    </WidgetShell>
  );
}

function Row({ d, badge, pill }: { d: Deadline; badge: string; pill?: string }) {
  const urgent = d.daysLeft < 7;
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className={`${T.body} font-semibold`}>{d.title}</p>
        <p className={`${T.label} flex items-center gap-2 text-gray-600`}>
          {d.date}
          {pill ? <span className={`${T.label} bg-gray-100 px-2 text-black ${RADIUS.control}`}>{pill}</span> : null}
        </p>
      </div>
      <span
        className={`${T.label} shrink-0 whitespace-nowrap px-2.5 py-0.5 font-semibold ${RADIUS.control} ${
          urgent ? 'bg-red-50 text-red-700' : 'bg-teal/10 text-teal-dark'
        }`}
      >
        {badge}
      </span>
    </div>
  );
}
