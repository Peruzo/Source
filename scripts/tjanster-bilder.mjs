// Photos for the service pages (/tjanster/*) – WebP in pre-generated widths.
//
//   node scripts/tjanster-bilder.mjs <tjänst> <mapp med original>
//   node scripts/tjanster-bilder.mjs inventarier _research/originals
//
// next.config has images.unoptimized, so next/image never resizes or converts.
// Every width a component asks for (ServicePicture) has to exist on disk, and
// the widths below must match SERVICE_IMAGE_WIDTHS in
// components/sections/tjanster/ServicePicture.tsx.
//
// Per image, three kinds of output, all to public/tjanster/<tjänst>/:
//   <tjänst>-<plats>-<w>.webp            landscape (the original frame, 16:9)
//   <tjänst>-<plats>-portrait-<w>.webp   portrait crop 4:5 for small screens
//   <tjänst>-<plats>-<w>.webp            OR, with `extract`, a fixed crop of the
//                                        original used at every breakpoint
// Widths are never larger than the source region – no upscaling.
//
// Originals are not committed. Add a service by adding an entry to SERVICES.
import sharp from 'sharp';
import { mkdirSync, statSync } from 'node:fs';

const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720, 920];
const WEBP = { quality: 78, effort: 6, smartSubsample: true };

/**
 * Coordinates are in pixels of the original (all originals are 2048x1152).
 * `portrait`: left edge of a 4:5 crop at full height (width = 0.8 x height).
 * `extract`: a fixed region; only this region is written, in `widths`.
 */
const SERVICES = {
  inventarier: [
    // A1 – hero. Portrait centred on the person (x 1100–1734).
    { slot: 'hero', file: 'A1.png', portrait: { left: 956 } },
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
  ],
};

const [service, srcDir] = process.argv.slice(2);
const entries = SERVICES[service];
if (!entries || !srcDir) {
  console.error(`Användning: node scripts/tjanster-bilder.mjs <${Object.keys(SERVICES).join('|')}> <mapp med original>`);
  process.exit(1);
}

const outDir = `public/tjanster/${service}`;
mkdirSync(outDir, { recursive: true });
const written = [];

const write = async (input, region, width, name) => {
  const path = `${outDir}/${name}`;
  await sharp(input).extract(region).resize({ width }).webp(WEBP).toFile(path);
  written.push(`${path}  ${Math.round(statSync(path).size / 1024)} kB`);
};

for (const entry of entries) {
  const input = `${srcDir}/${entry.file}`;
  const { width: W, height: H } = await sharp(input).metadata();
  const base = `${service}-${entry.slot}`;

  if (entry.extract) {
    for (const w of entry.widths.filter((w) => w <= entry.extract.width)) {
      await write(input, entry.extract, w, `${base}-${w}.webp`);
    }
    continue;
  }

  const full = { left: 0, top: 0, width: W, height: H };
  for (const w of LANDSCAPE.filter((w) => w <= W)) await write(input, full, w, `${base}-${w}.webp`);

  const pw = Math.round(H * 0.8);
  const left = Math.min(Math.max(0, entry.portrait.left), W - pw);
  const portrait = { left, top: 0, width: pw, height: H };
  for (const w of PORTRAIT.filter((w) => w <= pw)) await write(input, portrait, w, `${base}-portrait-${w}.webp`);
}

console.log(written.join('\n'));
