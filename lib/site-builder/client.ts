import crypto from 'node:crypto';
import http from 'node:http';
import https from 'node:https';

/**
 * Serverklient mot kundportalens hemsidebyggar-API (/api/onboarding-site/*).
 *
 * BARA PÅ SERVERN. Hemligheten SITE_BUILDER_HMAC_SECRET och adressen SITE_BUILDER_API_URL läses
 * av anroparen (lib/site-builder/server.ts) och skickas in hit; ingenting här når webbläsaren.
 *
 * Signaturen följer kundportalens kontrakt (docs/site-builder-onboarding-api.md, avsnitt 2):
 *   v1 \n METOD \n SÖKVÄG \n TIDSSTÄMPEL \n NONCE \n RÅ BODY   →  HMAC-SHA256, hex
 * i rubrikerna X-Site-Builder-Timestamp, X-Site-Builder-Nonce och X-Site-Builder-Signature (v1=…).
 * Bodyn serialiseras en gång och exakt samma bytes signeras och skickas.
 *
 * TIMEOUTS: en hel generering är synkron hos kundportalen och kan ta lång tid. Next:s fetch
 * (undici) har 300 s som standard för svarsrubriker och går inte att ställa om utan undici som
 * beroende, så klienten använder node:http/https direkt med uttryckliga tider:
 *   - socketens tomgångstid (motsvarar undicis headersTimeout och bodyTimeout) = timeoutMs
 *   - en total tidsgräns för hela anropet = timeoutMs
 * Generering får 3 600 s, samma som Cloud Run-tjänsternas tidsgräns. Övriga anrop 30 s.
 */

export const TIMEOUTS = Object.freeze({
  generateMs: 3_600_000,
  defaultMs: 30_000,
});

export type SiteBuilderResponse = {
  status: number;
  body: any;
};

export type Transport = (req: {
  url: URL;
  method: string;
  headers: Record<string, string>;
  body: string;
  timeoutMs: number;
}) => Promise<SiteBuilderResponse>;

export class SiteBuilderClientError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

/** Strängen som signeras, utan bodyn. */
export function canonicalString(method: string, path: string, timestamp: string, nonce: string): string {
  return `v1\n${method.toUpperCase()}\n${path}\n${timestamp}\n${nonce}\n`;
}

/** HMAC-SHA256 i hex över kanonisk sträng + rå body. */
export function signRequest(opts: { secret: string; method: string; path: string; timestamp: string; nonce: string; body: string }): string {
  return crypto
    .createHmac('sha256', opts.secret)
    .update(canonicalString(opts.method, opts.path, opts.timestamp, opts.nonce))
    .update(opts.body, 'utf8')
    .digest('hex');
}

export function newNonce(): string {
  return crypto.randomBytes(16).toString('base64url');
}

/** node:http/https med uttryckliga tidsgränser. Svaret tolkas som JSON. */
export const nodeTransport: Transport = ({ url, method, headers, body, timeoutMs }) =>
  new Promise((resolve, reject) => {
    const lib = url.protocol === 'https:' ? https : http;
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      fn();
    };
    const req = lib.request(
      url,
      { method, headers: { ...headers, 'Content-Length': String(Buffer.byteLength(body)) }, timeout: timeoutMs },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let parsed: any = null;
          try {
            parsed = text ? JSON.parse(text) : null;
          } catch {
            parsed = null;
          }
          finish(() => resolve({ status: res.statusCode || 0, body: parsed }));
        });
        res.on('error', (err) => finish(() => reject(new SiteBuilderClientError('NETWORK', err.message))));
      }
    );
    // Total tidsgräns för hela anropet, utöver socketens tomgångstid.
    const deadline = setTimeout(() => {
      req.destroy();
      finish(() => reject(new SiteBuilderClientError('TIMEOUT', 'Tidsgränsen för anropet passerades.')));
    }, timeoutMs);
    req.on('timeout', () => {
      req.destroy();
      finish(() => reject(new SiteBuilderClientError('TIMEOUT', 'Ingen aktivitet inom tidsgränsen.')));
    });
    req.on('error', (err) => finish(() => reject(new SiteBuilderClientError('NETWORK', err.message))));
    req.end(body);
  });

export type SiteBuilderClient = {
  call(method: 'GET' | 'POST' | 'PUT', path: string, payload?: Record<string, unknown> | null, opts?: { timeoutMs?: number }): Promise<SiteBuilderResponse>;
};

/**
 * @param baseUrl  kundportalens origin (SITE_BUILDER_API_URL), t.ex. https://portal.example.com
 * @param secret   SITE_BUILDER_HMAC_SECRET
 */
export function createSiteBuilderClient(opts: {
  baseUrl: string;
  secret: string;
  transport?: Transport;
  now?: () => number;
  nonce?: () => string;
}): SiteBuilderClient {
  const transport = opts.transport || nodeTransport;
  const now = opts.now || Date.now;
  const nonce = opts.nonce || newNonce;
  return {
    async call(method, path, payload = null, callOpts = {}) {
      if (!opts.baseUrl || !opts.secret) throw new SiteBuilderClientError('CONFIG_INVALID', 'Hemsidebyggaren är inte konfigurerad.');
      const url = new URL(path, opts.baseUrl);
      const body = payload ? JSON.stringify(payload) : '';
      const timestamp = String(Math.floor(now() / 1000));
      const n = nonce();
      const signature = signRequest({ secret: opts.secret, method, path: url.pathname + url.search, timestamp, nonce: n, body });
      return transport({
        url,
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Site-Builder-Timestamp': timestamp,
          'X-Site-Builder-Nonce': n,
          'X-Site-Builder-Signature': `v1=${signature}`,
        },
        body,
        timeoutMs: callOpts.timeoutMs || TIMEOUTS.defaultMs,
      });
    },
  };
}
