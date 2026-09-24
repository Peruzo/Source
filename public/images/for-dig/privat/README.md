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
Riktmärke: max ~300 kB per fullbreddsbild, ~150 kB per panelbild.

## Bildplatser

| Filnamn | Sektion | Typ | Rek. upplösning | Format (aspect ratio) | Anmärkning |
|---|---|---|---|---|---|
| *(video, se nedan)* | 1. Vi bygger din hemsida | Clipped, höger sida, **video** | 1080 × 1920 | **9:16** (stående) | Loopande video i stället för bild – se [Video](#video--vi-bygger-din-hemsida). Beskärs med samma rundade, asymmetriska mask. |
| *(ingen fil)* | 2. Börja ta betalt | Ingen bakgrundsbild | – | – | Sektionen visar tre UI-kort (`PaymentCards`). Mittenkortets bildyta tar en valfri `checkout.image` (ca 4:3, motivet beskärs till en bred remsa); utan bild visas en CSS-platshållare. |
| *(ingen fil)* | 3. Allt du kan göra → panel 1 | Widgets i stället för bild | – | – | Panelen visar `ProductWidgets` (produktgrid, dialogen Lägg till ny produkt, bokningsbar tjänst). Produktbilderna ligger i `produkter/`, se nedan. |
| *(ingen fil)* | 3. Allt du kan göra → panel 2 | Widgets i stället för bild | – | – | Panelen visar `InvoiceWidgets` (fakturalista, dialogen Ny faktura, förhandsgranskad faktura). Integrationsmarkeringarna ligger i `integrationer/`, se längst ned. |
| *(ingen fil)* | 3. Allt du kan göra → panel 3 | Widgets i stället för bild | – | – | Panelen visar `CampaignWidgets` (grid med nedsatta produkter, dialogen Ny kampanj, kampanjkod, nedsatt produktkort). Alla produktbilder pekar på den befintliga `produkter/13-sneakers.svg` – byt `src` per produkt i `campaign-widgets/content.ts`. |
| *(ingen fil)* | 3. Allt du kan göra → panel 4 | Widgets i stället för bild | – | – | Panelen visar `SubscriptionWidgets` (inkommande betalningar, kundens tre prenumerationsnivåer, dialogen Ny prenumeration). Inga bilder. |
| `04-lagg-upp-produkter.svg` | 4. Lägg upp dina produkter eller tjänster | Clipped, **vänster** sida | 1600 × 2000 | **4:5** (stående) | Speglad mot sektion 1 – masken är spegelvänd. |
| `05-fakturor.svg` | 5. Fakturor | Fullbredd, fulltäckande | 2880 × 1620 | **16:9** (liggande) | Som sektion 2. |
| `06-kampanjer.svg` | 6. Kampanjer | Clipped, höger sida | 1600 × 2000 | **4:5** (stående) | Samma sida som sektion 1. |
| `07-prenumerationer.svg` | 7. Prenumerationer | Fullbredd, fulltäckande | 2880 × 1620 | **16:9** (liggande) | Som sektion 2. |
| `09-avslutande-cta.svg` | 9. Avslutande CTA | Fullbredd, fulltäckande | 2880 × 1620 | **16:9** (liggande) | Mörkare motiv fungerar bäst – knapparna ligger ovanpå. |

### Produktbilder – `produkter/`

Bildplatser i produktgriden i panelen *Produkter & tjänster*. 16 filer,
`01-loparsko.svg` … `16-kappa.svg`, kopplade via `id` i
`components/sections/for-dig/product-widgets/content.ts`.

| Filnamn | Typ | Rek. upplösning | Format (aspect ratio) | Anmärkning |
|---|---|---|---|---|
| `01-loparsko.svg` … `16-kappa.svg` | Produktbild i grid | 800 × 800 | **1:1** (kvadrat) | Visas som miniatyr, ca 70–90 px bred. Rutans höjd följer panelen, så bilden beskärs lätt (`object-cover`) till mellan ca 4:5 och 5:4 – håll plagget centrerat med luft runt. Ljus, lugn bakgrund; inga loggor på plaggen. |

Platshållarna saknar måttetikett i själva bilden, till skillnad från övriga
platshållare – i miniatyrstorlek blir texten bara brus. Måtten står här.

Sektion **8 (Så kommer du igång)** har medvetet ingen bild – den är ren
typografi.

## Video – Vi bygger din hemsida

Sektion 1 visar en video i stället för bild. Filerna ligger **inte** i den här
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
grå rad under CTA:n i sektion 1 (`PrivatForDigSections.tsx`). Ta inte bort den
eller den här noteringen så länge videon används.

## Kontrast – läs innan du väljer bild

Text ligger ovanpå bild i sektion 2, 5, 7 och 9. De sektionerna lägger på en
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
