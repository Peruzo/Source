// /integrationer. Two photos, both approved with conditions (CC-RAPPORT-integrationer-media-2.md
// punkt 2–3); the other candidates had text, a logo or made-up lettering, so I1 and I5 keep
// their widgets.
export const entries = [
  // I4 – two colleagues going through papers at a table (P4), as it is. The box labels on the
  // shelf behind are blank at display size. Portrait keeps both faces and the papers.
  { slot: 'faktura', file: 'P4.png', portrait: { left: 600 } },
  // I8 – a potter fixing a handle to a cup (P2). Fixed crop x 300–2048, y 0–960: the two tools
  // with printed labels in the bottom-left corner (x 0–245, y 993–1152) are left out.
  { slot: 'avslut', file: 'P2.png', extract: { left: 300, top: 0, width: 1748, height: 960 }, widths: [640, 1024, 1536] },
];
