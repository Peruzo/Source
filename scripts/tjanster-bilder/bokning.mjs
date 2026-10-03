// /bokningssystem. Originals 2048 × 1152. Portrait crops are 3:4 at full height (864 px wide).
export const entries = [
  // A woman in a bright room with a tablet under her arm, setting a chair by the window
  // (bokning-a, hf_20261001_190737_adad658a). Crop x 760–1624 keeps her face, the tablet,
  // the hand on the chair and the chair.
  { slot: 'personal', file: 'bokning-a.png', portrait: { left: 760 } },
  // A woman under an umbrella on a leafy street, booking on her phone held in profile
  // (bokning-b2, hf_20261001_193926_9ccd5c9d). It replaces bokning-b, whose phone screen shows
  // half-readable text in the man's hand. Crop x 640–1504 keeps her face, the phone and both hands.
  { slot: 'tjanster', file: 'bokning-b2.png', portrait: { left: 640 } },
];

export const options = { portraitAspect: 3 / 4 };
