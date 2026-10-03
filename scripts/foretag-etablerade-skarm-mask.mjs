// Mask för surfplattans skärm i foretag-etablerade-marknad-studio (ipad-0.png).
//
//   node scripts/foretag-etablerade-skarm-mask.mjs <mapp med original>
//   node scripts/foretag-etablerade-skarm-mask.mjs _research/originals/design-omg2
//
// Skärmytan x 578–1465, y 207–861 ur originalet (samma yta som STUDIO_SCREEN i
// lib/data/for-dig/foretag-etablerade.ts). Där fotot visar skärmens ljusa färg blir masken
// täckande, annars genomskinlig – så att UI:t på skärmen aldrig ritas över vänster tumme, som
// går in upp till 13 px på raderna 563–820, och följer skärmens rundade hörn. Kanten tonas över
// några färgsteg. Skrivs som en liten PNG med alfakanal, används som CSS-mask.
import sharp from 'sharp';

const SCREEN = { left: 578, top: 207, width: 888, height: 655 };
const SCREEN_COLOUR = [196, 196, 190];

const srcDir = process.argv[2];
if (!srcDir) {
  console.error('Användning: node scripts/foretag-etablerade-skarm-mask.mjs <mapp med original>');
  process.exit(1);
}
const out = 'public/for-dig/foretag-etablerade/foretag-etablerade-marknad-skarm-mask.png';
const { data, info } = await sharp(`${srcDir}/ipad-0.png`).extract(SCREEN).raw().toBuffer({ resolveWithObject: true });
const alpha = Buffer.alloc(info.width * info.height);
for (let i = 0; i < alpha.length; i++) {
  const o = i * info.channels;
  const d = Math.abs(data[o] - SCREEN_COLOUR[0]) + Math.abs(data[o + 1] - SCREEN_COLOUR[1]) + Math.abs(data[o + 2] - SCREEN_COLOUR[2]);
  // Helt täckande upp till 30, genomskinlig från 60.
  alpha[i] = Math.round(255 * Math.min(1, Math.max(0, (60 - d) / 30)));
}
await sharp(Buffer.alloc(info.width * info.height * 3, 0), { raw: { width: info.width, height: info.height, channels: 3 } })
  .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(out);
console.log(out);
