// /bokforing. Originals are 2816x1584 (16:9), portrait crops 4:5 at full height (1267 px wide).
export const entries = [
  // E1 – a man rubbing his eyes at a desk (x 800–1730). Portrait centred on him.
  { slot: 'kvall', file: 'E1.png', portrait: { left: 637 } },
  // E2 – a man on the sofa with his phone, a dog asleep beside him (man x 1045–2010).
  // Portrait centred on the man.
  { slot: 'lattnad', file: 'E2.png', portrait: { left: 767 } },
  // E3 – two people laughing at a table with a cinnamon bun. Crop x 420–2080 leaves out a
  // radiator valve fitting (x 230–410) and a jacket's neck label (x 2080–2300), both with
  // marks too small to read. Nearly square, for the closing split at every breakpoint.
  { slot: 'avslut', file: 'E3.png', extract: { left: 420, top: 0, width: 1660, height: 1584 }, widths: [640, 1024, 1536] },
  // J2r – a family around a block tower, seen from above (edited: no print on clothes or blocks).
  // Portrait keeps the man's face and hand on the tower (tower x 925–1428) and the boy in blue behind it.
  { slot: 'familj', file: 'J2r.png', portrait: { left: 400 } },
];
