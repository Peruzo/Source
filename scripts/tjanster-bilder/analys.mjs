export const entries = [
  // F1 – hands with a phone (screen off) on marble. Phone x 33–56 %, y 10–60 %; the
  // comparison card floats over it, the text sits on the quiet right half.
  { slot: 'period', file: 'F1.png', portrait: { left: 461 } },
  // R8 – tablet on a lap in window light (reflection of sky, no content). Replaces F2,
  // whose phone screen showed UI glyphs. Portrait centred on the tablet.
  { slot: 'nyckeltal', file: 'R8.png', portrait: { left: 560 } },
  // F3 – laptop on black, screen off (x 20–82 %, y 5–78 %). Shown whole (contain) with
  // the top-pages card over the screen, so one landscape set is enough. The keyboard
  // legends are too small and soft to read.
  { slot: 'sidor', file: 'F3.png', extract: { left: 0, top: 0, width: 2048, height: 1152 }, widths: [640, 1024, 1536, 2048] },
  // R4 – desk with a blank notebook, pen, glasses and a glass of water. Replaces F4,
  // whose phone screen was on. The insight card sits on the notebook (x 40 %, y 58 %).
  { slot: 'insikter', file: 'R4.png', portrait: { left: 358 } },
  // F5 – person in a coat holding a tablet. The paper cup in the right hand has printed
  // text (x 77–87 %); this crop ends at x 1520, so the cup is not in the file.
  { slot: 'rapporter', file: 'F5.png', extract: { left: 420, top: 0, width: 1100, height: 1152 }, widths: [640, 1024, 1100] },
];
