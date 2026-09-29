// /privat-vaxande (Privat Växande). Portrait crops are 3:4 at full height (864 px wide).
export const entries = [
  // A woman at a parcel locker on the street with a package (variant A). Crop x 584–1448 keeps her
  // face, the package and her hand on the locker door; the back of her hat is cut.
  { slot: 'frakt', file: 'frakt-a.png', portrait: { left: 584 } },
  // A man unpacking a box on a stair landing by a window (variant A). Crop x 717–1581 keeps him,
  // his hands and the box.
  { slot: 'kunder', file: 'kunder-a.png', portrait: { left: 717 } },
  // The owner at the desk of a small studio, seen through a doorway (variant A). Crop x 880–1744
  // keeps her face, her hands and the phone.
  { slot: 'boka', file: 'boka-a.png', portrait: { left: 880 } },
];

export const options = { outDir: 'public/for-dig/privat-vaxande', portraitAspect: 3 / 4 };
