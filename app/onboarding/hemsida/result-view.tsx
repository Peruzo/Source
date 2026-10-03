'use client';

import { useEffect, useRef, useState } from 'react';
import { T } from '@/lib/site-builder/texts';
import { capsOf, lockState } from '@/lib/site-builder/flow-state';
import type { DraftSummary } from './api';
import { usePreviewUrl } from './use-preview-url';
import { ErrorBox, LinkButton } from './ui';

/**
 * Resultatet i helskärm: sajten fyller hela fönstret och en fast list ligger nertill. Ramen
 * slutar där listen börjar (listens uppmätta höjd), så att listen aldrig täcker sajtens innehåll
 * eller sidfot. Sajtens egen meny ligger överst i ramen och påverkas inte.
 *
 * Listen har utfyllnad till höger för sajtens globala chattknapp (fixerad nere till höger,
 * över allt), så att ingen av listens knappar hamnar under den.
 *
 * Listen: "Redigera", "Byt utseende", "Kvar: X förbättringar" och "Det här är min sajt – gå
 * vidare". När förbättringarna är slut visas i stället bara vägen vidare ("Gå vidare och bli
 * kund") och "Kontakta support".
 */
export function ResultView(props: {
  onboardingId: string;
  summary: DraftSummary;
  onEdit: () => void;
  onTheme: () => void;
  onApprove: () => void;
  onHelp: () => void;
}) {
  const { baseUrl, error } = usePreviewUrl(props.onboardingId, props.summary.version);
  const barRef = useRef<HTMLDivElement>(null);
  const firstAction = useRef<HTMLButtonElement>(null);
  const [barHeight, setBarHeight] = useState(88);
  const caps = capsOf(props.summary);
  const { improvementsLocked } = lockState(props.summary);

  // Ramen ska sluta där listen börjar, även när listen radbryts på mobil.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const measure = () => setBarHeight(Math.ceil(bar.getBoundingClientRect().height));
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(bar);
    window.addEventListener('resize', measure);
    return () => { ro?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // Fokus på listens första knapp när helskärmen öppnas, så att tangentbordet hamnar rätt.
  useEffect(() => { firstAction.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="absolute inset-x-0 top-0" style={{ bottom: barHeight }}>
        {error ? (
          <div className="p-6"><ErrorBox message={error.message} /></div>
        ) : baseUrl ? (
          <iframe
            src={baseUrl}
            title={T.resultFrameTitle}
            className="h-full w-full border-0 bg-white"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <p role="status" className="p-6 text-gray-600">{T.loading}</p>
        )}
      </div>

      <div
        ref={barRef}
        role="region"
        aria-label={T.resultBarLabel}
        className="absolute inset-x-0 bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur pl-4 pr-[88px] md:pr-[104px] py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        {improvementsLocked ? (
          <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-700"><strong className="font-semibold text-gray-900">{T.lockedTitle}.</strong> {T.lockedText}</p>
            <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
              <button ref={firstAction} type="button" onClick={props.onApprove}
                className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200">
                {T.becomeCustomer}
              </button>
              <div className="text-center"><LinkButton onClick={props.onHelp}>{T.contactSupport}</LinkButton></div>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button ref={firstAction} type="button" onClick={props.onEdit}
                className="rounded-full border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200">
                {T.edit}
              </button>
              <button type="button" onClick={props.onTheme}
                className="rounded-full border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200">
                {T.changeLook}
              </button>
              <span className="hidden text-sm text-gray-600 sm:inline" aria-live="polite">{T.improvementsLeft(caps.improvements.remaining)}</span>
            </div>
            <span className="w-full text-sm text-gray-600 sm:hidden" aria-hidden="true">{T.improvementsLeft(caps.improvements.remaining)}</span>
            <button type="button" onClick={props.onApprove}
              className="w-full rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 sm:w-auto">
              {T.approveContinue}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
