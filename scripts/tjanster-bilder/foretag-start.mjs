// /foretag-nya (Företag Start). Portrait crops are 3:4 at full height (864 px wide).
export const entries = [
  // Man in an armchair with his phone. Crop x 650–1514 keeps his face, the phone and his hands.
  { slot: 'betalningslank', file: 'betalningslank.png', portrait: { left: 650 } },
  // Woman at the kitchen table with her phone (variant A). Crop x 1000–1864 keeps her and the phone.
  { slot: 'myndighetsdatum', file: 'myndighetsdatum-A.png', portrait: { left: 1000 } },
];

export const options = { outDir: 'public/for-dig/foretag-start', portraitAspect: 3 / 4 };
