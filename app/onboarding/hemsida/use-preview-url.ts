'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type ApiError } from './api';

// Tokenen gäller i 15 minuter; den förnyas två minuter innan.
const RENEW_BEFORE_MS = 2 * 60_000;

/**
 * Förhandsvisningens adress med token från kundportalen. Tokenen är bunden till utkastets
 * version, så en ny hämtas när versionen ändras och automatiskt innan den går ut. Används av
 * både helskärmsvyn och redigeringsvyn.
 */
export function usePreviewUrl(onboardingId: string, version: number) {
  const [baseUrl, setBaseUrl] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    const res = await api<{ url: string; expiresAt: string; version: number }>('/preview-token', 'POST', { onboardingId });
    if (!res.ok) { setError(res); return; }
    setError(null);
    setBaseUrl(res.url);
    if (timer.current) clearTimeout(timer.current);
    const wait = Math.max(30_000, Date.parse(res.expiresAt) - Date.now() - RENEW_BEFORE_MS);
    timer.current = setTimeout(load, wait);
  }, [onboardingId]);

  useEffect(() => { load(); }, [load, version]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { baseUrl, error };
}

/** Adressen till en viss sida; startsidan har ingen page-parameter. */
export function pageUrl(baseUrl: string, page: { slug: string; isHome: boolean } | undefined): string {
  if (!baseUrl) return '';
  return page && !page.isHome ? `${baseUrl}&page=${encodeURIComponent(page.slug)}` : baseUrl;
}
