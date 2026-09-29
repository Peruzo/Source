# Bilder – För dig / Privat (`/privat-start`)

Alla filer i den här mappen är **platshållare** (enfärgade SVG:er med etikett och
måttangivelse). De finns bara för att sidan ska bygga och renderas utan trasiga
bilder. Ersätt dem en och en med riktiga bilder.

## Så byter du ut en bild

1. Producera bilden enligt **Rek. upplösning** och **Format** i tabellen nedan.
2. Lägg den i den här mappen med **samma filnamn men rätt filändelse**
   (`.webp` rekommenderas, `.jpg` går också).
3. Uppdatera `src` i `components/sections/for-dig/PrivatForDigSections.tsx`
   så ändelsen stämmer, och byt ut `alt`-texten (alla `alt` är i dag
   `TODO: alt-text – …`).
4. Ta bort `.svg`-platshållaren.

Sidan körs med `images.unoptimized: true` i `next.config.ts`, så bilderna
serveras exakt som de laddas upp – **komprimera innan du lägger in dem.**
Riktmärke: max ~300 kB per fullbreddsbild, ~150 kB per klippt bild.

## Bildplatser

Sektionsnumren räknar heron som 1 och följer sidans ordning uppifrån – samma
nummer som i kommentarerna i `PrivatForDigSections.tsx`. Filnamnens prefix
är sektionens nummer.

| Filnamn | Sektion | Typ | Rek. upplösning | Format (aspect ratio) | Anmärkning |
|---|---|---|---|---|---|
| *(video, se nedan)* | 2. Vi bygger din hemsida | Clipped, höger sida, **video** | 1080 × 1920 | **9:16** (stående) | Loopande video i stället för bild – se [Video](#video--vi-bygger-din-hemsida). Beskärs med samma rundade, asymmetriska mask. |
| *(ingen fil)* | 3. Börja ta betalt | Ingen bakgrundsbild | – | – | Sektionen visar tre UI-kort (`PaymentCards`). Mittenkortets bildyta tar en valfri `checkout.image` (ca 4:3, motivet beskärs till en bred remsa); utan bild visas en CSS-platshållare. |
| *(ingen fil)* | 4. Lägg upp dina produkter eller tjänster | Clipped, vänster – widgets | – | – | Klippformen visar `ProductWidgets` (produktgrid, dialogen Lägg till ny produkt, bokningsbar tjänst). Produktfotona ligger i `produkter/`, se nedan. |
| *(ingen fil)* | 5. Fakturor | Fullbredd, svart – widgets | – | – | Under texten ligger `InvoiceWidgets` som ett appfönster (fakturalista, förhandsgranskad faktura, dialogen Ny faktura). Integrationsmarkeringarna ligger i `integrationer/`, se längst ned. |
| *(ingen fil)* | 6. Kampanjer | Clipped, höger – widgets | – | – | Klippformen visar `CampaignWidgets` som kollage (dialogen Ny kampanj, nedsatt produktkort, kampanjkod, rad med nedsatta produkter). Produkterna använder samma foton som griden, se `produkter/` nedan. |
| *(ingen fil)* | 7. Prenumerationer | Fullbredd, svart – widgets | – | – | Under texten ligger `SubscriptionWidgets` som ett rutnät (inkommande betalningar, kundens tre nivåer, dialogen Ny prenumeration). Inga bilder. |
| `08-sa-kommer-du-igang.webp` | 8. Så kommer du igång | Fullbredd, mörk gradient från vänster | 2880 × 1620 (**nu 2048 × 1152**, se TODO) | **16:9** (liggande) | Motivet måste ligga i **högra halvan** – från 1280 px täcks allt till vänster om 680 px helt av gradienten, och under 1280 beskärs bilden till 4:3 (md: 16:9) kring ca 75 % av bredden. Se [Sektion 8](#sektion-8--så-kommer-du-igång). |
| `09-avslutande-cta.svg` | 9. Avslutande CTA | Fullbredd, fulltäckande | 2880 × 1620 | **16:9** (liggande) | Mörkare motiv fungerar bäst – knapparna ligger ovanpå. |

### Produktbilder – `produkter/`

Riktiga produktfoton i produktgriden i sektion 4, *Lägg upp dina produkter
eller tjänster*, kopplade via `id` i
`components/sections/for-dig/product-widgets/content.ts` (id = filnamn utan
ändelse). Sex av dem används också i kampanjkollaget i sektion 6, via
`components/sections/for-dig/campaign-widgets/content.ts`.

| Fil | Produkt | Mått | Format | Vikt | Används i | Original |
|---|---|---|---|---|---|---|
| `loparsko.webp` | Löparsko | 320 × 320 | WebP q82, 1:1 | 6,3 kB | grid + kampanj | `loparsko.png` |
| `tygsko.webp` | Tygsko | 320 × 320 | WebP q82, 1:1 | 3,9 kB | grid + kampanj | `tygsko.png` |
| `kanga.webp` | Känga | 320 × 320 | WebP q82, 1:1 | 3,9 kB | grid | `kanga.png` |
| `huvtroja.webp` | Huvtröja | 320 × 320 | WebP q82, 1:1 | 3,3 kB | grid | `huvtroja.png` |
| `t-shirt.webp` | T-shirt | 320 × 320 | WebP q82, 1:1 | 6,6 kB | grid | `t-shirt.png` |
| `jeans.webp` | Jeans | 320 × 320 | WebP q82, 1:1 | 5,6 kB | grid | `jeans.png` |
| `sandal.webp` | Sandal | 320 × 320 | WebP q82, 1:1 | 4,8 kB | grid + kampanj | `sandal.png` |
| `loafers.webp` | Loafers | 320 × 320 | WebP q82, 1:1 | 3,8 kB | grid + kampanj | `loafers.png` |
| `vindjacka.webp` | Vindjacka | 320 × 320 | WebP q82, 1:1 | 3,3 kB | grid | `vindjacka.png` |
| `stickad-troja.webp` | Stickad tröja | 320 × 320 | WebP q82, 1:1 | 21,2 kB | grid | `stickad-troja.png` |
| `chinos.webp` | Chinos | 320 × 320 | WebP q82, 1:1 | 3,7 kB | grid | `chinos.png` |
| `mossa.webp` | Mössa | 320 × 320 | WebP q82, 1:1 | 12 kB | grid | `mossa.png` |
| `sneakers.webp` | Sneakers | 320 × 320 | WebP q82, 1:1 | 3,7 kB | grid | `sneakers.png` |
| `sneakers-640.webp` | Sneakers (stora rea-kortet) | 640 × 640 | WebP q82, 1:1 | 11,3 kB | kampanj | `sneakers.png` |
| `skjorta.webp` | Skjorta | 320 × 320 | WebP q82, 1:1 | 3,4 kB | grid | `skjorta.png` |
| `tofflor.webp` | Tofflor | 320 × 320 | WebP q82, 1:1 | 3,1 kB | grid + kampanj | `tofflor.png` |
| `kappa.webp` | Kappa | 320 × 320 | WebP q82, 1:1 | 4,1 kB | grid | `kappa.png` |

Totalt ca 104,1 kB för alla 17 filer.

**Original:** `assets/originals/for-dig/privat/produkter/<namn>.png` –
2048 × 1152 (16:9) PNG, ca 29 MB totalt. Ligger utanför `public/` så att de
inte serveras, och versioneras inte (`assets/originals/` är gitignorerat, så
de finns bara lokalt hos den som genererat bilderna). Generera om WebP:erna
från originalen, aldrig från WebP:erna:

```bash
node scripts/produktbilder.mjs
```

Skriptet gör tre saker, likadant för alla sexton:

1. **Normaliserar bakgrunden till `#f1f1f1`.** Originalen har olika
   bakgrunder (från `#ffffff` till `#e0dedd`, flera med vinjettering). Skriptet
   uppskattar varje bilds egen bakgrund pixel för pixel och tonar den mot
   `#f1f1f1`; produkten och dess skugga lämnas orörda. För original som
   listas i `EDGE_FILL` i skriptet (i dag bara jeans) följer en kantfyllning:
   bakgrundspixlar som hänger ihop med bildkanten och redan ligger inom ±6
   per kanal från `#f1f1f1` sätts till exakt `#f1f1f1`. Det tar bort den
   svagt ljusare rand som toningen lämnade där produkten når kanten, utan
   att röra produkten. Övriga bilders utdata påverkas inte.
2. **Beskär till kvadrat runt produkten**, så att produktens längsta sida
   fyller 80 % av rutan. Där rutan blir större än originalet fylls den ut med
   `#f1f1f1`. Alla produkter får då samma skala oavsett hur de låg i
   originalbilden.
3. **Exporterar 320 × 320 WebP**, kvalitet 82 (sneakers även 640 × 640).

**Storleken är mätt, inte gissad:** den största grid-rutan är 160 CSS-px bred
(1920 px skärm), alltså 320 px på retina. Rutorna blir högre än breda på
desktop (ner till ca 0,55:1), därför visas bilderna med `object-contain` på
samma `#f1f1f1` – då syns hela produkten och kvadraten smälter ihop med rutan.
Rea-kortet i sektion 6 är upp till ca 305 CSS-px brett, därav sneakers i 640 px.

**Nya bilder:** generera mot en jämn ljusgrå bakgrund, ingen vinjettering,
produkten centrerad med luft runt. Lägg PNG:en i `assets/originals/…/produkter/`
med produktens id som namn och kör skriptet. Kontrollera resultatet mot
övriga i griden. Mätt 2026-09-27: alla 17 filer har exakt `#f1f1f1`
(0,00 % avvikelse) i de fyra hörnen (16 × 16 px). Lämnar en ny bild en ljusare
rand vid kanten, lägg dess id i `EDGE_FILL` i skriptet i stället för att höja
toleransen.

Sektionen *Allt du kan göra* (horisontell scroll med fyra paneler) är
borttagen; dess widgets ligger nu i sektion 4–7 ovan.

## Sektion 8 – Så kommer du igång

`08-sa-kommer-du-igang.webp` – 2048 × 1152 (16:9), WebP kvalitet 82, ca 203 kB.

**Original:** `assets/originals/for-dig/privat/08-sa-kommer-du-igang.png`
(PNG, 2048 × 1152, 3,1 MB). Ligger utanför `public/` så att den inte serveras.
Generera WebP:en från originalet, aldrig från WebP:en:

```bash
node -e "require('sharp')('assets/originals/for-dig/privat/08-sa-kommer-du-igang.png').webp({quality:82}).toFile('public/images/for-dig/privat/08-sa-kommer-du-igang.webp')"
```

**TODO – upplösning:** 2048 px bred blir mjuk på retinaskärmar från 1440 px
(bilden täcker hela bredden och behöver ~2880 px). Generera om i 2880 × 1620
om det syns, lägg den nya PNG:en som original ovan och kör kommandot igen.

**Kontrast:** texten ligger på en nästan svart ton med grön underton
(`teal-dark` 15 % + svart, `#001310`), mätt på den byggda sidan: vit 18,9:1,
vit 85 % 13,7:1, teal 8,1:1.

**Komposition:** från 1280 px (`xl`) ligger bilden bakom texten med gradienten
solid till 680 px och borta vid 1000 px, och bilden är placerad med
`object-position: 30% 50%`. Kvinnans ansikte ligger då fritt från toningen på
1280, 1440 och 1920. Ryggen på tröjan beskärs av högerkanten på 1280–1440,
eftersom sektionen är högre än bildens 16:9 och bilden skalas upp. Under 1280
ligger bilden ovanför texten. Byter du bild: håll motivet i högra halvan och
kontrollera att ansiktet hamnar till höger om 1000 px på 1280–1920.

## Video – Vi bygger din hemsida

Sektion 2 visar en video i stället för bild. Filerna ligger **inte** i den här
mappen utan i `public/videos/`:

| Fil | Innehåll |
|---|---|
| `vi-bygger-din-hemsida.mp4` | 15 s, 1080 × 1920, H.264, inget ljud, ca 2,3 MB. Spelas `autoplay muted loop playsinline`. |
| `vi-bygger-din-hemsida-poster.webp` | Stillbild från 14,5 s (slutläget – sidan är färdigbyggd). Visas innan videon startar och **i stället för** videon för den som valt minskad rörelse (`prefers-reduced-motion`). |

**Källa:** videon renderas i Remotion-projektet `~/projects/source-motion`.
Byt inte ut den här för hand – ändra där och rendera om:

```bash
cd ~/projects/source-motion && npm run render:web
```

Det skriver `out/web.mp4`. Kopiera den hit som `vi-bygger-din-hemsida.mp4` och
ta fram en ny poster från samma ögonblick (ffmpeg-bygget saknar WebP-encoder,
så gå via PNG):

```bash
ffmpeg -ss 14.5 -i public/videos/vi-bygger-din-hemsida.mp4 -frames:v 1 poster.png
node -e "require('sharp')('poster.png').webp({quality:82}).toFile('public/videos/vi-bygger-din-hemsida-poster.webp')"
```

Justera `-ss` om videons längd ändras – postern ska vara slutläget.

### Attribution (CC BY 4.0) – krävs

Laptopmodellen i videon är
["Modern Slim Laptop"](https://sketchfab.com/3d-models/modern-slim-laptop-fbf172f8b14241feab581dcb1fbcd475)
av [Blaž Mraz (Mraz3D)](https://sketchfab.com/Mraz3D), licensierad under
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/).
Ändringar: skärmens material ersatt med en egen textur, skärmens UV-koordinater
omräknade, modellen skalad och placerad för scenen.

Licensen kräver attribution där verket används – alltså även i den här sidan,
inte bara i source-motion. Den synliga krediteringen för besökare står som en
grå rad under CTA:n i sektion 2 (`PrivatForDigSections.tsx`). Ta inte bort den
eller den här noteringen så länge videon används.

## Kontrast – läs innan du väljer bild

Text ligger ovanpå bild bara i sektion 9 (avslutande CTA). Fullbredds-
sektionen lägger på en
dubbel overlay (`bg-black/55` + en radiell vinjett) som ger ca 84 % effektiv
svärta i mitten. Det räcker för vit text (≈ 5:1) **även mot en helvit bild**.

Men: välj ändå bilder utan hårda ljusa högdagrar mitt i bild. Overlayen räddar
kontrastvärdet, men en orolig bakgrund gör texten svårläst ändå. Om du byter
till en mycket ljus bild – verifiera kontrasten i webbläsarens
tillgänglighetspanel innan du släpper den.

## Hero

Heron högst upp på sidan (`/privatstart.png`) hör **inte** hit och ska inte
röras – den ligger kvar i `public/` och är oförändrad.

## Integrationsmarkeringar – `integrationer/`

Små logotypplatser bredvid raderna i fakturalistan i panelen *Fakturor*.
Kopplas via `integrations` i
`components/sections/for-dig/invoice-widgets/content.ts` – där står även
namnet (`label`) som används i alt-texten.

| Filnamn | Typ | Rek. upplösning | Format (aspect ratio) | Anmärkning |
|---|---|---|---|---|
| `bokforing-a.svg` | Logotypplats, fakturarad | 64 × 64 (SVG föredras) | **1:1** (kvadrat) | Visas i 20 × 20 px (16 × 16 px i smala layouter), `object-contain`, inga rundade hörn. |
| `bokforing-b.svg` | Logotypplats, fakturarad | 64 × 64 (SVG föredras) | **1:1** (kvadrat) | Som ovan. |

Filerna är **neutrala platshållare** (grå ruta med bokstav). Rita aldrig av
en leverantörs logotyp i CSS eller SVG – hämta originalfilen från respektive
leverantörs presskit, lägg den här och uppdatera `src` och `label` i
content-filen. Följ leverantörens riktlinjer för frizon och minsta storlek;
om 20 px är under deras minimum, ta upp det innan logotypen läggs in.
