// /foretag-etablerad (Företag Etablerade). Portrait crops are 3:4 at full height (864 px wide).
export const entries = [
  // Black chrome arches rising left to right (x 14–88 %). Crop x 635–1499 keeps the middle
  // of the form; the empty black upper left carries the text from lg.
  { slot: 'statistik', file: 'statistik-A.png', portrait: { left: 635 } },
  // Hands holding a tablet with a black screen, straight from above. The glass runs x 600–1430,
  // so crop x 583–1447 keeps the whole tablet, the screen area and the thumbs.
  { slot: 'studio', file: 'studio-A.png', portrait: { left: 583 } },
  // A person with a phone in a concrete hall (x 56–71 %). Crop x 870–1734 keeps her whole.
  { slot: 'support', file: 'support-A.png', portrait: { left: 870 } },
];

export const options = { outDir: 'public/for-dig/foretag-etablerade', portraitAspect: 3 / 4 };
