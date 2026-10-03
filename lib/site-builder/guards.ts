/**
 * Skydd runt hemsidebyggarens serverroutes, utan beroenden:
 *
 *   createGenerationLock  en generering per utkast åt gången. En andra start medan en pågår
 *                         avvisas INNAN kundportalen anropas, så taket debiteras aldrig för den.
 *                         Lås i minnet räcker för en instans; med en LockStore (GCS, se
 *                         lib/site-builder/gcs-lock-store.ts) gäller låset mellan instanser.
 *   createRateLimiter     fönsterbaserad gräns per nyckel (sessionens användare) i minnet.
 */

export type LockStore = {
  /** true om låset togs, false om det redan finns ett aktivt lås. */
  acquire(key: string, nowMs: number, staleAfterMs: number): Promise<boolean>;
  release(key: string): Promise<void>;
  isHeld(key: string, nowMs: number, staleAfterMs: number): Promise<boolean>;
};

/** Ett lås som inte släppts efter så här lång tid räknas som övergivet (instansen dog). */
export const LOCK_STALE_MS = 3_700_000;

export function memoryLockStore(): LockStore {
  const held = new Map<string, number>();
  const active = (key: string, nowMs: number, staleAfterMs: number) => {
    const at = held.get(key);
    return at !== undefined && nowMs - at < staleAfterMs;
  };
  return {
    async acquire(key, nowMs, staleAfterMs) {
      if (active(key, nowMs, staleAfterMs)) return false;
      held.set(key, nowMs);
      return true;
    },
    async release(key) {
      held.delete(key);
    },
    async isHeld(key, nowMs, staleAfterMs) {
      return active(key, nowMs, staleAfterMs);
    },
  };
}

export function createGenerationLock(opts: { store?: LockStore; now?: () => number; staleAfterMs?: number } = {}) {
  const store = opts.store || memoryLockStore();
  const now = opts.now || Date.now;
  const stale = opts.staleAfterMs || LOCK_STALE_MS;
  return {
    acquire: (onboardingId: string) => store.acquire(onboardingId, now(), stale),
    release: (onboardingId: string) => store.release(onboardingId),
    isHeld: (onboardingId: string) => store.isHeld(onboardingId, now(), stale),
  };
}

export type GenerationLock = ReturnType<typeof createGenerationLock>;

export function createRateLimiter(opts: { limit: number; windowMs: number; now?: () => number }) {
  const now = opts.now || Date.now;
  const hits = new Map<string, number[]>();
  return {
    /** true om anropet får göras (och räknas), false om gränsen är nådd. */
    take(key: string): boolean {
      const t = now();
      const recent = (hits.get(key) || []).filter((at) => t - at < opts.windowMs);
      if (recent.length >= opts.limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(t);
      hits.set(key, recent);
      return true;
    },
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;
