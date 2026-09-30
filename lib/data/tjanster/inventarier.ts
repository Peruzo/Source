/*
 * Innehåll för /tjanster/inventarier.
 *
 * Varje påstående här ska finnas i kundportalens kod (source.database,
 * origin/develop b3a83756, kontrollerad 2026-09-27 – se
 * CC-RAPPORT-inventarier-bygge-2.md, punkt 1 och 5). Skriv inga resultat,
 * siffror eller paket. Exempeldata i widgetarna är generisk och visar hur
 * gränssnittet ser ut, inte vad en kund uppnår.
 */
import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  SignalIcon,
  Squares2X2Icon,
  UserGroupIcon,
  ViewfinderCircleIcon,
} from '@heroicons/react/24/outline';
import type { FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';
import { ean13 } from '@/components/sections/tjanster/widgets/Ean13Barcode';

const IMG = '/tjanster/inventarier/inventarier';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720, 920];

export const inventarierImages = {
  // B2 – över axeln, telefonen riktad mot en kartong med streckkod.
  skanna: {
    base: `${IMG}-skanna`,
    alt: 'En person håller upp sin telefon mot en kartong på ett bord.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '46% 50%',
    portraitFocus: '55% 45%',
  },
  // C2 – mörk dörröppning, en person med surfplatta framför två som bär en kartong.
  inkop: {
    base: `${IMG}-inkop`,
    alt: 'En person läser på en surfplatta i en dörröppning medan två andra bär en kartong bakom.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '55% 60%',
    portraitFocus: '50% 60%',
  },
  // D3 – händer som ställer en kartong på en hylla. Fast utsnitt, samma filer på alla brytpunkter.
  narbild: {
    base: `${IMG}-narbild`,
    alt: 'Händer som ställer in en kartong på en hylla.',
    widths: [640, 1024, 1428],
    focus: '8% 60%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * Sticky scroll. Belägg: skanning EAN-13/EAN-8/UPC-A med BarcodeDetector och
 * zxing (inventarier-layout2.html), uppslag per variant
 * (/api/product-inventory/lookup); SSE-ström; rekommenderade inköp
 * (services/inventoryRecommendationService.js): försäljningstakt 30/90 dagar,
 * säsongsfaktor bara vid minst 12 månaders historik, föreslagen mängd.
 */
export const inventarierSteps = {
  eyebrow: 'Så fungerar det',
  title: 'Från skanning till inköp',
  steps: [
    {
      title: 'Skanna',
      body: 'Rikta mobilkameran mot streckkoden, EAN eller UPC, så hittar Source rätt produkt och variant.',
    },
    {
      title: 'Saldot uppdateras',
      body: 'Ändringen sparas direkt och syns live i inventarielistan för alla i teamet som har tillgång till den.',
    },
    {
      title: 'Köp in i tid',
      body: 'Rekommenderade inköp räknar på hur snabbt varje variant säljer, väger in säsongen när det finns ett års historik och föreslår hur många du behöver beställa.',
    },
  ],
} as const;

/*
 * Widgetdata. En generisk produkt, inga kund- eller varumärkesnamn.
 * Inköpsförslaget följer portalens egen formel (inventoryRecommendationService):
 * 9 sålda per vecka → 1,29/dag, säsongsfaktor 1,3 → 1,67/dag,
 * täcker 12 / 1,67 ≈ 7 dagar (< ledtid 14 → "Slut inom ledtid", hög prioritet),
 * föreslaget = ceil(((14 + 30) × 1,67 − 12) / 6) × 6 = 66 st med typisk orderrad 6.
 */
export const inventarierWidgets = {
  product: 'Förvaringsbox',
  variant: 'Mellan, grå',
  ean: ean13('200123456789'),
  scan: { title: 'Skanna streckkod', found: 'Hittad' },
  stock: { title: 'Saldo', from: 11, to: 12, note: 'Uppdaterat just nu' },
  restock: {
    title: 'Rekommenderade inköp',
    priority: 'Hög',
    stock: 12,
    perWeek: 9,
    coverDays: 7,
    suggested: 66,
    reasons: ['Slut inom ledtid', 'Säljs i volym', 'Säsong börjar'],
    snooze: 'Ignorera 30 dagar',
  },
} as const;

/*
 * Karusell – sju belagda funktioner (rekommenderade inköp har egen sektion).
 * Export skrivs utan "all data": exporten från inventarielistan tar i dag med
 * högst 100 rader (routes/inventoryRoutes.js, Math.min(100, …)).
 * Behörighet: sidbehörigheten page:inventarier (config/permissions.js).
 */
export const inventarierFeatures: { eyebrow: string; title: string; items: FeatureItem[] } = {
  eyebrow: 'Funktioner',
  title: 'Allt du behöver för att hålla ordning',
  items: [
    { icon: Squares2X2Icon, title: 'Saldo per variant', body: 'Se hur många du har av varje variant, till exempel storlek, färg eller modell.' },
    { icon: ViewfinderCircleIcon, title: 'Skanna med mobilen', body: 'Kameran läser EAN- och UPC-koder. Ingen extra utrustning behövs.' },
    { icon: ArrowUpTrayIcon, title: 'Importera från Excel eller CSV', body: 'Läs in saldona du redan har i stället för att skriva in dem igen.' },
    { icon: ArrowDownTrayIcon, title: 'Exportera', body: 'Ta ut din inventarielista som en fil när du behöver den.' },
    { icon: AdjustmentsHorizontalIcon, title: 'Du väljer vad som spåras', body: 'Slå på lagerspårning per produkt, bara där det behövs.' },
    { icon: UserGroupIcon, title: 'Behörigheter per roll', body: 'Bestäm vem i teamet som har tillgång till inventarierna.' },
    { icon: SignalIcon, title: 'Live-uppdaterade saldon', body: 'Ändringar syns i inventarielistan utan att du laddar om sidan.' },
  ],
};

/*
 * Helbild C2. Belägg: daysOfCover, suggestedQty, reasons och snooze 30 dagar
 * (models/InventoryRecommendation.js, routes/inventoryRoutes.js). Rekommendationer
 * visas först när en variant har minst 14 dagars orderhistorik.
 */
export const inventarierRestock = {
  eyebrow: 'Rekommenderade inköp',
  title: 'Vet vad som behöver köpas in härnäst',
  body: [
    'Source räknar på hur snabbt varje variant säljer och hur länge saldot räcker, och föreslår en mängd när det är dags att beställa.',
    'Förslaget är ett underlag, beslutet är ditt. Passar det inte just nu lägger du det åt sidan i 30 dagar.',
  ],
};

/*
 * Returer – omskriven (beslut 2 för copy): returmodulen finns och är kopplad
 * till återbetalning (services/shipping/routes/returns.js, processReturnRefund),
 * men "Återställ i lager" ändrar bara status och uppdaterar inte saldot
 * (returns.js, PATCH /:returnId/status). Inget påstående om lagerkoppling.
 * Före: "Returer som uppdaterar lagret automatiskt" / "När en retur registreras
 * kan lager, logistik och återbetalning arbeta tillsammans i ett och samma
 * flöde — utan manuellt dubbelarbete."
 */
export const inventarierReturns = {
  eyebrow: 'Returer',
  title: 'Returer i samma system',
  body: 'Registrera returer, följ varje ärende och genomför återbetalningen på samma ställe som du hanterar dina produkter och ditt lager.',
  cta: { label: 'Se hur det fungerar', href: '/kontakt' } satisfies ServiceCta,
  steps: [
    { title: 'Retur registrerad', note: 'Ärendet skapat' },
    { title: 'Retur mottagen', note: 'Status uppdaterad' },
    { title: 'Återbetalning', note: 'Görs i samma ärende' },
  ],
};

/* Split med D3. Belägg: import stock-only (routes/inventoryImportRoutes.js) och export. */
export const inventarierImport = {
  eyebrow: 'Kom igång',
  title: 'Ta med dig lagret du redan har',
  body: [
    'Importera dina saldon från Excel eller CSV och fortsätt därifrån.',
    'Behöver du ta ut listan igen exporterar du den som en fil.',
  ],
  cta: { label: 'Prata med oss', href: '/kontakt' } satisfies ServiceCta,
};
