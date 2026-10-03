// /foretag-etablerad, marknadsföringssektionen: händer som håller en surfplatta med blank, ljus
// skärm mot mörk sten (ipad-0, hf_20261003_131012_897beee1). Original 2048 × 1152.
//
// Egen sidfil så att sidans övriga bilder (foretag-etablerade.mjs) inte genereras om.
// Skärmen innanför ramen går x 578–1465, y 207–861 (888 × 655) och får inte plats i ett
// 3:4-utsnitt i full höjd (864 px brett), så mobilutsnittet är kvadratiskt: x 446–1598
// (1152 × 1152), centrerat på skärmen, med ramen och båda tummarna.
export const entries = [{ slot: 'studio', file: 'ipad-0.png', portrait: { left: 446 } }];

export const options = { outDir: 'public/for-dig/foretag-etablerade', portraitAspect: 1 };
