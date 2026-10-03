'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { IMPROVEMENTS, LIMITS, PALETTES, SECTION_LABELS, STYLES, T } from '@/lib/site-builder/texts';
import { api, type ApiError, type DraftSummary } from './api';
import { DeviceFrame, ErrorBox, Field, InfoBox, LinkButton, OptionButton, PrimaryButton, SecondaryButton } from './ui';

// Tokenen gäller i 15 minuter; den förnyas två minuter innan.
const RENEW_BEFORE_MS = 2 * 60_000;

/**
 * Förhandsvisningen med token från kundportalen, sidväxlare, dator/mobil, förbättringar per
 * sektion, ny stil eller palett, kvarvarande tak och godkännande. Tokenen är bunden till
 * utkastets version, så en ny hämtas efter varje ändring och automatiskt innan den går ut.
 */
export function PreviewStep(props: {
  onboardingId: string;
  summary: DraftSummary;
  onSummary: (s: DraftSummary) => void;
  onRebuild: () => void;
  onHelp: () => void;
  onApprove: () => void;
}) {
  const { summary } = props;
  const pages = summary.outline?.pages || [];
  const [pageSlug, setPageSlug] = useState<string>(pages.find((p) => p.isHome)?.slug || pages[0]?.slug || '');
  const [baseUrl, setBaseUrl] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);
  const [sectionId, setSectionId] = useState('');
  const [choice, setChoice] = useState('');
  const [note, setNote] = useState('');
  const [style, setStyle] = useState('');
  const [palette, setPalette] = useState('');
  const renewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageSelectId = useId();
  const sectionSelectId = useId();

  const loadToken = useCallback(async () => {
    const res = await api<{ url: string; expiresAt: string; version: number }>('/preview-token', 'POST', { onboardingId: props.onboardingId });
    if (!res.ok) { setError(res); return; }
    setBaseUrl(res.url);
    if (renewTimer.current) clearTimeout(renewTimer.current);
    const wait = Math.max(30_000, Date.parse(res.expiresAt) - Date.now() - RENEW_BEFORE_MS);
    renewTimer.current = setTimeout(loadToken, wait);
  }, [props.onboardingId]);

  // Ny token vid start och varje gång utkastets version ändras.
  useEffect(() => { loadToken(); }, [loadToken, summary.version]);
  useEffect(() => () => { if (renewTimer.current) clearTimeout(renewTimer.current); }, []);

  const page = pages.find((p) => p.slug === pageSlug);
  const src = baseUrl ? (page && !page.isHome ? `${baseUrl}&page=${encodeURIComponent(page.slug)}` : baseUrl) : '';
  const improveLeft = summary.remaining.improve;

  async function improve() {
    if (!sectionId || !choice) { setError({ ok: false, code: 'INVALID_INPUT', message: T.pickOne }); return; }
    if (/[<>]/.test(note)) { setError({ ok: false, code: 'INVALID_INPUT', message: T.noAngles }); return; }
    setBusy(true);
    setError(null);
    const res = await api<{ draft: DraftSummary }>('/improve', 'POST', {
      onboardingId: props.onboardingId, sectionId, pageSlug: pageSlug || undefined, choice, note: note.trim() || undefined,
    });
    setBusy(false);
    if (!res.ok) { setError(res); return; }
    setNote('');
    props.onSummary(res.draft);
  }

  async function changeTheme() {
    if (!style && !palette) { setError({ ok: false, code: 'INVALID_INPUT', message: T.pickOne }); return; }
    setBusy(true);
    setError(null);
    const res = await api<{ draft: DraftSummary }>('/theme', 'POST', {
      onboardingId: props.onboardingId,
      ...(style ? { style } : {}),
      ...(palette ? { palette: { kind: 'preset', name: palette } } : {}),
    });
    setBusy(false);
    if (!res.ok) { setError(res); return; }
    props.onSummary(res.draft);
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <p className="text-gray-600 text-center">{T.previewHelp}</p>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
        <div className="flex flex-col gap-3 min-w-0">
          {pages.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor={pageSelectId} className="font-medium text-gray-800">{T.page}</label>
              <select id={pageSelectId} value={pageSlug} onChange={(e) => { setPageSlug(e.target.value); setSectionId(''); }}
                className="rounded-full border-2 border-gray-200 px-4 py-2 bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200">
                {pages.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
              </select>
            </div>
          )}
          {src ? <DeviceFrame src={src} title={T.previewFrameTitle} /> : <p role="status" className="text-gray-600">{T.loading}</p>}
        </div>

        <aside className="flex flex-col gap-5 rounded-2xl border-2 border-gray-100 bg-white p-5">
          <section className="flex flex-col gap-3" aria-labelledby="forbattra-rubrik">
            <h2 id="forbattra-rubrik" className="text-lg font-semibold text-gray-900">{T.improveTitle}</h2>
            <p className="text-sm text-gray-600">{T.remaining(improveLeft, summary.remaining.site)}</p>
            {improveLeft <= 0 ? (
              <InfoBox>
                <p>{T.limitReached}</p>
                <div className="mt-2"><LinkButton onClick={props.onHelp}>{T.contactSupport}</LinkButton></div>
              </InfoBox>
            ) : (
              <>
                <label htmlFor={sectionSelectId} className="font-medium text-gray-800">{T.improveSection}</label>
                <select id={sectionSelectId} value={sectionId} onChange={(e) => setSectionId(e.target.value)}
                  className="rounded-2xl border-2 border-gray-200 px-4 py-2 bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200">
                  <option value="">–</option>
                  {(page?.sections || []).map((s, i) => (
                    <option key={s.id} value={s.id}>{`${i + 1}. ${SECTION_LABELS[s.type] || s.type}`}</option>
                  ))}
                </select>
                <fieldset className="flex flex-col gap-2">
                  <legend className="font-medium text-gray-800 mb-1">{T.improveChoice}</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {IMPROVEMENTS.map((c) => (
                      <OptionButton key={c.value} label={c.label} selected={choice === c.value} onClick={() => setChoice(c.value)} />
                    ))}
                  </div>
                </fieldset>
                <Field label={T.improveNote} help={T.improveNoteHelp} value={note} onChange={setNote} max={LIMITS.note[1]} multiline rows={2} />
                <PrimaryButton onClick={improve} disabled={busy}>{busy ? T.improving : T.improveSubmit}</PrimaryButton>
              </>
            )}
          </section>

          <section className="flex flex-col gap-3" aria-labelledby="tema-rubrik">
            <h2 id="tema-rubrik" className="text-lg font-semibold text-gray-900">{T.themeTitle}</h2>
            <fieldset className="flex flex-col gap-2">
              <legend className="font-medium text-gray-800 mb-1">{T.styleLegend}</legend>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => <OptionButton key={s.value} label={s.label} selected={style === s.value} onClick={() => setStyle(style === s.value ? '' : s.value)} />)}
              </div>
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <legend className="font-medium text-gray-800 mb-1">{T.paletteLegend}</legend>
              <div className="grid grid-cols-2 gap-2">
                {PALETTES.map((p) => (
                  <OptionButton key={p.value} label={p.label} selected={palette === p.value} onClick={() => setPalette(palette === p.value ? '' : p.value)}>
                    <span aria-hidden="true" className="flex -space-x-1">
                      {p.colors.map((c) => <span key={c} className="h-4 w-4 rounded-full border border-white" style={{ background: c }} />)}
                    </span>
                  </OptionButton>
                ))}
              </div>
            </fieldset>
            <SecondaryButton onClick={changeTheme} disabled={busy}>{T.themeSubmit}</SecondaryButton>
          </section>

          {error && (
            <ErrorBox message={error.message}>
              {error.code === 'LIMIT_REACHED' && <div className="mt-2"><LinkButton onClick={props.onHelp}>{T.contactSupport}</LinkButton></div>}
            </ErrorBox>
          )}

          {summary.remaining.site > 0 && (
            <div className="flex flex-col gap-1">
              <LinkButton onClick={() => { if (window.confirm(T.rebuildConfirm)) props.onRebuild(); }}>{T.rebuild}</LinkButton>
            </div>
          )}
        </aside>
      </div>

      <div className="flex flex-col items-center gap-2">
        <PrimaryButton onClick={props.onApprove}>{T.approve}</PrimaryButton>
        <p className="text-sm text-gray-500">{T.approveHelp}</p>
      </div>
    </div>
  );
}
