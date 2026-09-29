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
// Originals are not committed.
//
// Add a page by adding one file, scripts/tjanster-bilder/<sida>.mjs – nothing in
// this script needs editing. The file name is the page's name on the command line.
// It exports `entries` (the images, see below) and, only when the page needs it,
// `options` ({ outDir, portraitAspect }): a set that lives outside /tjanster
// (e.g. the För dig pages) or needs another portrait shape. Every page has its own
// file so that parallel branches never edit the same lines.
import sharp from 'sharp';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720, 920];
const WEBP = { quality: 78, effort: 6, smartSubsample: true };

/**
 * Each page file exports `entries`. Coordinates are in pixels of the original
 * (most originals are 2048x1152; a page's file says when it differs).
 * `portrait`: left edge of a portrait crop at full height – 4:5 (width = 0.8 x
 * height) unless the page's `options` set another `portraitAspect`.
 * `extract`: a fixed region; only this region is written, in `widths`.
 *
 * `options` (optional): `outDir`, where the files go (default public/tjanster/<sida>),
 * and `portraitAspect`, portrait width ÷ height (default 0.8, i.e. 4:5).
 *
 * The pages are read in alphabetical order, so the list is the same everywhere.
 */
const CONFIG_DIR = new URL('./tjanster-bilder/', import.meta.url);
const SERVICES = {};
const OPTIONS = {};
for (const file of readdirSync(fileURLToPath(CONFIG_DIR)).filter((f) => f.endsWith('.mjs')).sort()) {
  const name = file.slice(0, -'.mjs'.length);
  const page = await import(new URL(file, CONFIG_DIR));
  SERVICES[name] = page.entries;
  if (page.options) OPTIONS[name] = page.options;
}

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
