/**
 * Ren logik för "Gör min hemsida" (PR F), utan React och utan relativa importer, så att den kan
 * testas med node --test:
 *
 *   capsOf / lockState   taken före kundskap (kundportalens caps) och låst läge
 *   loadPath / savePath  kundens val av väg: själv med AI eller offert från Source
 *   validateQuote        offertformuläret, med samma regler som kundportalens quote_request
 *   nextView             växlingen mellan helskärm och redigeringsvyn
 */

// ── Tak och låst läge ─────────────────────────────────────────────────────────────────────

export type Cap = { limit: number | null; remaining: number };
export type Caps = { fullSites: Cap; improvements: Cap };

type SummaryLike = {
  caps?: { fullSites?: { limit?: number; remaining?: number }; improvements?: { limit?: number; remaining?: number } } | null;
  remaining?: { site?: number; improve?: number } | null;
};

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

/** Kundportalens caps (PR F), med reserv till den äldre formen remaining { site, improve }. */
export function capsOf(summary: SummaryLike | null | undefined): Caps {
  const c = summary?.caps;
  const r = summary?.remaining;
  return {
    fullSites: {
      limit: num(c?.fullSites?.limit),
      remaining: Math.max(0, num(c?.fullSites?.remaining) ?? num(r?.site) ?? 0),
    },
    improvements: {
      limit: num(c?.improvements?.limit),
      remaining: Math.max(0, num(c?.improvements?.remaining) ?? num(r?.improve) ?? 0),
    },
  };
}

/**
 * Låst läge. improvementsLocked: inga fler förbättringar eller byten av utseende.
 * fullSitesLocked: ingen ny hel sajt (varken första generering eller "Bygg om").
 * När något är låst visar UI:t bara "Gå vidare och bli kund" och, sekundärt, "Kontakta support".
 */
export function lockState(summary: SummaryLike | null | undefined) {
  const caps = capsOf(summary);
  return {
    improvementsLocked: caps.improvements.remaining <= 0,
    fullSitesLocked: caps.fullSites.remaining <= 0,
  };
}

// ── Val av väg ────────────────────────────────────────────────────────────────────────────

export type BuildPath = 'ai' | 'quote';
export type PathState = { path: BuildPath | null; quoteSent: boolean };
type StorageLike = { getItem(key: string): string | null; setItem(key: string, value: string): void };

export const pathKey = (onboardingId: string) => `site-builder:path:${onboardingId}`;

/** Läser valet. Okänt eller trasigt innehåll ger inget val, så att kunden får välja igen. */
export function loadPath(storage: StorageLike | null | undefined, onboardingId: string): PathState {
  try {
    const raw = storage?.getItem(pathKey(onboardingId));
    const parsed = raw ? JSON.parse(raw) : null;
    const path = parsed && (parsed.path === 'ai' || parsed.path === 'quote') ? parsed.path : null;
    return { path, quoteSent: Boolean(parsed && parsed.quoteSent === true && path === 'quote') };
  } catch {
    return { path: null, quoteSent: false };
  }
}

/** Sparar valet. Byte till AI behåller att en offert redan är skickad, utan att visa bekräftelsen. */
export function savePath(storage: StorageLike | null | undefined, onboardingId: string, state: PathState): void {
  try {
    storage?.setItem(pathKey(onboardingId), JSON.stringify({ path: state.path, quoteSent: state.quoteSent }));
  } catch {
    /* blockerat eller fullt: valet gäller bara den här sidvisningen */
  }
}

// ── Offertformuläret ──────────────────────────────────────────────────────────────────────

export const QUOTE_LIMITS = Object.freeze({ contentMin: 10, contentMax: 1000, referencesMax: 5, referenceMax: 300, timelineMax: 200, messageMax: 500 });
const PLAIN = /^[^<>\u0000-\u0009\u000B-\u001F\u007F]*$/;

export type QuoteInput = { content: string; references: string; timeline: string; message: string };
export type QuoteError = { field: keyof QuoteInput; code: 'required' | 'too_short' | 'too_long' | 'invalid_url' | 'too_many' | 'angles' };

export function isHttpsLink(value: string): boolean {
  if (!value || value.length > QUOTE_LIMITS.referenceMax || /\s/.test(value) || !value.startsWith('https://')) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && Boolean(u.hostname) && !u.username && !u.password;
  } catch {
    return false;
  }
}

/** En länk per rad; tomma rader ignoreras. */
export function parseReferences(text: string): string[] {
  return String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

/**
 * Validerar offertformuläret och bygger kundportalens payload för quote_request:
 *   { category: 'quote_request', message, quote: { content, references, timeline } }
 */
export function validateQuote(input: QuoteInput):
  | { ok: true; payload: { category: 'quote_request'; message: string; quote: { content: string; references: string[]; timeline: string } } }
  | { ok: false; errors: QuoteError[] } {
  const L = QUOTE_LIMITS;
  const errors: QuoteError[] = [];
  const content = String(input.content || '').trim();
  const timeline = String(input.timeline || '').trim();
  const message = String(input.message || '').replace(/\r\n?/g, '\n').trim();
  const references = parseReferences(input.references);

  if (!content) errors.push({ field: 'content', code: 'required' });
  else if (content.length < L.contentMin) errors.push({ field: 'content', code: 'too_short' });
  else if (content.length > L.contentMax) errors.push({ field: 'content', code: 'too_long' });
  else if (!PLAIN.test(content.replace(/\n/g, ' '))) errors.push({ field: 'content', code: 'angles' });

  if (references.length > L.referencesMax) errors.push({ field: 'references', code: 'too_many' });
  else if (references.some((r) => !isHttpsLink(r))) errors.push({ field: 'references', code: 'invalid_url' });

  if (timeline.length > L.timelineMax) errors.push({ field: 'timeline', code: 'too_long' });
  else if (!PLAIN.test(timeline)) errors.push({ field: 'timeline', code: 'angles' });

  if (message.length > L.messageMax) errors.push({ field: 'message', code: 'too_long' });
  else if (!PLAIN.test(message)) errors.push({ field: 'message', code: 'angles' });

  if (errors.length) return { ok: false, errors };
  return { ok: true, payload: { category: 'quote_request', message, quote: { content, references, timeline } } };
}

// ── Helskärm och redigering ───────────────────────────────────────────────────────────────

export type ResultView = { mode: 'fullscreen' | 'edit'; focus: 'improve' | 'theme' | null };
export type ViewAction = 'edit' | 'theme' | 'fullscreen';

/** Resultatet visas först i helskärm. "Redigera" och "Byt utseende" öppnar redigeringsvyn. */
export const INITIAL_VIEW: ResultView = Object.freeze({ mode: 'fullscreen', focus: null }) as ResultView;

export function nextView(_current: ResultView, action: ViewAction): ResultView {
  if (action === 'edit') return { mode: 'edit', focus: 'improve' };
  if (action === 'theme') return { mode: 'edit', focus: 'theme' };
  return { mode: 'fullscreen', focus: null };
}
