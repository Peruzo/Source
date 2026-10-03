// Hemsidebyggaren ("Gör min hemsida"): serverklienten, felöversättningen, routernas skydd och
// genereringen med Server-Sent Events. Kör: npm test (node --test, Node 22.18+ för .ts).
//
// Kundportalen är en fejk: inga riktiga anrop, inga hemligheter. Signaturen kontrolleras mot
// exempelvektorn i kundportalens docs/site-builder-onboarding-api.md (påhittade värden).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const client = await import('../lib/site-builder/client.ts');
const errors = await import('../lib/site-builder/errors.ts');
const guards = await import('../lib/site-builder/guards.ts');
const { createHandlers } = await import('../lib/site-builder/handlers.ts');

const ONB = '3f2a1b4c-5d6e-4f70-8a9b-0c1d2e3f4a5b';
const OTHER_ONB = '1c9f7b3e-4d5e-4f60-8b7c-8d9e0f1a2b3c';
const SUB = 'auth0|kund0001';
const DRAFT = { onboardingId: ONB, status: 'draft', version: 1, hasAnswers: true, answeredSteps: [], answersComplete: true, hasDefinition: true, outline: null, remaining: { site: 4, improve: 40 } };

// ── Signaturen ───────────────────────────────────────────────────────────────────────────
test('signaturen följer kontraktets exempelvektor', () => {
  const body = JSON.stringify({ onboardingId: ONB, auth0Sub: 'auth0|exempel123' });
  const sig = client.signRequest({ secret: 'exempelhemlighet', method: 'POST', path: '/api/onboarding-site/draft', timestamp: '1767225600', nonce: 'k3J9xQ2mP7vR4tY8', body });
  assert.equal(sig, '308e297870d3a9465634f9f28af70447f644068f0de52e81d60994e55080d038');
});

test('klienten signerar exakt de bytes den skickar, med sökväg och rubriker enligt kontraktet', async () => {
  const sent = [];
  const c = client.createSiteBuilderClient({
    baseUrl: 'https://portal.example.com', secret: 's3cret-test', now: () => 1767225600_000, nonce: () => 'nonce-test-00000001',
    transport: async (req) => { sent.push(req); return { status: 200, body: { ok: true } }; },
  });
  await c.call('POST', '/api/onboarding-site/draft', { onboardingId: ONB, auth0Sub: SUB });
  const [req] = sent;
  assert.equal(req.url.toString(), 'https://portal.example.com/api/onboarding-site/draft');
  assert.equal(req.headers['X-Site-Builder-Timestamp'], '1767225600');
  assert.equal(req.headers['X-Site-Builder-Nonce'], 'nonce-test-00000001');
  const expected = client.signRequest({ secret: 's3cret-test', method: 'POST', path: '/api/onboarding-site/draft', timestamp: '1767225600', nonce: 'nonce-test-00000001', body: req.body });
  assert.equal(req.headers['X-Site-Builder-Signature'], `v1=${expected}`);
  assert.equal(req.body, JSON.stringify({ onboardingId: ONB, auth0Sub: SUB }));
});

test('GET signerar en tom body', async () => {
  const sent = [];
  const c = client.createSiteBuilderClient({ baseUrl: 'https://portal.example.com', secret: 'x', now: () => 0, nonce: () => 'nonce-test-00000002', transport: async (r) => { sent.push(r); return { status: 200, body: { ok: true } }; } });
  await c.call('GET', '/api/onboarding-site/examples');
  assert.equal(sent[0].body, '');
  assert.equal(sent[0].headers['X-Site-Builder-Signature'], `v1=${client.signRequest({ secret: 'x', method: 'GET', path: '/api/onboarding-site/examples', timestamp: '0', nonce: 'nonce-test-00000002', body: '' })}`);
});

test('saknad konfiguration ger CONFIG_INVALID utan anrop', async () => {
  let called = false;
  const c = client.createSiteBuilderClient({ baseUrl: '', secret: '', transport: async () => { called = true; return { status: 200, body: {} }; } });
  await assert.rejects(c.call('POST', '/api/onboarding-site/draft', {}), (e) => e.code === 'CONFIG_INVALID');
  assert.equal(called, false);
});

// ── Timeouts ─────────────────────────────────────────────────────────────────────────────
test('timeoutvärdena: generering 3 600 s, övriga 30 s', () => {
  assert.equal(client.TIMEOUTS.generateMs, 3_600_000);
  assert.equal(client.TIMEOUTS.defaultMs, 30_000);
});

test('generate-anropet skickas med 3 600 s, övriga med standardtiden', async () => {
  const seen = [];
  const fake = { call: async (method, path, payload, opts) => { seen.push([path, opts.timeoutMs]); return { status: 200, body: { ok: true, draft: DRAFT } }; } };
  const h = handlers({ client: fake });
  await h.draft(post({ onboardingId: ONB }));
  const res = await h.generate(post({ onboardingId: ONB }));
  await readAll(res);
  assert.deepEqual(seen, [['/api/onboarding-site/draft', 30_000], ['/api/onboarding-site/generate', 3_600_000]]);
});

test('nodeTransport: tidsgränsen gäller och ger TIMEOUT', async () => {
  // Servern svarar aldrig: utfallet avgörs bara av klientens tidsgräns, inte av ett tidsfönster.
  const server = http.createServer(() => {});
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  try {
    await assert.rejects(
      client.nodeTransport({ url: new URL(`http://127.0.0.1:${port}/x`), method: 'POST', headers: {}, body: '{}', timeoutMs: 100 }),
      (e) => e.code === 'TIMEOUT'
    );
  } finally {
    server.closeAllConnections();
    server.close();
  }
});

test('nodeTransport: svar inom tiden tolkas som JSON', async () => {
  const server = http.createServer((req, res) => { res.setHeader('Content-Type', 'application/json'); res.end('{"ok":true,"x":1}'); });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  try {
    const res = await client.nodeTransport({ url: new URL(`http://127.0.0.1:${port}/x`), method: 'GET', headers: {}, body: '', timeoutMs: 60_000 });
    assert.deepEqual(res, { status: 200, body: { ok: true, x: 1 } });
  } finally {
    server.close();
  }
});

// ── Felöversättningen ────────────────────────────────────────────────────────────────────
test('kundportalens felkoder översätts till svenska kundtexter', () => {
  for (const code of ['NOT_FOUND', 'INVALID_ANSWERS', 'LIMIT_REACHED', 'MODEL_ERROR', 'OUTPUT_TRUNCATED', 'GENERATION_FAILED', 'CONFIG_INVALID', 'RATE_LIMITED', 'NO_DEFINITION', 'GENERATION_IN_PROGRESS', 'TIMEOUT', 'NETWORK', 'UNAUTHORIZED']) {
    const text = errors.messageFor(code);
    assert.ok(text && text !== errors.DEFAULT_ERROR_MESSAGE, code);
    assert.doesNotMatch(text, /\b(error|failed|invalid|limit|model)\b/i, `${code}: ${text}`);
  }
  assert.equal(errors.messageFor('NÅGOT_OKÄNT'), errors.DEFAULT_ERROR_MESSAGE);
  assert.match(errors.messageFor('LIMIT_REACHED'), /Kontakta support/);
});

// ── Handlers: session, ägarskap, gränser ─────────────────────────────────────────────────
function post(body, method = 'POST') {
  return new Request('http://localhost/api/onboarding/site-builder/x', { method, body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
}

function handlers(over = {}) {
  return createHandlers({
    getUserSub: async () => SUB,
    ownsOnboarding: async (sub, id) => sub === SUB && id === ONB,
    client: { call: async () => ({ status: 200, body: { ok: true, draft: DRAFT } }) },
    lock: guards.createGenerationLock(),
    limiter: guards.createRateLimiter({ limit: 1000, windowMs: 60_000 }),
    aiLimiter: guards.createRateLimiter({ limit: 1000, windowMs: 60_000 }),
    messageFor: errors.messageFor,
    portalOrigin: 'https://portal.example.com',
    timeouts: { generateMs: client.TIMEOUTS.generateMs, defaultMs: client.TIMEOUTS.defaultMs },
    heartbeatMs: 15_000,
    ...over,
  });
}

async function readAll(res) {
  return new Response(res.body).text();
}

test('annan användares onboardingId ger 404, utan anrop till kundportalen', async () => {
  let calls = 0;
  const h = handlers({ client: { call: async () => { calls += 1; return { status: 200, body: { ok: true } }; } } });
  for (const name of ['draft', 'theme', 'previewToken', 'supportRequest', 'generate', 'improve']) {
    const res = await h[name](post({ onboardingId: OTHER_ONB, sectionId: 'hero', choice: 'shorter' }));
    assert.equal(res.status, 404, name);
    assert.equal((await res.json()).code, 'NOT_FOUND');
  }
  const put = await h.answers(post({ onboardingId: OTHER_ONB, step: 'industry', value: 'x' }, 'PUT'));
  assert.equal(put.status, 404);
  assert.equal(calls, 0);
});

test('utan session: samma 404', async () => {
  const h = handlers({ getUserSub: async () => null });
  const res = await h.draft(post({ onboardingId: ONB }));
  assert.equal(res.status, 404);
  const ex = await h.examples(new Request('http://localhost/x'));
  assert.equal(ex.status, 404);
});

test('auth0Sub kommer från sessionen, aldrig från webbläsarens body', async () => {
  const seen = [];
  const h = handlers({ client: { call: async (m, p, payload) => { seen.push(payload); return { status: 200, body: { ok: true, draft: DRAFT } }; } } });
  await h.draft(post({ onboardingId: ONB, auth0Sub: 'auth0|annan' }));
  assert.deepEqual(seen[0], { onboardingId: ONB, auth0Sub: SUB });
});

test('gräns per session ger 429 RATE_LIMITED', async () => {
  const h = handlers({ limiter: guards.createRateLimiter({ limit: 2, windowMs: 60_000 }) });
  const s = [];
  for (let i = 0; i < 3; i += 1) s.push((await h.draft(post({ onboardingId: ONB }))).status);
  assert.deepEqual(s, [200, 200, 429]);
});

test('kundportalens fel översätts; 401 från portalen blir 503 (konfigurationsfel hos oss)', async () => {
  const h = handlers({ client: { call: async () => ({ status: 429, body: { ok: false, code: 'LIMIT_REACHED', scope: 'user', kind: 'site', limit: 10, message: 'internal text' } }) } });
  const res = await h.theme(post({ onboardingId: ONB, style: 'bold' }));
  assert.equal(res.status, 429);
  const body = await res.json();
  assert.equal(body.code, 'LIMIT_REACHED');
  assert.equal(body.message, errors.messageFor('LIMIT_REACHED'));
  assert.equal(body.scope, 'user');
  const h401 = handlers({ client: { call: async () => ({ status: 401, body: { ok: false, code: 'UNAUTHORIZED' } }) } });
  assert.equal((await h401.draft(post({ onboardingId: ONB }))).status, 503);
});

test('förhandsvisningens och exemplens adresser byggs mot kundportalens origin', async () => {
  const h = handlers({ client: { call: async (m, p) => p.endsWith('/preview-token')
    ? { status: 200, body: { ok: true, token: 't', expiresAt: '2030-01-01T00:00:00.000Z', version: 2, previewPath: '/webbplats-forhandsvisning/onboarding?token=t' } }
    : { status: 200, body: { ok: true, examples: [{ key: 'minimal', name: 'Minimal', description: 'd', style: 'minimal', palette: { kind: 'preset', name: 'charcoal' }, previewPath: '/webbplats-exempel/minimal' }] } } } });
  const t = await (await h.previewToken(post({ onboardingId: ONB }))).json();
  assert.equal(t.url, 'https://portal.example.com/webbplats-forhandsvisning/onboarding?token=t');
  const ex = await (await h.examples(new Request('http://localhost/x'))).json();
  assert.equal(ex.examples[0].url, 'https://portal.example.com/webbplats-exempel/minimal');
});

// ── Generering med Server-Sent Events ────────────────────────────────────────────────────
function deferred() {
  let resolve;
  const promise = new Promise((r) => { resolve = r; });
  return { promise, resolve };
}

/** Läser strömmen händelse för händelse; onEvent får alla hittills lästa händelser. */
async function readEvents(res, onEvent = () => {}) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const seen = [];
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      seen.push(...parseSse(buffer.slice(0, idx + 2)));
      buffer = buffer.slice(idx + 2);
      onEvent(seen);
    }
  }
  return seen;
}

/** Ett riktigt lås där varje release kan inväntas (i stället för att vänta en viss tid). */
function trackedLock() {
  const lock = guards.createGenerationLock();
  let pending = deferred();
  return {
    lock: {
      acquire: lock.acquire,
      isHeld: lock.isHeld,
      release: async (id) => { await lock.release(id); const d = pending; pending = deferred(); d.resolve(); },
    },
    nextRelease: () => pending.promise,
  };
}

function parseSse(text) {
  return text.split('\n\n').filter(Boolean).map((block) => {
    const ev = /event: (.+)/.exec(block)?.[1];
    const data = /data: (.+)/.exec(block)?.[1];
    return { event: ev, data: data ? JSON.parse(data) : null };
  });
}

test('SSE: förlopp, livstecken och slutresultat', async () => {
  // Händelsestyrt: kundportalens svar släpps först när två livstecken och nästa steg har lästs
  // ur strömmen. Intervallen är korta, men inget tidsfönster avgör utfallet.
  const gate = deferred();
  const h = handlers({
    heartbeatMs: 5,
    stages: [{ id: 'a', label: 'Läser dina svar', afterMs: 0 }, { id: 'b', label: 'Skriver texter', afterMs: 1 }],
    client: { call: async () => { await gate.promise; return { status: 200, body: { ok: true, draft: DRAFT } }; } },
  });
  const res = await h.generate(post({ onboardingId: ONB }));
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/event-stream/);
  const events = await readEvents(res, (seen) => {
    const pings = seen.filter((e) => e.event === 'ping').length;
    if (pings >= 2 && seen.some((e) => e.event === 'progress' && e.data.stage === 'b')) gate.resolve();
  });
  const names = events.map((e) => e.event);
  assert.equal(names[0], 'started');
  assert.deepEqual(events[0].data.stages.map((s) => s.label), ['Läser dina svar', 'Skriver texter']);
  assert.ok(names.includes('progress'));
  assert.ok(names.filter((n) => n === 'ping').length >= 2, names.join(','));
  assert.equal(names.at(-1), 'done');
  assert.deepEqual(events.at(-1).data.draft, DRAFT);
});

test('SSE: fel från kundportalen blir error-händelse med kundtext', async () => {
  const h = handlers({ client: { call: async () => ({ status: 502, body: { ok: false, code: 'MODEL_ERROR' } }) } });
  const events = parseSse(await readAll(await h.generate(post({ onboardingId: ONB }))));
  const last = events.at(-1);
  assert.equal(last.event, 'error');
  assert.equal(last.data.code, 'MODEL_ERROR');
  assert.equal(last.data.message, errors.messageFor('MODEL_ERROR'));
});

test('dubbelstart: "pågår redan" (409) utan anrop till kundportalen, så taket debiteras inte', async () => {
  const gate = deferred();
  const calls = [];
  const h = handlers({ client: { call: async (m, p) => { calls.push(p); if (p.endsWith('/generate')) await gate.promise; return { status: 200, body: { ok: true, draft: DRAFT } }; } } });
  const first = await h.generate(post({ onboardingId: ONB }));
  const second = await h.generate(post({ onboardingId: ONB }));
  assert.equal(second.status, 409);
  const body = await second.json();
  assert.equal(body.code, 'GENERATION_IN_PROGRESS');
  assert.equal(body.message, errors.messageFor('GENERATION_IN_PROGRESS'));
  assert.deepEqual(calls.filter((p) => p.endsWith('/generate')), ['/api/onboarding-site/generate']);
  gate.resolve();
  await readAll(first);
});

test('återupptagning: bruten anslutning stoppar inte genereringen; draft visar generating utan att starta om', async () => {
  const gate = deferred();
  const calls = [];
  const tracked = trackedLock();
  const h = handlers({ lock: tracked.lock, client: { call: async (m, p) => { calls.push(p); if (p.endsWith('/generate')) await gate.promise; return { status: 200, body: { ok: true, draft: DRAFT } }; } } });
  const res = await h.generate(post({ onboardingId: ONB }));
  const reader = res.body.getReader();
  await reader.read(); // started
  await reader.cancel(); // webbläsaren gick

  const during = await (await h.draft(post({ onboardingId: ONB }))).json();
  assert.equal(during.generating, true);

  const released = tracked.nextRelease();
  gate.resolve();
  await released;
  const after = await (await h.draft(post({ onboardingId: ONB }))).json();
  assert.equal(after.generating, false);
  assert.equal(after.draft.hasDefinition, true);
  assert.equal(calls.filter((p) => p.endsWith('/generate')).length, 1);
});

test('låset släpps även när kundportalen inte svarar (timeout)', async () => {
  const tracked = trackedLock();
  const h = handlers({ lock: tracked.lock, client: { call: async () => { const e = new Error('t'); e.code = 'TIMEOUT'; throw e; } } });
  const released = tracked.nextRelease();
  const events = parseSse(await readAll(await h.generate(post({ onboardingId: ONB }))));
  await released;
  assert.equal(events.at(-1).data.code, 'TIMEOUT');
  const again = await h.generate(post({ onboardingId: ONB }));
  assert.equal(again.status, 200);
  await readAll(again);
});

test('övergivet lås (äldre än LOCK_STALE_MS) tas över', async () => {
  let t = 0;
  const lock = guards.createGenerationLock({ now: () => t });
  assert.equal(await lock.acquire(ONB), true);
  assert.equal(await lock.acquire(ONB), false);
  t = guards.LOCK_STALE_MS + 1;
  assert.equal(await lock.acquire(ONB), true);
});

// ── Hemligheter når aldrig webbläsaren ───────────────────────────────────────────────────
const SECRET_NAMES = ['SITE_BUILDER_HMAC_SECRET', 'SITE_BUILDER_API_URL'];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

test('ingen klientfil importerar servermodulerna eller läser hemligheterna', () => {
  const root = new URL('../', import.meta.url).pathname;
  const files = [...walk(join(root, 'app/onboarding/hemsida')), join(root, 'lib/site-builder/texts.ts')];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    for (const n of SECRET_NAMES) assert.ok(!src.includes(n), `${f} nämner ${n}`);
    assert.doesNotMatch(src, /site-builder\/(server|client|handlers|gcs-lock-store)/, f);
  }
});

test('byggutdatan för webbläsaren innehåller inga hemlighetsnamn eller signaturmaterial', (t) => {
  const root = new URL('../.next/static', import.meta.url).pathname;
  if (!existsSync(root)) { t.skip('kör npm run build först'); return; }
  const files = walk(root).filter((f) => f.endsWith('.js'));
  assert.ok(files.length > 0);
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    for (const n of [...SECRET_NAMES, 'X-Site-Builder-Signature', 'createHmac']) assert.ok(!src.includes(n), `${f} innehåller ${n}`);
  }
});
