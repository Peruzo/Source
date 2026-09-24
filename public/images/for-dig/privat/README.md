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
| `01-vi-bygger.svg` | 1. Vi bygger din hemsida | Clipped, höger sida | 1600 × 2000 | **4:5** (stående) | Beskärs med rundad, asymmetrisk mask. Håll motivet centrerat – kanterna kapas. Scrollar förbi sticky text på desktop, så bildens överkant och underkant syns aldrig samtidigt. |
| *(ingen fil)* | 2. Börja ta betalt | Ingen bakgrundsbild | – | – | Sektionen visar tre UI-kort (`PaymentCards`). Mittenkortets bildyta tar en valfri `checkout.image` (ca 4:3, motivet beskärs till en bred remsa); utan bild visas en CSS-platshållare. |
| `03-panel-produkter.svg` | 3. Allt du kan göra → panel 1 | Panel i horisontell scroll | 1400 × 1050 | **4:3** (liggande) | Visas i rundad ruta, `object-cover`. |
| `03-panel-fakturor.svg` | 3. Allt du kan göra → panel 2 | Panel i horisontell scroll | 1400 × 1050 | **4:3** (liggande) | Samma som ovan. |
| *(ingen fil)* | 3. Allt du kan göra → panel 3 | Widgets i stället för bild | – | – | Panelen visar `CampaignWidgets` (grid med nedsatta produkter, dialogen Ny kampanj, kampanjkod, nedsatt produktkort). Alla produktbilder pekar på den befintliga `produkter/13-sneakers.svg` – byt `src` per produkt i `campaign-widgets/content.ts`. |
| `03-panel-prenumerationer.svg` | 3. Allt du kan göra → panel 4 | Panel i horisontell scroll | 1400 × 1050 | **4:3** (liggande) | Samma som ovan. |
| `04-lagg-upp-produkter.svg` | 4. Lägg upp dina produkter eller tjänster | Clipped, **vänster** sida | 1600 × 2000 | **4:5** (stående) | Speglad mot sektion 1 – masken är spegelvänd. |
| `05-fakturor.svg` | 5. Fakturor | Fullbredd, fulltäckande | 2880 × 1620 | **16:9** (liggande) | Som sektion 2. |
| `06-kampanjer.svg` | 6. Kampanjer | Clipped, höger sida | 1600 × 2000 | **4:5** (stående) | Samma sida som sektion 1. |
| `07-prenumerationer.svg` | 7. Prenumerationer | Fullbredd, fulltäckande | 2880 × 1620 | **16:9** (liggande) | Som sektion 2. |
| `09-avslutande-cta.svg` | 9. Avslutande CTA | Fullbredd, fulltäckande | 2880 × 1620 | **16:9** (liggande) | Mörkare motiv fungerar bäst – knapparna ligger ovanpå. |

Sektion **8 (Så kommer du igång)** har medvetet ingen bild – den är ren
typografi.

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
