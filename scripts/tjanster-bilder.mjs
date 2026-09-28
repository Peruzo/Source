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
// A set that lives outside /tjanster (e.g. the För dig pages) or needs another
// portrait shape gets an entry in OPTIONS – everything else keeps the defaults.
import sharp from 'sharp';
import { mkdirSync, statSync } from 'node:fs';

const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720, 920];
const WEBP = { quality: 78, effort: 6, smartSubsample: true };

/**
 * Coordinates are in pixels of the original (all originals are 2048x1152).
 * `portrait`: left edge of a portrait crop at full height – 4:5 (width = 0.8 x
 * height) unless OPTIONS sets another `portraitAspect`.
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
  // /foretag-nya (Företag Start). Portrait crops are 3:4 at full height (864 px wide).
  'foretag-start': [
    // Man in an armchair with his phone. Crop x 650–1514 keeps his face, the phone and his hands.
    { slot: 'betalningslank', file: 'betalningslank.png', portrait: { left: 650 } },
    // Woman at the kitchen table with her phone (variant A). Crop x 1000–1864 keeps her and the phone.
    { slot: 'myndighetsdatum', file: 'myndighetsdatum-A.png', portrait: { left: 1000 } },
  ],
  analys: [
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
  ],
  // /foretag-vaxande (Företag Växa). Portrait crops are 3:4 at full height (864 px wide).
  'foretag-vaxa': [
    // Open garage door with a cart of boxes (variant A). Crop x 640–1504 keeps the whole doorway:
    // the woman with the tablet, the man with the cart and the van.
    { slot: 'frakt', file: 'frakt-A.png', portrait: { left: 640 } },
    // Driver seen through the side window (variant D). Crop x 600–1464 keeps the phone holder,
    // the hand with the phone and his face.
    { slot: 'bokforing', file: 'bokforing-D.png', portrait: { left: 600 } },
    // Woman at a kitchen island with a tablet (variant A). Crop x 490–1354 keeps the tablet,
    // her finger on it and her face.
    { slot: 'insikter', file: 'insikter-A.png', portrait: { left: 490 } },
  ],
  // /foretag-etablerad (Företag Etablerade). Portrait crops are 3:4 at full height (864 px wide).
  'foretag-etablerade': [
    // Black chrome arches rising left to right (x 14–88 %). Crop x 635–1499 keeps the middle
    // of the form; the empty black upper left carries the text from lg.
    { slot: 'statistik', file: 'statistik-A.png', portrait: { left: 635 } },
    // Hands holding a tablet with a black screen, straight from above. The glass runs x 600–1430,
    // so crop x 583–1447 keeps the whole tablet, the screen area and the thumbs.
    { slot: 'studio', file: 'studio-A.png', portrait: { left: 583 } },
    // A person with a phone in a concrete hall (x 56–71 %). Crop x 870–1734 keeps her whole.
    { slot: 'support', file: 'support-A.png', portrait: { left: 870 } },
  ],
};

/**
 * Per-service overrides. `outDir`: where the files go (default public/tjanster/<tjänst>).
 * `portraitAspect`: portrait width ÷ height (default 0.8, i.e. 4:5).
 */
const OPTIONS = {
  'foretag-start': { outDir: 'public/for-dig/foretag-start', portraitAspect: 3 / 4 },
  'foretag-vaxa': { outDir: 'public/for-dig/foretag-vaxa', portraitAspect: 3 / 4 },
  'foretag-etablerade': { outDir: 'public/for-dig/foretag-etablerade', portraitAspect: 3 / 4 },
};

const [service, srcDir] = process.argv.slice(2);
const entries = SERVICES[service];
if (!entries || !srcDir) {
  console.error(`Användning: node scripts/tjanster-bilder.mjs <${Object.keys(SERVICES).join('|')}> <mapp med original>`);
  process.exit(1);
}

const options = OPTIONS[service] ?? {};
const outDir = options.outDir ?? `public/tjanster/${service}`;
const portraitAspect = options.portraitAspect ?? 0.8;
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

  const pw = Math.round(H * portraitAspect);
  const left = Math.min(Math.max(0, entry.portrait.left), W - pw);
  const portrait = { left, top: 0, width: pw, height: H };
  for (const w of PORTRAIT.filter((w) => w <= pw)) await write(input, portrait, w, `${base}-portrait-${w}.webp`);
}

console.log(written.join('\n'));
