// Kundens GitHub-token får aldrig hamna i jobbfilen github-jobs/<jobId>.json.
// Kör: npm test  (node --test --experimental-test-module-mocks, Node 22.18+ eller 23.6+ för .ts)
//
// lib/storage/github-jobs.ts körs på riktigt mot en mockad GCS-klient som sparar filerna i minnet.
// Callbacken kontrolleras på källnivå, eftersom den kräver Next, Auth0 och GitHub för att köras.

import { test, mock, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const TOKEN = 'gho_testtoken_ABC123_never_store_me';

process.env.GCS_BUCKET_CODE_PACKAGES = 'test-bucket';

// ── GCS-mock: filerna lagras i en Map ────────────────────────────────────────
const files = new Map();
mock.module('@google-cloud/storage', {
  namedExports: {
    Storage: class {
      bucket() {
        return {
          file(name) {
            return {
              save: async (contents) => { files.set(name, String(contents)); },
              exists: async () => [files.has(name)],
              download: async () => [Buffer.from(files.get(name) ?? '')],
            };
          },
        };
      }
    },
  },
});

const logged = [];
for (const level of ['log', 'warn', 'error', 'info']) {
  mock.method(console, level, (...args) => { logged.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')); });
}
after(() => mock.restoreAll());

const jobs = await import('../lib/storage/github-jobs.ts');

beforeEach(() => {
  files.clear();
  logged.length = 0;
});

function stored(jobId) {
  const raw = files.get(`github-jobs/${jobId}.json`);
  assert.ok(raw, 'jobbfilen ska finnas');
  return { raw, json: JSON.parse(raw) };
}

const PRIVATE_JOB = {
  onboardingId: '11111111-2222-3333-4444-555555555555',
  userSub: 'anon-session',
  jobId: 'job-private-1',
  repo: 'acme/site',
  owner: 'acme',
  repoName: 'site',
  repoUrl: 'https://github.com/acme/site',
};

test('createGitHubJob skriver aldrig någon token, även om en anropare skickar med en', async () => {
  // Typen tillåter inte längre githubToken; en anropare som kringgår typen ska ändå inte få den lagrad.
  await jobs.createGitHubJob({ ...PRIVATE_JOB, githubToken: TOKEN });
  const { raw, json } = stored('job-private-1');
  assert.equal('githubToken' in json, false);
  assert.ok(!raw.includes(TOKEN));
  assert.ok(!logged.join('\n').includes(TOKEN));
});

test('publikt repo: jobbfilen har samma fält som tidigare', async () => {
  await jobs.createGitHubJob({ ...PRIVATE_JOB, jobId: 'job-public-1' });
  const { json } = stored('job-public-1');
  assert.deepEqual(
    Object.keys(json).sort(),
    ['createdAt', 'jobId', 'onboardingId', 'owner', 'repo', 'repoName', 'repoUrl', 'status', 'updatedAt', 'userSub'],
  );
  assert.equal(json.status, 'queued');
  assert.equal(json.repoUrl, 'https://github.com/acme/site');
});

test('äldre jobbfil med token: getGitHubJob returnerar jobbet utan token', async () => {
  files.set('github-jobs/job-legacy-1.json', JSON.stringify({ ...PRIVATE_JOB, jobId: 'job-legacy-1', status: 'completed', createdAt: 'x', updatedAt: 'x', githubToken: TOKEN }));
  const job = await jobs.getGitHubJob('job-legacy-1');
  assert.equal(job.status, 'completed');
  assert.equal(job.repoUrl, 'https://github.com/acme/site');
  assert.equal('githubToken' in job, false);
  assert.ok(!logged.join('\n').includes(TOKEN));
});

test('äldre jobbfil med token: updateJobStatus skriver tillbaka filen utan token', async () => {
  files.set('github-jobs/job-legacy-2.json', JSON.stringify({ ...PRIVATE_JOB, jobId: 'job-legacy-2', status: 'running', createdAt: 'x', updatedAt: 'x', githubToken: TOKEN }));
  await jobs.updateJobStatus('job-legacy-2', 'completed', { completedAt: 'nu' });
  const { raw, json } = stored('job-legacy-2');
  assert.equal(json.status, 'completed');
  assert.equal(json.completedAt, 'nu');
  assert.equal('githubToken' in json, false);
  assert.ok(!raw.includes(TOKEN));
});

// ── Callbacken, på källnivå ──────────────────────────────────────────────────
const callbackSource = readFileSync(new URL('../app/api/github/callback/route.ts', import.meta.url), 'utf8');

function callArgument(source, callee) {
  const start = source.indexOf(`${callee}(`);
  assert.ok(start >= 0, `${callee} ska anropas i callbacken`);
  let depth = 0;
  for (let i = start + callee.length; i < source.length; i += 1) {
    if (source[i] === '(') depth += 1;
    if (source[i] === ')') { depth -= 1; if (depth === 0) return source.slice(start, i + 1); }
  }
  throw new Error(`hittade inte slutet på ${callee}(`);
}

test('callbacken skickar ingen token till createGitHubJob', () => {
  const arg = callArgument(callbackSource, 'createGitHubJob');
  assert.ok(!/\btoken\b/.test(arg), `createGitHubJob får inte få token: ${arg}`);
  assert.ok(!/githubToken/.test(callbackSource), 'callbacken ska inte nämna githubToken');
});

test('callbacken skickar fortfarande token direkt till workern (privata repon oförändrade)', () => {
  const arg = callArgument(callbackSource, 'triggerExternalGitHubWorker');
  assert.match(arg, /githubAccessToken:\s*token/);
});

test('callbacken loggar aldrig token', () => {
  const logCalls = callbackSource.match(/console\.(log|warn|error|info)\([\s\S]*?\);/g) ?? [];
  for (const call of logCalls) {
    // Variabeln token (eller tokenData.access_token) får inte skickas till console.
    assert.ok(!/\$\{token\}|[,(]\s*token\s*[,)]|tokenData\.access_token/.test(call), `loggrad med token: ${call}`);
  }
});
