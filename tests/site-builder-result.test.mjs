// Hemsidebyggaren PR F: takvisning och låst läge, val mellan AI-sajt och offert, offert-
// formuläret och anropet (quote_request), och växlingen mellan helskärm och redigering.
// Kör: npm test (node --test, Node 22.18+ för .ts). Inga riktiga anrop.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const flow = await import('../lib/site-builder/flow-state.ts');
const errors = await import('../lib/site-builder/errors.ts');
const guards = await import('../lib/site-builder/guards.ts');
const { createHandlers } = await import('../lib/site-builder/handlers.ts');
const client = await import('../lib/site-builder/client.ts');

const ONB = '3f2a1b4c-5d6e-4f70-8a9b-0c1d2e3f4a5b';
const SUB = 'auth0|kund0001';

// ── Takvisning och låst läge ─────────────────────────────────────────────────────────────
test('takvisning: kundportalens caps (PR F) används', () => {
  const caps = flow.capsOf({ caps: { fullSites: { limit: 2, remaining: 1 }, improvements: { limit: 10, remaining: 7 } }, remaining: { site: 9, improve: 9 } });
  assert.deepEqual(caps, { fullSites: { limit: 2, remaining: 1 }, improvements: { limit: 10, remaining: 7 } });
});

test('takvisning: äldre svar utan caps faller tillbaka på remaining', () => {
  assert.deepEqual(flow.capsOf({ remaining: { site: 2, improve: 4 } }), { fullSites: { limit: null, remaining: 2 }, improvements: { limit: null, remaining: 4 } });
  assert.deepEqual(flow.capsOf(null), { fullSites: { limit: null, remaining: 0 }, improvements: { limit: null, remaining: 0 } });
});

test('låst läge: förbättringar och hela sajter låses var för sig vid 0', () => {
  const s = (site, improve) => ({ caps: { fullSites: { limit: 2, remaining: site }, improvements: { limit: 10, remaining: improve } } });
  assert.deepEqual(flow.lockState(s(1, 3)), { improvementsLocked: false, fullSitesLocked: false });
  assert.deepEqual(flow.lockState(s(1, 0)), { improvementsLocked: true, fullSitesLocked: false });
  assert.deepEqual(flow.lockState(s(0, 3)), { improvementsLocked: false, fullSitesLocked: true });
  assert.deepEqual(flow.lockState(s(0, 0)), { improvementsLocked: true, fullSitesLocked: true });
});

test('låst läge i UI:t: bara "Gå vidare och bli kund" och "Kontakta support"', () => {
  const result = readFileSync(new URL('../app/onboarding/hemsida/result-view.tsx', import.meta.url), 'utf8');
  const start = result.indexOf('{improvementsLocked ? (');
  const locked = result.slice(start, result.indexOf(') : (', start));
  assert.match(locked, /T\.becomeCustomer/);
  assert.match(locked, /T\.contactSupport/);
  assert.doesNotMatch(locked, /T\.edit|T\.changeLook|T\.approveContinue/);
  const edit = readFileSync(new URL('../app/onboarding/hemsida/preview-step.tsx', import.meta.url), 'utf8');
  const lockedEdit = edit.slice(edit.indexOf('{improvementsLocked ? ('), edit.indexOf(') : (', edit.indexOf('{improvementsLocked ? (')));
  assert.match(lockedEdit, /T\.becomeCustomer/);
  assert.match(lockedEdit, /T\.contactSupport/);
  assert.doesNotMatch(lockedEdit, /improveSubmit|themeSubmit/);
});

// ── Val av väg ───────────────────────────────────────────────────────────────────────────
function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), map: m };
}

test('valet mellan AI och offert sparas per onboardingId och kan bytas åt båda håll', () => {
  const st = memoryStorage();
  assert.deepEqual(flow.loadPath(st, ONB), { path: null, quoteSent: false });
  flow.savePath(st, ONB, { path: 'quote', quoteSent: false });
  assert.deepEqual(flow.loadPath(st, ONB), { path: 'quote', quoteSent: false });
  flow.savePath(st, ONB, { path: 'quote', quoteSent: true });
  assert.deepEqual(flow.loadPath(st, ONB), { path: 'quote', quoteSent: true });
  // Från offertbekräftelsen till AI-byggaren …
  flow.savePath(st, ONB, { path: 'ai', quoteSent: true });
  assert.deepEqual(flow.loadPath(st, ONB), { path: 'ai', quoteSent: false });
  // … och tillbaka: en redan skickad offert behöver inte skickas igen.
  assert.equal(JSON.parse(st.map.get(flow.pathKey(ONB))).quoteSent, true);
  flow.savePath(st, ONB, { path: 'quote', quoteSent: true });
  assert.deepEqual(flow.loadPath(st, ONB), { path: 'quote', quoteSent: true });
  // Ett annat utkast påverkas inte.
  assert.deepEqual(flow.loadPath(st, '1c9f7b3e-4d5e-4f60-8b7c-8d9e0f1a2b3c'), { path: null, quoteSent: false });
});

test('trasigt eller blockerat lager ger inget val och kastar aldrig', () => {
  const st = memoryStorage();
  st.setItem(flow.pathKey(ONB), '{inte json');
  assert.deepEqual(flow.loadPath(st, ONB), { path: null, quoteSent: false });
  st.setItem(flow.pathKey(ONB), JSON.stringify({ path: 'annat' }));
  assert.deepEqual(flow.loadPath(st, ONB), { path: null, quoteSent: false });
  const blocked = { getItem() { throw new Error('blockerat'); }, setItem() { throw new Error('blockerat'); } };
  assert.deepEqual(flow.loadPath(blocked, ONB), { path: null, quoteSent: false });
  assert.doesNotThrow(() => flow.savePath(blocked, ONB, { path: 'ai', quoteSent: false }));
});

// ── Offertformuläret ─────────────────────────────────────────────────────────────────────
const GOOD = { content: 'Startsida, tjänster och kontakt.', references: 'https://example.com/a\n\nhttps://example.org/b', timeline: 'Inom en månad', message: 'Tack!' };

test('offert: giltigt formulär ger kundportalens payload för quote_request', () => {
  const res = flow.validateQuote(GOOD);
  assert.deepEqual(res, {
    ok: true,
    payload: {
      category: 'quote_request',
      message: 'Tack!',
      quote: { content: 'Startsida, tjänster och kontakt.', references: ['https://example.com/a', 'https://example.org/b'], timeline: 'Inom en månad' },
    },
  });
});

test('offert: länkar som inte är https avvisas', () => {
  for (const ref of ['http://example.com', 'example.com', 'javascript:alert(1)', 'https://user:pw@example.com', 'https://exa mple.com']) {
    const res = flow.validateQuote({ ...GOOD, references: ref });
    assert.equal(res.ok, false, ref);
    assert.deepEqual(res.errors, [{ field: 'references', code: 'invalid_url' }], ref);
  }
});

test('offert: krav, längdtak, antal länkar och tecknen < >', () => {
  const L = flow.QUOTE_LIMITS;
  const codes = (input) => { const r = flow.validateQuote({ ...GOOD, ...input }); return r.ok ? [] : r.errors.map((e) => `${e.field}:${e.code}`); };
  assert.deepEqual(codes({ content: '' }), ['content:required']);
  assert.deepEqual(codes({ content: 'kort' }), ['content:too_short']);
  assert.deepEqual(codes({ content: 'a'.repeat(L.contentMax + 1) }), ['content:too_long']);
  assert.deepEqual(codes({ content: 'En <b>sajt</b> med kontakt' }), ['content:angles']);
  assert.deepEqual(codes({ references: Array.from({ length: L.referencesMax + 1 }, (_, i) => `https://example.com/${i}`).join('\n') }), ['references:too_many']);
  assert.deepEqual(codes({ timeline: 'a'.repeat(L.timelineMax + 1) }), ['timeline:too_long']);
  assert.deepEqual(codes({ message: 'a'.repeat(L.messageMax + 1) }), ['message:too_long']);
  assert.deepEqual(codes({ references: '', timeline: '', message: '' }), []);
});

test('offert: alla felkoder har en kundtext', async () => {
  const { T } = await import('../lib/site-builder/texts.ts');
  for (const code of ['required', 'too_short', 'too_long', 'invalid_url', 'too_many', 'angles']) assert.ok(T.quoteErrors[code], code);
});

test('offert: anropet går via support-request med category quote_request och quote', async () => {
  const sent = [];
  const h = createHandlers({
    getUserSub: async () => SUB,
    ownsOnboarding: async (sub, id) => sub === SUB && id === ONB,
    client: { call: async (method, path, payload) => { sent.push({ method, path, payload }); return { status: 201, body: { ok: true, supportRequest: { id: 'x', status: 'open' } } }; } },
    lock: guards.createGenerationLock(),
    limiter: guards.createRateLimiter({ limit: 100, windowMs: 60_000 }),
    aiLimiter: guards.createRateLimiter({ limit: 100, windowMs: 60_000 }),
    messageFor: errors.messageFor,
    portalOrigin: 'https://portal.example.com',
    timeouts: { generateMs: client.TIMEOUTS.generateMs, defaultMs: client.TIMEOUTS.defaultMs },
  });
  const v = flow.validateQuote(GOOD);
  assert.equal(v.ok, true);
  const res = await h.supportRequest(new Request('http://localhost/x', { method: 'POST', body: JSON.stringify({ onboardingId: ONB, ...v.payload }) }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, supportRequest: { id: 'x', status: 'open' } });
  assert.deepEqual(sent, [{ method: 'POST', path: '/api/onboarding-site/support-request', payload: { onboardingId: ONB, auth0Sub: SUB, ...v.payload } }]);
});

// ── Helskärm och redigering ──────────────────────────────────────────────────────────────
test('helskärmsvyns växling: helskärm först, Redigera och Byt utseende öppnar redigering, tillbaka till helskärm', () => {
  let v = flow.INITIAL_VIEW;
  assert.deepEqual(v, { mode: 'fullscreen', focus: null });
  v = flow.nextView(v, 'edit');
  assert.deepEqual(v, { mode: 'edit', focus: 'improve' });
  v = flow.nextView(v, 'fullscreen');
  assert.deepEqual(v, { mode: 'fullscreen', focus: null });
  v = flow.nextView(v, 'theme');
  assert.deepEqual(v, { mode: 'edit', focus: 'theme' });
});

test('helskärmen: ramen slutar där listen börjar, och listen är en namngiven region med fokus', () => {
  const src = readFileSync(new URL('../app/onboarding/hemsida/result-view.tsx', import.meta.url), 'utf8');
  assert.match(src, /style=\{\{ bottom: barHeight \}\}/);
  assert.match(src, /role="region"/);
  assert.match(src, /aria-label=\{T\.resultBarLabel\}/);
  assert.match(src, /firstAction\.current\?\.focus\(\)/);
  for (const key of ['T.edit', 'T.changeLook', 'T.improvementsLeft', 'T.approveContinue']) assert.ok(src.includes(key), key);
  const flowSrc = readFileSync(new URL('../app/onboarding/hemsida/site-builder-flow.tsx', import.meta.url), 'utf8');
  assert.match(flowSrc, /onDone=\{\(draft\) => \{[^}]*goto\('result'\)/);
  assert.match(readFileSync(new URL('../app/onboarding/hemsida/preview-step.tsx', import.meta.url), 'utf8'), /T\.backToFullscreen/);
});

test('frågeformuläret och ja-grenen är orörda', () => {
  // PR F ändrar bara byggarens flöde efter nej-grenen.
  const src = readFileSync(new URL('../app/onboarding/questions/questions-form.tsx', import.meta.url), 'utf8');
  assert.match(src, /router\.push\('\/onboarding\/code'\)/);
  assert.match(src, /router\.push\('\/onboarding\/hemsida'\)/);
});
