'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useOnboardingId } from '@/lib/onboarding/use-onboarding-id';
import { getStoredPlanId, getStripeOnboardingUrl } from '@/lib/onboarding/selected-plan';
import { LIMITS, OFFERINGS, PALETTES, SECTIONS, STYLES, T, TONES, defaultSections } from '@/lib/site-builder/texts';
import { INITIAL_VIEW, loadPath, lockState, nextView, savePath, type PathState, type ResultView as ResultViewState } from '@/lib/site-builder/flow-state';
import { api, type ApiError, type DraftSummary } from './api';
import { ErrorBox, Field, InfoBox, LinkButton, OptionButton, PrimaryButton, SecondaryButton } from './ui';
import { ExampleDialog } from './example-dialog';
import { GenerateStep } from './generate-step';
import { PreviewStep } from './preview-step';
import { HelpPanel } from './help-panel';
import { ResultView } from './result-view';
import { ChoiceStep, QuoteSentStep, QuoteStep } from './quote-step';

/**
 * Flödet "Gör min hemsida". Varje steg sparas hos kundportalen (PUT answers) när kunden går
 * vidare, så att hen kan lämna och återuppta. Svaren cachas dessutom i webbläsarens
 * localStorage per onboardingId, så att fälten är ifyllda vid återkomst; cachen töms när kunden
 * godkänner sajten. Kundportalens sammanfattning (POST draft) avgör var flödet fortsätter.
 *
 * PR F:
 *   - Före byggarens första steg väljer kunden väg: själv med AI eller offert från Source.
 *     Valet sparas per onboardingId (flow-state.ts) och kan bytas åt båda håll.
 *   - Efter genereringen visas sajten i helskärm (result-view.tsx) med en fast list. "Redigera"
 *     och "Byt utseende" öppnar redigeringsvyn (preview-step.tsx), som har vägen tillbaka.
 *   - När ett tak är nått visas bara vägen vidare ("Gå vidare och bli kund") och support.
 */

type Answers = {
  offering: string[];
  companyName: string;
  industry: string;
  audience: string;
  toneOfVoice: string;
  texts: { companyDescription: string; about: string; uniqueSellingPoints: string; extra: string };
  wantedSections: string[] | null;
  design: { style: string; palette: { kind: 'preset'; name: string } | { kind: 'custom'; primary: string; accent: string } };
};

const EMPTY: Answers = {
  offering: [],
  companyName: '',
  industry: '',
  audience: '',
  toneOfVoice: '',
  texts: { companyDescription: '', about: '', uniqueSellingPoints: '', extra: '' },
  wantedSections: null,
  design: { style: 'classic', palette: { kind: 'preset', name: 'ocean' } },
};

const STEPS = ['offering', 'company', 'tone', 'content', 'sections', 'design', 'generate', 'preview'] as const;
// choice, quote och quoteSent ligger före byggaren; result är helskärmen efter genereringen.
type Step = (typeof STEPS)[number] | 'choice' | 'quote' | 'quoteSent' | 'result';
const TITLES: Record<Step, string> = {
  ...T.stepTitles,
  choice: T.choiceTitle,
  quote: T.quoteTitle,
  quoteSent: T.quoteSentTitle,
  result: T.stepTitles.preview,
};
const DOT_STEPS = 7; // stegprickar för steg 1–7; förhandsvisningen visas utan prickar

const cacheKey = (id: string) => `site-builder:${id}`;
const ANGLES = /[<>]/;

function lengthError(value: string, [min, max]: readonly [number, number], required = true): string {
  const v = value.trim();
  if (!v && required && min > 0) return T.required;
  if (v && v.length < min) return T.tooShort(min);
  if (v.length > max) return T.tooLong(max);
  if (ANGLES.test(v)) return T.noAngles;
  return '';
}

export function SiteBuilderFlow() {
  const router = useRouter();
  const { onboardingId, loading: idLoading, error: idError } = useOnboardingId();
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [step, setStep] = useState<Step>('offering');
  const [summary, setSummary] = useState<DraftSummary | null>(null);
  const [generating, setGenerating] = useState(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [exampleOpen, setExampleOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [pathState, setPathState] = useState<PathState>({ path: null, quoteSent: false });
  const [view, setView] = useState<ResultViewState>(INITIAL_VIEW);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Starta: skapa eller hämta utkastet och bestäm var kunden ska fortsätta.
  useEffect(() => {
    if (!onboardingId) return;
    let cancelled = false;
    try {
      const cached = window.localStorage.getItem(cacheKey(onboardingId));
      if (cached) setAnswers({ ...EMPTY, ...JSON.parse(cached) });
    } catch { /* ingen cache */ }
    (async () => {
      const res = await api<{ draft: DraftSummary; generating: boolean }>('/draft', 'POST', { onboardingId });
      if (cancelled) return;
      if (!res.ok) { setError(res); setReady(true); return; }
      setSummary(res.draft);
      setGenerating(res.generating);
      const saved = loadPath(safeStorage(), onboardingId);
      setPathState(saved);
      if (res.generating) setStep('generate');
      else if (saved.path === 'quote') setStep(saved.quoteSent ? 'quoteSent' : 'quote');
      else if (res.draft.hasDefinition) setStep('result');
      else if (saved.path === 'ai' || res.draft.answeredSteps.length > 0) setStep(firstOpenStep(res.draft.answeredSteps));
      else setStep('choice');
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [onboardingId]);

  useEffect(() => {
    if (!onboardingId) return;
    try { window.localStorage.setItem(cacheKey(onboardingId), JSON.stringify(answers)); } catch { /* fullt eller blockerat */ }
  }, [answers, onboardingId]);

  useEffect(() => { headingRef.current?.focus(); }, [step]);

  const update = <K extends keyof Answers>(key: K, value: Answers[K]) => setAnswers((a) => ({ ...a, [key]: value }));

  /** Sparar ett eller flera steg i ordning. Fel från kundportalen visas vid fälten. */
  const save = useCallback(async (steps: [string, unknown][]) => {
    if (!onboardingId) return false;
    setSaving(true);
    setError(null);
    setFieldErrors({});
    for (const [key, value] of steps) {
      const res = await api<{ draft: DraftSummary }>('/answers', 'PUT', { onboardingId, step: key, value });
      if (!res.ok) {
        setSaving(false);
        if (res.code === 'INVALID_ANSWERS' && res.errors) {
          setFieldErrors(Object.fromEntries(res.errors.map((e) => [e.path.split('.').pop() || e.path, T.fieldError])));
        }
        setError(res);
        return false;
      }
      setSummary(res.draft);
    }
    setSaving(false);
    return true;
  }, [onboardingId]);

  const goto = (s: Step) => { setError(null); setFieldErrors({}); setStep(s); };
  const back = () => { const i = STEPS.indexOf(step as (typeof STEPS)[number]); if (i > 0) goto(STEPS[i - 1]); };

  /** Väg: AI-byggaren eller offert. Sparas så att kunden kan byta senare, åt båda håll. */
  const choosePath = (path: 'ai' | 'quote') => {
    if (!onboardingId) return;
    const next: PathState = { path, quoteSent: pathState.quoteSent };
    setPathState(next);
    savePath(safeStorage(), onboardingId, next);
    if (path === 'quote') goto(next.quoteSent ? 'quoteSent' : 'quote');
    else if (summary?.hasDefinition) { setView(nextView(view, 'fullscreen')); goto('result'); }
    else goto(firstOpenStep(summary?.answeredSteps || []));
  };
  const quoteSent = () => {
    if (!onboardingId) return;
    const next: PathState = { path: 'quote', quoteSent: true };
    setPathState(next);
    savePath(safeStorage(), onboardingId, next);
    goto('quoteSent');
  };
  const showResult = (action: 'edit' | 'theme' | 'fullscreen') => {
    const v = nextView(view, action);
    setView(v);
    goto(v.mode === 'fullscreen' ? 'result' : 'preview');
  };
  const leaveToStripe = () => {
    if (onboardingId) { try { window.localStorage.removeItem(cacheKey(onboardingId)); } catch { /* ignorera */ } }
    router.push(getStripeOnboardingUrl(getStoredPlanId()));
  };

  // ── Validering och sparande per steg ──────────────────────────────────────────────────
  async function next() {
    const errs: Record<string, string> = {};
    let steps: [string, unknown][] = [];
    if (step === 'offering') {
      if (!answers.offering.length) errs.offering = T.pickOne;
      steps = [['offering', answers.offering]];
    } else if (step === 'company') {
      errs.companyName = lengthError(answers.companyName, LIMITS.companyName);
      errs.industry = lengthError(answers.industry, LIMITS.industry);
      errs.audience = lengthError(answers.audience, LIMITS.audience);
      steps = [['companyName', answers.companyName.trim()], ['industry', answers.industry.trim()], ['audience', answers.audience.trim()]];
    } else if (step === 'tone') {
      if (!answers.toneOfVoice) errs.toneOfVoice = T.pickOne;
      steps = [['toneOfVoice', answers.toneOfVoice]];
    } else if (step === 'content') {
      const t = answers.texts;
      errs.companyDescription = lengthError(t.companyDescription, LIMITS.companyDescription);
      errs.about = lengthError(t.about, LIMITS.about, false);
      errs.uniqueSellingPoints = lengthError(t.uniqueSellingPoints, LIMITS.uniqueSellingPoints, false);
      errs.extra = lengthError(t.extra, LIMITS.extra, false);
      const texts: Record<string, string> = { companyDescription: t.companyDescription.trim() };
      if (t.about.trim()) texts.about = t.about.trim();
      if (t.uniqueSellingPoints.trim()) texts.uniqueSellingPoints = t.uniqueSellingPoints.trim();
      if (t.extra.trim()) texts.extra = t.extra.trim();
      steps = [['texts', texts]];
    } else if (step === 'sections') {
      const chosen = answers.wantedSections ?? defaultSections(answers.offering);
      if (!chosen.length) errs.wantedSections = T.pickOne;
      steps = [['wantedSections', [...chosen, 'footer']]];
    } else if (step === 'design') {
      steps = [['design', answers.design]];
    }
    const real = Object.fromEntries(Object.entries(errs).filter(([, v]) => v));
    if (Object.keys(real).length) { setFieldErrors(real); return; }
    if (await save(steps)) goto(STEPS[STEPS.indexOf(step as (typeof STEPS)[number]) + 1]);
  }

  // ── Rendering ─────────────────────────────────────────────────────────────────────────
  if (idLoading || (onboardingId && !ready)) {
    return <OnboardingLayout><p role="status" className="text-gray-600">{T.loading}</p></OnboardingLayout>;
  }
  if (idError || !onboardingId) {
    return <OnboardingLayout><ErrorBox message={T.notReady} /></OnboardingLayout>;
  }

  if (step === 'result' && summary) {
    return (
      <>
        <ResultView
          onboardingId={onboardingId}
          summary={summary}
          onEdit={() => showResult('edit')}
          onTheme={() => showResult('theme')}
          onApprove={leaveToStripe}
          onHelp={() => setHelpOpen(true)}
        />
        {helpOpen && <HelpPanel onboardingId={onboardingId} onClose={() => setHelpOpen(false)} />}
      </>
    );
  }

  const builderIndex = STEPS.indexOf(step as (typeof STEPS)[number]);
  const dotIndex = Math.min(builderIndex, DOT_STEPS - 1);
  const wide = step === 'preview';
  const showDots = builderIndex >= 0 && !wide;
  const inBuilder = builderIndex >= 0;
  const sectionsChosen = answers.wantedSections ?? defaultSections(answers.offering);
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <OnboardingLayout currentStep={showDots ? dotIndex : undefined} totalSteps={showDots ? DOT_STEPS : undefined} wide={wide}>
      <div className="w-full flex flex-col items-center gap-6">
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl md:text-3xl font-semibold text-gray-900 text-center focus:outline-none">
          {TITLES[step]}
        </h1>

        {step === 'choice' && <ChoiceStep onAi={() => choosePath('ai')} onQuote={() => choosePath('quote')} />}
        {step === 'quote' && <QuoteStep onboardingId={onboardingId} onSent={quoteSent} onSwitchToAi={() => choosePath('ai')} />}
        {step === 'quoteSent' && <QuoteSentStep onContinue={leaveToStripe} onSwitchToAi={() => choosePath('ai')} />}
        {step === 'offering' && <p className="text-gray-600 text-center -mt-2">{T.intro}</p>}

        {step === 'offering' && (
          <fieldset className="w-full flex flex-col gap-3">
            <legend className="sr-only">{T.stepTitles.offering}</legend>
            <p className="text-sm text-gray-500 text-center">{T.offeringHelp}</p>
            {OFFERINGS.map((o) => (
              <OptionButton key={o.value} label={o.label} help={o.help} selected={answers.offering.includes(o.value)}
                onClick={() => setAnswers((a) => ({ ...a, offering: toggle(a.offering, o.value), wantedSections: null }))} />
            ))}
            {fieldErrors.offering && <p role="alert" className="text-red-600 text-sm">{fieldErrors.offering}</p>}
          </fieldset>
        )}

        {step === 'company' && (
          <div className="w-full flex flex-col gap-5">
            <Field label={T.companyName} value={answers.companyName} onChange={(v) => update('companyName', v)} max={LIMITS.companyName[1]} error={fieldErrors.companyName} />
            <Field label={T.industry} help={T.industryHelp} value={answers.industry} onChange={(v) => update('industry', v)} max={LIMITS.industry[1]} error={fieldErrors.industry} />
            <Field label={T.audience} help={T.audienceHelp} value={answers.audience} onChange={(v) => update('audience', v)} max={LIMITS.audience[1]} multiline rows={3} error={fieldErrors.audience} />
          </div>
        )}

        {step === 'tone' && (
          <fieldset className="w-full flex flex-col gap-3">
            <legend className="sr-only">{T.stepTitles.tone}</legend>
            <p className="text-sm text-gray-500 text-center">{T.toneHelp}</p>
            {TONES.map((o) => (
              <OptionButton key={o.value} label={o.label} help={o.help} selected={answers.toneOfVoice === o.value} onClick={() => update('toneOfVoice', o.value)} />
            ))}
            {fieldErrors.toneOfVoice && <p role="alert" className="text-red-600 text-sm">{fieldErrors.toneOfVoice}</p>}
          </fieldset>
        )}

        {step === 'content' && (
          <div className="w-full flex flex-col gap-5">
            <Field label={T.companyDescription} help={T.companyDescriptionHelp} value={answers.texts.companyDescription}
              onChange={(v) => update('texts', { ...answers.texts, companyDescription: v })} max={LIMITS.companyDescription[1]} multiline rows={5} error={fieldErrors.companyDescription} />
            <Field label={T.about} help={T.aboutHelp} value={answers.texts.about}
              onChange={(v) => update('texts', { ...answers.texts, about: v })} max={LIMITS.about[1]} multiline rows={4} error={fieldErrors.about} />
            <Field label={T.usp} value={answers.texts.uniqueSellingPoints}
              onChange={(v) => update('texts', { ...answers.texts, uniqueSellingPoints: v })} max={LIMITS.uniqueSellingPoints[1]} multiline rows={3} error={fieldErrors.uniqueSellingPoints} />
            <Field label={T.extra} value={answers.texts.extra}
              onChange={(v) => update('texts', { ...answers.texts, extra: v })} max={LIMITS.extra[1]} multiline rows={3} error={fieldErrors.extra} />
            <InfoBox>{T.contactInfo}</InfoBox>
          </div>
        )}

        {step === 'sections' && (
          <fieldset className="w-full flex flex-col gap-3">
            <legend className="sr-only">{T.stepTitles.sections}</legend>
            <p className="text-sm text-gray-500 text-center">{T.sectionsHelp}</p>
            {SECTIONS.map((s) => (
              <OptionButton key={s.value} label={s.label} selected={sectionsChosen.includes(s.value)}
                onClick={() => update('wantedSections', toggle(sectionsChosen, s.value))} />
            ))}
            {fieldErrors.wantedSections && <p role="alert" className="text-red-600 text-sm">{fieldErrors.wantedSections}</p>}
          </fieldset>
        )}

        {step === 'design' && (
          <DesignStep answers={answers} onChange={(d) => update('design', d)} onShowExample={() => setExampleOpen(true)} />
        )}

        {step === 'generate' && (
          <GenerateStep
            onboardingId={onboardingId}
            resumeGenerating={generating}
            onDone={(draft) => { setSummary(draft); setGenerating(false); setView(nextView(view, 'fullscreen')); goto('result'); }}
            onHelp={() => setHelpOpen(true)}
            locked={!generating && lockState(summary).fullSitesLocked}
            onContinue={leaveToStripe}
          />
        )}

        {step === 'preview' && summary && (
          <PreviewStep
            onboardingId={onboardingId}
            summary={summary}
            focus={view.focus}
            onSummary={setSummary}
            onRebuild={() => goto('generate')}
            onHelp={() => setHelpOpen(true)}
            onApprove={leaveToStripe}
            onFullscreen={() => showResult('fullscreen')}
          />
        )}

        {error && step !== 'generate' && step !== 'preview' && (
          <ErrorBox message={error.message}>
            {error.code === 'LIMIT_REACHED' && (
              <div className="mt-2 flex flex-wrap gap-4">
                <LinkButton onClick={leaveToStripe}>{T.becomeCustomer}</LinkButton>
                <LinkButton onClick={() => setHelpOpen(true)}>{T.contactSupport}</LinkButton>
              </div>
            )}
          </ErrorBox>
        )}

        {inBuilder && builderIndex <= STEPS.indexOf('design') && (
          <div className="w-full flex flex-col-reverse md:flex-row gap-3 md:justify-between items-center mt-2">
            {step !== 'offering' ? <SecondaryButton onClick={back}>{T.back}</SecondaryButton> : <span />}
            <PrimaryButton onClick={next} disabled={saving}>{saving ? T.saving : T.next}</PrimaryButton>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 mt-2">
          <LinkButton onClick={() => setHelpOpen(true)}>{T.helpOpen}</LinkButton>
          {inBuilder && <LinkButton onClick={() => choosePath('quote')}>{T.switchToQuote}</LinkButton>}
          {step !== 'preview' && step !== 'quoteSent' && <LinkButton onClick={leaveToStripe}>{T.skip}</LinkButton>}
        </div>
      </div>

      {exampleOpen && <ExampleDialog style={answers.design.style} onClose={() => setExampleOpen(false)} />}
      {helpOpen && <HelpPanel onboardingId={onboardingId} onClose={() => setHelpOpen(false)} />}
    </OnboardingLayout>
  );
}

/** Första steget som inte är sparat hos kundportalen. */
function firstOpenStep(answered: string[]): Step {
  const has = (k: string) => answered.includes(k);
  if (!has('offering')) return 'offering';
  if (!has('companyName') || !has('industry') || !has('audience')) return 'company';
  if (!has('toneOfVoice')) return 'tone';
  if (!has('texts')) return 'content';
  if (!has('wantedSections')) return 'sections';
  if (!has('design')) return 'design';
  return 'generate';
}

function DesignStep(props: { answers: Answers; onChange: (d: Answers['design']) => void; onShowExample: () => void }) {
  const { design } = props.answers;
  const custom = design.palette.kind === 'custom' ? design.palette : null;
  return (
    <div className="w-full flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="font-medium text-gray-900 mb-2">{T.styleLegend}</legend>
        {STYLES.map((s) => (
          <OptionButton key={s.value} label={s.label} help={s.help} selected={design.style === s.value} onClick={() => props.onChange({ ...design, style: s.value })} />
        ))}
        <div className="flex justify-center mt-1">
          <SecondaryButton onClick={props.onShowExample}>{T.seeExample}</SecondaryButton>
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-3">
        <legend className="font-medium text-gray-900 mb-2">{T.paletteLegend}</legend>
        <div className="grid grid-cols-2 gap-3">
          {PALETTES.map((p) => (
            <OptionButton key={p.value} label={p.label} selected={design.palette.kind === 'preset' && design.palette.name === p.value}
              onClick={() => props.onChange({ ...design, palette: { kind: 'preset', name: p.value } })}>
              <span aria-hidden="true" className="flex -space-x-1">
                {p.colors.map((c) => <span key={c} className="h-5 w-5 rounded-full border border-white" style={{ background: c }} />)}
              </span>
            </OptionButton>
          ))}
        </div>
        <OptionButton label={T.customPalette} help={T.customPaletteHelp} selected={Boolean(custom)}
          onClick={() => props.onChange({ ...design, palette: custom || { kind: 'custom', primary: '#1d4e89', accent: '#0e7490' } })} />
        {custom && (
          <div className="flex gap-6 justify-center">
            {(['primary', 'accent'] as const).map((k) => (
              <label key={k} className="flex items-center gap-2 text-gray-800">
                <input type="color" value={custom[k]} onChange={(e) => props.onChange({ ...design, palette: { ...custom, [k]: e.target.value } })}
                  className="h-10 w-12 rounded border-2 border-gray-200" />
                {k === 'primary' ? T.primaryColor : T.accentColor}
              </label>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}

/** localStorage om det går att nå; annars null (privat läge eller blockerat). */
function safeStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}
