// /privat-etablerad (Privat Etablerade). Portrait crops are 3:4 at full height (864 px wide).
export const entries = [
  // Two women at a kitchen table with a tablet, empty table top in the foreground. Crop x 696–1560
  // keeps both faces, the tablet, their hands and the table in front.
  { slot: 'studio', file: 'studio.png', portrait: { left: 696 } },
  // A woman on a sofa with a laptop, bookshelf and plants behind. Crop x 819–1683 keeps her face,
  // hands and the laptop, and leaves out the bookshelf and the red print on the cushion.
  { slot: 'inkorg', file: 'inkorg.png', portrait: { left: 819 } },
  // A man at the kitchen counter in the evening with his phone. Crop x 737–1601 keeps his face,
  // both hands and the phone, and leaves out the bottle and most of the writing on the fridge.
  { slot: 'hjalp', file: 'hjalp.png', portrait: { left: 737 } },
];

export const options = { outDir: 'public/for-dig/privat-etablerade', portraitAspect: 3 / 4 };
