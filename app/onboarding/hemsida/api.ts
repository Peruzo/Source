/**
 * Webbläsarens anrop till hemsidans egna serverroutes (app/api/onboarding/site-builder/*).
 * Inga hemligheter här: allt signeras på servern.
 */

export type DraftSummary = {
  onboardingId: string;
  status: string;
  version: number;
  hasAnswers: boolean;
  answeredSteps: string[];
  answersComplete: boolean;
  hasDefinition: boolean;
  outline: { pages: { slug: string; title: string; isHome: boolean; sections: { id: string; type: string }[] }[] } | null;
  /** Taken före kundskap (kundportalen PR F). Saknas i äldre svar; se capsOf i flow-state.ts. */
  caps?: { fullSites: { limit: number; remaining: number }; improvements: { limit: number; remaining: number } };
  remaining: { site: number; improve: number };
};

export type ApiError = { ok: false; code: string; message: string; errors?: { path: string; code: string }[]; scope?: string };
export type ApiResult<T> = ({ ok: true } & T) | ApiError;

const BASE = '/api/onboarding/site-builder';
const NETWORK_ERROR: ApiError = { ok: false, code: 'NETWORK', message: 'Vi kunde inte nå tjänsten. Kontrollera anslutningen och försök igen.' };

export async function api<T>(path: string, method: 'GET' | 'POST' | 'PUT', body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    });
    const data = await res.json().catch(() => null);
    if (data && typeof data === 'object' && 'ok' in data) return data as ApiResult<T>;
    return { ok: false, code: 'INTERNAL', message: 'Något gick fel hos oss. Försök igen om en stund.' };
  } catch {
    return NETWORK_ERROR;
  }
}

export type GenerateEvent =
  | { type: 'started'; stages: { id: string; label: string }[] }
  | { type: 'progress'; stage: string; label: string }
  | { type: 'ping'; elapsedSeconds: number }
  | { type: 'done'; draft: DraftSummary }
  | { type: 'error'; code: string; message: string; scope?: string };

/**
 * Startar genereringen och läser Server-Sent Events ur svaret. Returnerar hur strömmen slutade:
 *   'done' / 'error'  ett slutligt besked kom
 *   'busy'            en generering pågick redan (409); inget tak debiterades
 *   'interrupted'     anslutningen bröts före beskedet; genereringen kan pågå på servern
 */
export async function startGeneration(onboardingId: string, onEvent: (e: GenerateEvent) => void): Promise<'done' | 'error' | 'busy' | 'interrupted' | ApiError> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ onboardingId }),
      credentials: 'same-origin',
    });
  } catch {
    return 'interrupted';
  }
  if (!res.ok || !res.body || !(res.headers.get('content-type') || '').includes('text/event-stream')) {
    const data = await res.json().catch(() => null);
    if (data && data.code === 'GENERATION_IN_PROGRESS') return 'busy';
    return data && data.ok === false ? (data as ApiError) : { ok: false, code: 'INTERNAL', message: 'Något gick fel hos oss. Försök igen om en stund.' };
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let outcome: 'done' | 'error' | null = null;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf('\n\n')) >= 0) {
        const block = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const event = parseEvent(block);
        if (!event) continue;
        onEvent(event);
        if (event.type === 'done') outcome = 'done';
        if (event.type === 'error') outcome = 'error';
      }
    }
  } catch {
    return outcome || 'interrupted';
  }
  return outcome || 'interrupted';
}

export function parseEvent(block: string): GenerateEvent | null {
  let type = '';
  let data = '';
  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) type = line.slice(6).trim();
    else if (line.startsWith('data:')) data += line.slice(5).trim();
  }
  if (!type) return null;
  try {
    return { type, ...(data ? JSON.parse(data) : {}) } as GenerateEvent;
  } catch {
    return null;
  }
}
