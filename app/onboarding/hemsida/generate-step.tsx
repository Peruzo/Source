'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { T } from '@/lib/site-builder/texts';
import { api, startGeneration, type ApiError, type DraftSummary, type GenerateEvent } from './api';
import { ErrorBox, InfoBox, LinkButton, PrimaryButton } from './ui';

const POLL_MS = 10_000;

/**
 * Generering med förlopp. Strömmen (Server-Sent Events) visar stegen och ett livstecken. Bryts
 * anslutningen, eller pågår redan en generering, frågar vyn utkastets status (POST draft) var
 * tionde sekund i stället för att starta en ny generering, och visar sajten när den är klar.
 */
export function GenerateStep(props: {
  onboardingId: string;
  resumeGenerating: boolean;
  onDone: (draft: DraftSummary) => void;
  onHelp: () => void;
}) {
  const [phase, setPhase] = useState<'idle' | 'running' | 'waiting' | 'error'>(props.resumeGenerating ? 'waiting' : 'idle');
  const [stages, setStages] = useState<{ id: string; label: string }[]>([]);
  const [current, setCurrent] = useState<string>('');
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<ApiError | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startVersion = useRef<number | null>(null);

  const stopPolling = () => { if (pollRef.current) clearInterval(pollRef.current); pollRef.current = null; };
  useEffect(() => stopPolling, []);

  /** Väntar på att en pågående generering blir klar, utan att starta en ny. */
  const waitForDraft = useCallback(() => {
    setPhase('waiting');
    stopPolling();
    const check = async () => {
      const res = await api<{ draft: DraftSummary; generating: boolean }>('/draft', 'POST', { onboardingId: props.onboardingId });
      if (!res.ok) return; // tillfälligt fel: försök igen vid nästa kontroll
      if (res.generating) return;
      stopPolling();
      const changed = startVersion.current === null || res.draft.version !== startVersion.current;
      if (res.draft.hasDefinition && changed) props.onDone(res.draft);
      else { setError({ ok: false, code: 'GENERATION_FAILED', message: T.generationUnconfirmed }); setPhase('error'); }
    };
    check();
    pollRef.current = setInterval(check, POLL_MS);
  }, [props]);

  useEffect(() => { if (props.resumeGenerating) waitForDraft(); }, [props.resumeGenerating, waitForDraft]);

  async function start() {
    setError(null);
    setPhase('running');
    setStages([]);
    setCurrent('');
    setElapsed(0);
    // Versionen före start, för att känna igen en ny sajt vid återupptagning.
    const before = await api<{ draft: DraftSummary }>('/draft', 'POST', { onboardingId: props.onboardingId });
    startVersion.current = before.ok ? before.draft.version : null;

    const outcome = await startGeneration(props.onboardingId, (e: GenerateEvent) => {
      if (e.type === 'started') setStages(e.stages);
      else if (e.type === 'progress') setCurrent(e.stage);
      else if (e.type === 'ping') setElapsed(e.elapsedSeconds);
      else if (e.type === 'done') props.onDone(e.draft);
      else if (e.type === 'error') { setError({ ok: false, code: e.code, message: e.message }); setPhase('error'); }
    });
    if (outcome === 'busy' || outcome === 'interrupted') waitForDraft();
    else if (typeof outcome === 'object') { setError(outcome); setPhase('error'); }
  }

  const currentIndex = stages.findIndex((s) => s.id === current);

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {phase === 'idle' && (
        <>
          <p className="text-gray-600 text-center">{T.generateIntro}</p>
          <PrimaryButton onClick={start}>{T.generateStart}</PrimaryButton>
        </>
      )}

      {phase === 'running' && (
        <div className="w-full flex flex-col gap-4" aria-live="polite">
          <p className="text-gray-600 text-center">{T.generateIntro}</p>
          <ol className="w-full flex flex-col gap-2">
            {stages.map((s, i) => {
              const state = i < currentIndex ? T.stageDone : i === currentIndex ? T.stageNow : T.stageLater;
              return (
                <li key={s.id} className="flex items-center justify-between rounded-2xl border-2 px-5 py-3"
                  style={{ borderColor: i === currentIndex ? '#10b981' : '#e5e7eb', background: i === currentIndex ? 'rgba(16,185,129,0.06)' : 'white' }}>
                  <span className="font-medium text-gray-800">{s.label}</span>
                  <span className="text-sm text-gray-500">{state}</span>
                </li>
              );
            })}
          </ol>
          <p className="text-sm text-gray-500 text-center" role="status">{T.generating}. {T.generatingElapsed(elapsed)}</p>
        </div>
      )}

      {phase === 'waiting' && (
        <div className="w-full flex flex-col gap-4 items-center" aria-live="polite">
          <div className="h-8 w-8 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          <InfoBox>{T.generatingResumed}</InfoBox>
        </div>
      )}

      {phase === 'error' && error && (
        <ErrorBox message={error.message}>
          <div className="mt-3 flex flex-wrap gap-4">
            {error.code !== 'LIMIT_REACHED' && <LinkButton onClick={start}>{T.retry}</LinkButton>}
            <LinkButton onClick={props.onHelp}>{T.contactSupport}</LinkButton>
          </div>
        </ErrorBox>
      )}
    </div>
  );
}
