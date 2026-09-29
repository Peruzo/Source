// Product photos for the grid on /privat-start – see public/images/for-dig/privat/README.md.
//
//   node scripts/produktbilder.mjs
//
// Reads the PNG originals in assets/originals/for-dig/privat/produkter/, fades
// each photo's own (often uneven) background to #f1f1f1, crops a square around
// the product so its long side fills 80 % of the frame (padded with #f1f1f1),
// and writes 320 px WebP (q82) to public/images/for-dig/privat/produkter/.
// Sneakers also gets a 640 px version for the large sale card in section 6.
import sharp from 'sharp';
import { statSync } from 'node:fs';
const D = 'assets/originals/for-dig/privat/produkter/', OUT = 'public/images/for-dig/privat/produkter';
const T = [241, 241, 241];                     // target background #f1f1f1
const FILL = 0.80;                             // product's long side = 80 % of the square
const SIZES = (name) => name === 'sneakers' ? [320, 640] : [320];
// Originals are named like the output (= the product ids in product-widgets/content.ts).
const NAMES = ['loparsko', 'tygsko', 'kanga', 'huvtroja', 't-shirt', 'jeans', 'sandal', 'loafers', 'vindjacka', 'stickad-troja', 'chinos', 'mossa', 'sneakers', 'skjorta', 'tofflor', 'kappa'];
// Edge fill (step 2b) – only for the originals listed here. Where the product
// reaches the frame the fade in step 2 leaves the background a few values off
// T (jeans: the top corners came out ~244 instead of 241, a 1.5 % light band).
// Every pixel connected to the frame that is already within ±EDGE_TOL of T is
// set to exactly T; pixels further off (the product, its shadow) are never
// touched. Listed explicitly so the other outputs stay byte-identical.
const EDGE_FILL = new Set(['jeans']);
const EDGE_TOL = 6;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const report = [];
for (const name of NAMES) {
  const path = D + name + '.png';
  const { data, info } = await sharp(path).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, c = info.channels;
  // 1. Coarse grid (32x32 px cells) → background field with the product masked out and filled by diffusion.
  const CS = 32, GW = Math.ceil(W / CS), GH = Math.ceil(H / CS), cell = new Float64Array(GW * GH * 3);
  for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) { const s = [0, 0, 0]; let n = 0;
    for (let y = gy * CS; y < Math.min(H, gy * CS + CS); y += 2) for (let x = gx * CS; x < Math.min(W, gx * CS + CS); x += 2) { const i = (y * W + x) * c; s[0] += data[i]; s[1] += data[i + 1]; s[2] += data[i + 2]; n++; }
    for (let k = 0; k < 3; k++) cell[(gy * GW + gx) * 3 + k] = s[k] / n; }
  const cornerIdx = [0, GW - 1, (GH - 1) * GW, GH * GW - 1];
  const C0 = [0, 1, 2].map(k => cornerIdx.map(i => cell[i * 3 + k]).sort((a, b) => a - b)[1]);
  let known = new Uint8Array(GW * GH);
  for (let i = 0; i < GW * GH; i++) known[i] = (Math.abs(cell[i * 3] - C0[0]) + Math.abs(cell[i * 3 + 1] - C0[1]) + Math.abs(cell[i * 3 + 2] - C0[2])) < 18 ? 1 : 0;
  for (let r = 0; r < 2; r++) { const k2 = known.slice(); for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) if (!known[gy * GW + gx]) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = gx + dx, Y = gy + dy; if (X >= 0 && Y >= 0 && X < GW && Y < GH) k2[Y * GW + X] = 0; } known = k2; }
  const field = cell.slice();
  for (let i = 0; i < GW * GH; i++) if (!known[i]) for (let k = 0; k < 3; k++) field[i * 3 + k] = C0[k];
  for (let it = 0; it < 400; it++) for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) { const i = gy * GW + gx; if (known[i]) continue; const s = [0, 0, 0]; let n = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = gx + dx, Y = gy + dy; if (X >= 0 && Y >= 0 && X < GW && Y < GH) { const j = Y * GW + X; for (let k = 0; k < 3; k++) s[k] += field[j * 3 + k]; n++; } }
    for (let k = 0; k < 3; k++) field[i * 3 + k] = s[k] / n; }
  // Upscale the field to full resolution (smooth, bilinear via sharp).
  const fieldImg = await sharp(Buffer.from(Uint8Array.from(field, v => Math.round(v))), { raw: { width: GW, height: GH, channels: 3 } }).blur(1.2).resize(W, H, { kernel: 'cubic' }).raw().toBuffer();
  // 2. Fade each pixel's own background toward T: weight by distance from the local background.
  const out = Buffer.alloc(W * H * 3); let x0 = W, y0 = H, x1 = -1, y1 = -1; let resid = 0, borderDev = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * c, o = (y * W + x) * 3, B = [fieldImg[o], fieldImg[o + 1], fieldImg[o + 2]];
    const d = Math.abs(data[i] - B[0]) + Math.abs(data[i + 1] - B[1]) + Math.abs(data[i + 2] - B[2]);
    const w = 1 - smooth(10, 45, d);
    for (let k = 0; k < 3; k++) out[o + k] = Math.max(0, Math.min(255, Math.round(data[i + k] * (1 + w * (T[k] / Math.max(1, B[k]) - 1)))));
    const dt = Math.abs(out[o] - T[0]) + Math.abs(out[o + 1] - T[1]) + Math.abs(out[o + 2] - T[2]);
    if (dt > 36) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (w > 0.95) resid = Math.max(resid, Math.max(Math.abs(out[o] - T[0]), Math.abs(out[o + 1] - T[1]), Math.abs(out[o + 2] - T[2])));
    if ((x < 2 || y < 2 || x >= W - 2 || y >= H - 2) && w > 0.5) borderDev = Math.max(borderDev, Math.max(Math.abs(out[o] - T[0]), Math.abs(out[o + 1] - T[1]), Math.abs(out[o + 2] - T[2]))); }
  // 2b. Edge fill (see EDGE_FILL): flood fill from the frame, 4-connected, over
  // pixels within ±EDGE_TOL of T per channel; those are snapped to exactly T.
  // Cannot move the product box: a pixel within ±EDGE_TOL has dt <= 18 < 36.
  let edgeFilled = 0;
  if (EDGE_FILL.has(name)) {
    const near = (o) => Math.abs(out[o] - T[0]) <= EDGE_TOL && Math.abs(out[o + 1] - T[1]) <= EDGE_TOL && Math.abs(out[o + 2] - T[2]) <= EDGE_TOL;
    const seen = new Uint8Array(W * H), stack = [];
    for (let x = 0; x < W; x++) stack.push(x, W * (H - 1) + x);
    for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
    while (stack.length) { const p = stack.pop(); if (seen[p]) continue; seen[p] = 1; const o = p * 3; if (!near(o)) continue;
      if (out[o] !== T[0] || out[o + 1] !== T[1] || out[o + 2] !== T[2]) { edgeFilled++; out[o] = T[0]; out[o + 1] = T[1]; out[o + 2] = T[2]; }
      const x = p % W, y = (p - x) / W; if (x > 0) stack.push(p - 1); if (x < W - 1) stack.push(p + 1); if (y > 0) stack.push(p - W); if (y < H - 1) stack.push(p + W); }
  }
  // 3. Square around the product box, equal long-side fill, padded with T.
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1, side = Math.round(Math.max(bw, bh) / FILL), cx = x0 + bw / 2, cy = y0 + bh / 2;
  const left = Math.round(cx - side / 2), top = Math.round(cy - side / 2);
  const pad = { left: Math.max(0, -left), top: Math.max(0, -top), right: Math.max(0, left + side - W), bottom: Math.max(0, top + side - H) };
  const extended = await sharp(out, { raw: { width: W, height: H, channels: 3 } }).extend({ ...pad, background: { r: T[0], g: T[1], b: T[2] } }).raw().toBuffer({ resolveWithObject: true });
  const squared = await sharp(extended.data, { raw: { width: extended.info.width, height: extended.info.height, channels: 3 } })
    .extract({ left: left + pad.left, top: top + pad.top, width: side, height: side }).raw().toBuffer();
  const sizes = {};
  for (const s of SIZES(name)) { const file = `${OUT}/${name}${s === 320 ? '' : '-' + s}.webp`;
    const info2 = await sharp(squared, { raw: { width: side, height: side, channels: 3 } }).resize(s, s, { kernel: 'lanczos3' }).webp({ quality: 82 }).toFile(file); sizes[s] = info2.size; }
  report.push({ name, pngKB: Math.round(statSync(path).size / 1024), webp320KB: +(sizes[320] / 1024).toFixed(1), webp640KB: sizes[640] ? +(sizes[640] / 1024).toFixed(1) : '', bgBefore: '#' + C0.map(v => Math.round(v).toString(16).padStart(2, '0')).join(''), residualBg: resid, edgeSeam: borderDev, edgeFilled, boxInSquare: `${Math.round(100 * bw / side)}×${Math.round(100 * bh / side)}%` });
}
console.table(report);
