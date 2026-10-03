import { Storage } from '@google-cloud/storage';
import type { LockStore } from './guards';

/**
 * Genereringslås i GCS, så att "en generering per utkast" gäller även när hemsidan körs på
 * flera Cloud Run-instanser. Låset är ett objekt site-builder/locks/<onboardingId>.json som
 * skapas med villkoret ifGenerationMatch: 0: bara ett anrop kan skapa det. Objektet innehåller
 * bara starttiden. Ett lås äldre än staleAfterMs räknas som övergivet och tas över.
 */
export function gcsLockStore(bucketName: string, projectId?: string): LockStore {
  const storage = new Storage(projectId ? { projectId } : undefined);
  const bucket = storage.bucket(bucketName);
  const fileFor = (key: string) => bucket.file(`site-builder/locks/${key}.json`);

  async function startedAt(key: string): Promise<{ at: number; generation: string } | null> {
    try {
      const [meta] = await fileFor(key).getMetadata();
      const at = Date.parse(String(meta.metadata?.startedAt || meta.timeCreated || ''));
      return { at: Number.isFinite(at) ? at : 0, generation: String(meta.generation) };
    } catch (err: any) {
      if (err && err.code === 404) return null;
      throw err;
    }
  }

  async function create(key: string, nowMs: number): Promise<boolean> {
    try {
      await fileFor(key).save(JSON.stringify({ startedAt: new Date(nowMs).toISOString() }), {
        contentType: 'application/json',
        metadata: { metadata: { startedAt: new Date(nowMs).toISOString() } },
        preconditionOpts: { ifGenerationMatch: 0 },
        resumable: false,
      });
      return true;
    } catch (err: any) {
      if (err && err.code === 412) return false;
      throw err;
    }
  }

  return {
    async acquire(key, nowMs, staleAfterMs) {
      if (await create(key, nowMs)) return true;
      const current = await startedAt(key);
      if (current && nowMs - current.at < staleAfterMs) return false;
      // Övergivet lås: ta bort just den versionen och försök en gång till.
      if (current) {
        try {
          await fileFor(key).delete({ ifGenerationMatch: Number(current.generation) });
        } catch (err: any) {
          if (!(err && (err.code === 404 || err.code === 412))) throw err;
        }
      }
      return create(key, nowMs);
    },
    async release(key) {
      try {
        await fileFor(key).delete();
      } catch (err: any) {
        if (!(err && err.code === 404)) throw err;
      }
    },
    async isHeld(key, nowMs, staleAfterMs) {
      const current = await startedAt(key);
      return Boolean(current && nowMs - current.at < staleAfterMs);
    },
  };
}
