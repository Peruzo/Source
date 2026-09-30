// /ai-assistent. Originals 2048 × 1152. Portrait crops are 3:4 at full height (864 px wide).
export const entries = [
  // A woman on a window seat in the evening with her phone, a cup beside her feet (variant A).
  // Crop x 700–1564 keeps the cup, her face, her hands and the phone. The cup's rim has tiny
  // half-readable print; the section's UI card lies over it (see lib/data/tjanster/ai-assistent.ts).
  { slot: 'sourceai', file: 'sourceai-a.png', portrait: { left: 700 } },
  // A woman on a balcony with a tablet and a cup, rooftops behind her (variant A). Crop x 700–1564
  // keeps her face, the cup, the tablet and both hands.
  { slot: 'insikter', file: 'insikter-a.png', portrait: { left: 700 } },
  // A man on a park bench on the phone, a closed notebook on his knee (variant B – variant A shows
  // a phone logo by the face). Crop x 420–1284 keeps his head and the phone hand, with his back on
  // the left where the card lies on phones; the hand he gestures with is at the right edge.
  { slot: 'leads', file: 'leads-b.png', portrait: { left: 420 } },
];

export const options = { portraitAspect: 3 / 4 };
