export const entries = [
  // B2 – sticky steps. Portrait around the box and the phone (x 650–1180).
  { slot: 'skanna', file: 'B2.png', portrait: { left: 540 } },
  // C2 – recommended purchases. Portrait keeps the woman with the tablet and
  // the man on the stool; the dark top stays free for the text.
  { slot: 'inkop', file: 'C2.png', portrait: { left: 660 } },
  // D3 – split close-up (D1 was rejected: its shelf label with nonsense text could not
  // be cropped out without losing the composition). The only white label in D3 with
  // marks on it sits at x 440–612; cropping from x 620 takes it out of the file, so no
  // object-position can bring it back. The remaining white patches are blank paper.
  // One set for every breakpoint (5:4-ish), the component picks the focus.
  { slot: 'narbild', file: 'D3.png', extract: { left: 620, top: 0, width: 1428, height: 1152 }, widths: [640, 1024, 1428] },
];
