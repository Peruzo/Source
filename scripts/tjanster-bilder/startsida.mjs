// Start page (/), "Allt du behöver. En plattform." (components/sections/WhatWeDo.tsx).
//
//   node scripts/tjanster-bilder.mjs startsida public
//
// The originals are the 1920 × 1080 PNGs already in public/ (1,6–2,0 MB each), which every
// visitor used to download whatever the card size. The cards are 16:9 at every breakpoint,
// so the whole frame is written (no portrait crop) in three widths: 640 and 1024 for phones
// and the 480 px desktop card, 1536 for wide, dense screens.
const FULL = { left: 0, top: 0, width: 1920, height: 1080 };
const WIDTHS = [640, 1024, 1536];

export const entries = [
  { slot: 'hemsida', file: 'tillvarhemsida.png', extract: FULL, widths: WIDTHS },
  { slot: 'marknadsforing', file: 'marketingone.png', extract: FULL, widths: WIDTHS },
  { slot: 'logistik', file: 'logositske.png', extract: FULL, widths: WIDTHS },
  { slot: 'support', file: 'supportfordem.png', extract: FULL, widths: WIDTHS },
];

export const options = { outDir: 'public/startsida' };
