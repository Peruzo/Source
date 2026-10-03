// /tjanster/betalningar. Portrait crops are 3:4 at full height.
export const entries = [
  // A woman on a jetty smiling at her phone, boats in the background (betalningar-b,
  // hf_20261001_190737_d7743575). The original 2048 × 1152 shows a half-readable boat number
  // at the top right (x 1974–1997, y 80–93), so the source is a 16:9 crop of it without that
  // corner: x 0–1940, y 61–1152 (1940 × 1091), made with
  //   sharp('betalningar-b.png').extract({ left: 0, top: 61, width: 1940, height: 1091 })
  // and saved as betalningar-b-beskuren.png. Portrait x 640–1458 (818 px) keeps her face,
  // the phone and both hands.
  { slot: 'kort', file: 'betalningar-b-beskuren.png', portrait: { left: 640 } },
  // A man at a laptop on a cabin porch, the laptop seen strictly from the side (betalningar-a2,
  // hf_20261001_193926_df10e4e1, 2048 × 1152). It replaces betalningar-a, whose laptop lid shows
  // a logo by the hands. Portrait x 450–1314 keeps his face, both hands and the mug.
  { slot: 'fakturor', file: 'betalningar-a2.png', portrait: { left: 450 } },
];

export const options = { portraitAspect: 3 / 4 };
