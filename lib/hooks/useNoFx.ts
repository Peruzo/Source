'use client';

// TEMP: flicker bisect, remove after diagnosis
//
// Reads ?nofx=hero,noise,header,blur,progress,fade,glow from the URL after mount
// and returns one boolean per effect. Without the parameter every flag is false
// and no production code path changes. Read via window.location in an effect
// (not next/navigation useSearchParams) so statically prerendered pages need no
// Suspense boundary and SSR/hydration output stays identical to production.

import { useEffect, useState } from 'react';

export type NoFxFlags = {
  hero: boolean;
  noise: boolean;
  header: boolean;
  blur: boolean;
  progress: boolean;
  fade: boolean;
  glow: boolean;
};

const ALL_ON: NoFxFlags = {
  hero: false,
  noise: false,
  header: false,
  blur: false,
  progress: false,
  fade: false,
  glow: false,
};

export function useNoFx(): NoFxFlags {
  const [flags, setFlags] = useState<NoFxFlags>(ALL_ON);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('nofx');
    if (!raw) return;

    const off = new Set(
      raw
        .split(',')
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean)
    );
    if (off.size === 0) return;

    setFlags({
      hero: off.has('hero'),
      noise: off.has('noise'),
      header: off.has('header'),
      blur: off.has('blur'),
      progress: off.has('progress'),
      fade: off.has('fade'),
      glow: off.has('glow'),
    });
  }, []);

  return flags;
}
