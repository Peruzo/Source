// /foretag-vaxande (Företag Växa). Portrait crops are 3:4 at full height (864 px wide).
export const entries = [
  // Open garage door with a cart of boxes (variant A). Crop x 640–1504 keeps the whole doorway:
  // the woman with the tablet, the man with the cart and the van.
  { slot: 'frakt', file: 'frakt-A.png', portrait: { left: 640 } },
  // Driver seen through the side window (variant D). Crop x 600–1464 keeps the phone holder,
  // the hand with the phone and his face.
  { slot: 'bokforing', file: 'bokforing-D.png', portrait: { left: 600 } },
  // Woman at a kitchen island with a tablet (variant A). Crop x 490–1354 keeps the tablet,
  // her finger on it and her face.
  { slot: 'insikter', file: 'insikter-A.png', portrait: { left: 490 } },
];

export const options = { outDir: 'public/for-dig/foretag-vaxa', portraitAspect: 3 / 4 };
