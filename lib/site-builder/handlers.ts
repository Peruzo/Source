import type { SiteBuilderClient } from './client';
import type { GenerationLock, RateLimiter } from './guards';

/**
 * Hemsidebyggarens serverroutes (app/api/onboarding/site-builder/*), som rena funktioner
 * Request → Response med beroendena injicerade. Routefilerna kopplar ihop dem med Auth0,
 * ägarkontrollen och klienten (lib/site-builder/server.ts); testerna injicerar fejkar.
 *
 * Varje anrop:
 *   1. kräver en Auth0-session (sub); saknas den blir svaret 404, samma som i övriga
 *      onboardingroutes (lib/onboarding/ownership.ts)
 *   2. räknas mot gränsen per session (AI-anropen dessutom mot en lägre gräns)
 *   3. kräver att sessionens användare äger onboardingId; annars samma 404
 *   4. vidarebefordras signerat till kundportalen med sessionens sub som auth0Sub — aldrig ett
 *      värde från webbläsaren
 *
 * Svar till webbläsaren: { ok: true, ... } eller { ok: false, code, message } där message är
 * den svenska kundtexten (lib/site-builder/errors.ts). Kundportalens interna texter skickas
 * aldrig vidare.
 *
 * GENERERING (POST generate) svarar med Server-Sent Events:
 *   started   stegen som visas
 *   progress  nästa steg i förloppet (tidsbaserat; kundportalen svarar först när sajten är klar,
 *             så stegen är en beskrivning av arbetet, inga procentsiffror)
 *   ping      livstecken var 15:e sekund, så att anslutningen hålls vid liv
 *   done      utkastets status när sajten är klar
 *   error     felkod och kundtext
 * En generering per utkast åt gången: en andra start medan en pågår ger 409
 * GENERATION_IN_PROGRESS innan kundportalen anropas, så taket debiteras inte. Bryts
 * anslutningen fortsätter genereringen; UI:t frågar då utkastets status (POST draft, som
 * returnerar generating) i stället för att starta en ny.
 */

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const API = '/api/onboarding-site';
const MAX_BODY_BYTES = 16_384;

export const DEFAULT_STAGES = Object.freeze([
  { id: 'reading', label: 'Läser dina svar', afterMs: 0 },
  { id: 'writing', label: 'Skriver texter', afterMs: 20_000 },
  { id: 'composing', label: 'Sätter ihop sidorna', afterMs: 90_000 },
  { id: 'design', label: 'Lägger på design och färger', afterMs: 240_000 },
  { id: 'checking', label: 'Kontrollerar resultatet', afterMs: 420_000 },
]);

export type HandlerDeps = {
  getUserSub: () => Promise<string | null>;
  ownsOnboarding: (userSub: string, onboardingId: string) => Promise<boolean>;
  client: SiteBuilderClient;
  lock: GenerationLock;
  limiter: RateLimiter;
  aiLimiter: RateLimiter;
  messageFor: (code: string) => string;
  portalOrigin: string;
  timeouts: { generateMs: number; defaultMs: number };
  heartbeatMs?: number;
  stages?: ReadonlyArray<{ id: string; label: string; afterMs: number }>;
  now?: () => number;
  log?: (entry: Record<string, unknown>) => void;
};

type Fail = { ok: false; status: number; code: string; extra?: Record<string, unknown> };

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export function createHandlers(deps: HandlerDeps) {
  const heartbeatMs = deps.heartbeatMs ?? 15_000;
  const stages = deps.stages ?? DEFAULT_STAGES;
  const now = deps.now ?? Date.now;
  const log = deps.log ?? (() => {});

  const failResponse = (f: Fail) => json(f.status, { ok: false, code: f.code, message: deps.messageFor(f.code), ...(f.extra || {}) });
  const fail = (status: number, code: string, extra?: Record<string, unknown>): Fail => ({ ok: false, status, code, extra });

  async function readBody(request: Request): Promise<Record<string, any> | Fail> {
    const text = await request.text();
    if (Buffer.byteLength(text) > MAX_BODY_BYTES) return fail(413, 'PAYLOAD_TOO_LARGE');
    if (!text) return {};
    try {
      const parsed = JSON.parse(text);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fail(400, 'INVALID_INPUT');
    } catch {
      return fail(400, 'INVALID_INPUT');
    }
  }

  /** Session, gräns och ägarskap. Ger { sub, onboardingId, body } eller ett fel. */
  async function guard(request: Request, opts: { ai?: boolean; needsOnboarding?: boolean } = {}) {
    const sub = await deps.getUserSub();
    if (!sub) return fail(404, 'NOT_FOUND');
    if (!deps.limiter.take(sub) || (opts.ai && !deps.aiLimiter.take(sub))) return fail(429, 'RATE_LIMITED');
    const body = request.method === 'GET' ? {} : await readBody(request);
    if ((body as Fail).ok === false) return body as Fail;
    const b = body as Record<string, any>;
    if (opts.needsOnboarding === false) return { sub, onboardingId: '', body: b };
    const onboardingId = typeof b.onboardingId === 'string' ? b.onboardingId : '';
    if (!UUID.test(onboardingId) || !(await deps.ownsOnboarding(sub, onboardingId))) return fail(404, 'NOT_FOUND');
    return { sub, onboardingId: onboardingId.toLowerCase(), body: b };
  }

  /** Vidarebefordrar och översätter. Ger { ok: true, body } eller ett fel. */
  async function forward(method: 'GET' | 'POST' | 'PUT', path: string, payload: Record<string, unknown> | null, timeoutMs = deps.timeouts.defaultMs) {
    try {
      const res = await deps.client.call(method, path, payload, { timeoutMs });
      if (res.body && res.body.ok === true) return { ok: true as const, body: res.body };
      const code = res.body && typeof res.body.code === 'string' ? res.body.code : res.status === 401 ? 'UNAUTHORIZED' : 'INTERNAL';
      const extra: Record<string, unknown> = {};
      for (const k of ['scope', 'kind', 'limit', 'reason']) if (res.body && res.body[k] !== undefined) extra[k] = res.body[k];
      if (code === 'INVALID_ANSWERS' && Array.isArray(res.body?.errors)) {
        extra.errors = res.body.errors.slice(0, 50).map((e: any) => ({ path: String(e?.path || ''), code: String(e?.code || '') }));
      }
      // 401 från kundportalen betyder att hemsidans signatur eller hemlighet är fel: ett
      // konfigurationsfel hos oss, inte kundens.
      const status = res.status === 401 ? 503 : res.status >= 400 && res.status < 600 ? res.status : 502;
      return fail(status, code, extra);
    } catch (err: any) {
      const code = err && typeof err.code === 'string' ? err.code : 'NETWORK';
      return fail(code === 'TIMEOUT' ? 504 : code === 'CONFIG_INVALID' ? 503 : 502, code);
    }
  }

  const ids = (g: { sub: string; onboardingId: string }) => ({ onboardingId: g.onboardingId, auth0Sub: g.sub });

  async function simple(request: Request, build: (g: { sub: string; onboardingId: string; body: Record<string, any> }) => { method: 'POST' | 'PUT'; path: string; payload: Record<string, unknown> } | Fail, opts: { ai?: boolean } = {}, shape?: (body: any, g: { onboardingId: string }) => Promise<Record<string, unknown>> | Record<string, unknown>) {
    const g = await guard(request, opts);
    if ((g as Fail).ok === false) return failResponse(g as Fail);
    const ok = g as { sub: string; onboardingId: string; body: Record<string, any> };
    const req = build(ok);
    if ((req as Fail).ok === false) return failResponse(req as Fail);
    const r = req as { method: 'POST' | 'PUT'; path: string; payload: Record<string, unknown> };
    const res = await forward(r.method, r.path, r.payload);
    if (res.ok === false) return failResponse(res);
    return json(200, { ok: true, ...(shape ? await shape(res.body, ok) : { draft: res.body.draft }) });
  }

  return {
    /** POST: skapa eller hämta utkastet. Svaret säger också om en generering pågår. */
    draft: (request: Request) =>
      simple(request, (g) => ({ method: 'POST', path: `${API}/draft`, payload: ids(g) }), {}, async (body, g) => ({
        draft: body.draft,
        generating: await deps.lock.isHeld(g.onboardingId),
      })),

    /** PUT: alla svar ({ answers }) eller ett steg ({ step, value }). */
    answers: (request: Request) =>
      simple(request, (g) => {
        const b = g.body;
        if (b.answers !== undefined) return { method: 'PUT', path: `${API}/answers`, payload: { ...ids(g), answers: b.answers } };
        if (typeof b.step !== 'string') return fail(400, 'INVALID_INPUT');
        return { method: 'PUT', path: `${API}/answers`, payload: { ...ids(g), step: b.step, value: b.value } };
      }),

    improve: (request: Request) =>
      simple(request, (g) => {
        const b = g.body;
        if (typeof b.sectionId !== 'string' || !SLUG.test(b.sectionId) || b.sectionId.length > 60) return fail(400, 'INVALID_INPUT');
        const payload: Record<string, unknown> = { ...ids(g), choice: b.choice };
        if (typeof b.pageSlug === 'string' && b.pageSlug) payload.pageSlug = b.pageSlug;
        if (typeof b.note === 'string' && b.note.trim()) payload.note = b.note.trim();
        return { method: 'POST', path: `${API}/sections/${encodeURIComponent(b.sectionId)}/improve`, payload };
      }, { ai: true }),

    theme: (request: Request) =>
      simple(request, (g) => {
        const payload: Record<string, unknown> = { ...ids(g) };
        if (g.body.style !== undefined) payload.style = g.body.style;
        if (g.body.palette !== undefined) payload.palette = g.body.palette;
        return { method: 'POST', path: `${API}/theme`, payload };
      }),

    /** POST: token för förhandsvisningen; svaret bär hela adressen till kundportalen. */
    previewToken: (request: Request) =>
      simple(request, (g) => ({ method: 'POST', path: `${API}/preview-token`, payload: ids(g) }), {}, (body) => ({
        url: new URL(String(body.previewPath || ''), deps.portalOrigin).toString(),
        expiresAt: body.expiresAt,
        version: body.version,
      })),

    supportRequest: (request: Request) =>
      simple(request, (g) => ({
        method: 'POST',
        path: `${API}/support-request`,
        payload: { ...ids(g), category: g.body.category, ...(typeof g.body.message === 'string' ? { message: g.body.message } : {}) },
      }), {}, (body) => ({ supportRequest: body.supportRequest })),

    /** GET: exempelsajterna för designvalet, med hela adressen till kundportalen. */
    async examples(request: Request) {
      const g = await guard(request, { needsOnboarding: false });
      if ((g as Fail).ok === false) return failResponse(g as Fail);
      const res = await forward('GET', `${API}/examples`, null);
      if (res.ok === false) return failResponse(res);
      const examples = (Array.isArray(res.body.examples) ? res.body.examples : []).map((e: any) => ({
        key: e.key, name: e.name, description: e.description, style: e.style, palette: e.palette,
        url: new URL(String(e.previewPath || ''), deps.portalOrigin).toString(),
      }));
      return json(200, { ok: true, examples });
    },

    /** POST: generering med Server-Sent Events. */
    async generate(request: Request) {
      const g = await guard(request, { ai: true });
      if ((g as Fail).ok === false) return failResponse(g as Fail);
      const ok = g as { sub: string; onboardingId: string };

      // En generering per utkast. Avvisas innan kundportalen anropas: inget tak debiteras.
      if (!(await deps.lock.acquire(ok.onboardingId))) return failResponse(fail(409, 'GENERATION_IN_PROGRESS'));

      const encoder = new TextEncoder();
      const started = now();
      let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;
      let open = true;
      const timers: ReturnType<typeof setTimeout>[] = [];
      let heartbeat: ReturnType<typeof setInterval> | null = null;

      const send = (event: string, data: unknown) => {
        if (!open || !controllerRef) return;
        try {
          controllerRef.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          open = false;
        }
      };
      const stopTimers = () => {
        timers.forEach(clearTimeout);
        if (heartbeat) clearInterval(heartbeat);
        heartbeat = null;
      };
      const close = () => {
        stopTimers();
        if (open && controllerRef) {
          open = false;
          try { controllerRef.close(); } catch { /* redan stängd */ }
        }
        open = false;
      };

      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controllerRef = controller;
          send('started', { stages: stages.map((s) => ({ id: s.id, label: s.label })) });
          for (const s of stages) timers.push(setTimeout(() => send('progress', { stage: s.id, label: s.label }), s.afterMs));
          heartbeat = setInterval(() => send('ping', { elapsedSeconds: Math.round((now() - started) / 1000) }), heartbeatMs);
        },
        cancel() {
          // Webbläsaren gick: sluta skriva, men låt genereringen bli klar och släpp låset då.
          open = false;
          stopTimers();
        },
      });

      // Körs oberoende av webbläsaren. Låset släpps när kundportalen har svarat.
      forward('POST', `${API}/generate`, ids(ok), deps.timeouts.generateMs)
        .then((res) => {
          if (res.ok) send('done', { draft: res.body.draft });
          else send('error', { code: res.code, message: deps.messageFor(res.code), ...(res.extra || {}) });
          log({ event: 'site_builder_generate', outcome: res.ok ? 'ok' : res.code, durationMs: now() - started });
        })
        .finally(async () => {
          close();
          try { await deps.lock.release(ok.onboardingId); } catch { /* låset blir inaktuellt efter LOCK_STALE_MS */ }
        });

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    },
  };
}

export type SiteBuilderHandlers = ReturnType<typeof createHandlers>;
