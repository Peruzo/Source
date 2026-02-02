# Kontaktsida – Designanalys & Implementationsguide

En djupgående analys av Fortnox och Revoluts kontaktsidor för att skapa en liknande upplevelse.

---

## 1. Fortnox Kontaktsida (fortnox.se/kontakt)

### 1.1 Översikt

Fortnox använder en **sektionerad layout** med tydlig visuell hierarki, mjuka bakgrundsfärger och **split-screen hero** med bild. Sidan riktar sig till B2B (företagare, redovisningsbyråer) och har flera tydliga kontaktvägar.

### 1.2 Hero-sektion (Header)

| Element | Beskrivning |
|---------|-------------|
| **Layout** | Split-screen: text vänster (~60%), bild höger (~40%) |
| **Bakgrund** | Mörkgrön `#0d3b2c` (darkGreen) |
| **Bild** | `fortnox-kontakt.jpg` – människor i mötesmiljö, `object-fit: cover`, placerad höger |
| **Storlek** | Full viewport-bredd, cirka 400–500px höjd (desktop) |
| **Struktur** | `HeaderImage-module`, `layout--right` (bild till höger) |

**Textinnehåll:**
- H1: "Nyfiken på våra program och tjänster?"
- Undertext: "Vi hjälper dig att välja rätt produkter för just ditt företag. Lämna dina kontaktuppgifter så hör vi av oss."
- CTA: Två pill-knappar: "Prata med oss" + "Fortnox för redovisningsbyråer"

**CSS-klasser (indikerar struktur):**
- `ContainerFluid`, `HeaderImage`, `darkGreen`
- `HeaderImage__contentContainer`, `HeaderImage__imageContainer`
- Bild: `ImageAsset`, `cover`, `absolute` (positionering)

### 1.3 Kortsektion (3-kort grid)

| Element | Beskrivning |
|---------|-------------|
| **Layout** | 3 kolumner (grid), `CardSmallGroup`, primär kort längst ner på mobil |
| **Bakgrund** | Ljusbeige `#F5F0EB` (lightBeige) med subtilt mönster |
| **Kort** | Avrundade hörn, ingen tydlig border, padding |

**Innehåll per kort:**

1. **Redovisningsbyrå**
   - Rubrik: "Vill du veta mer om Fortnox för redovisningsbyråer?"
   - Text: "Vi har allt för byrån. Lämna dina kontaktuppgifter..."
   - CTA: "Kontakta mig" → `/kontakt/redovisningsbyra`

2. **Support**
   - Rubrik: "Behöver du hjälp i våra program eller med ditt abonnemang?"
   - Text: "Logga in för att chatta eller prata med oss..."
   - CTA: "Logga in och prata med oss" → inloggning

3. **Övriga frågor**
   - Rubrik: "Övriga frågor om support"
   - Text: "På vår supportsida hittar du svar på vanliga supportfrågor..."
   - CTA: "Till vår supportsida" → support.fortnox.se

### 1.4 Press & Skola (Stor kort)

| Element | Beskrivning |
|---------|-------------|
| **Layout** | Fullbredds-kort, text vänster, bakgrundsbild |
| **Bakgrund** | Gul/creme `#F4E8D8` (yellow), bakgrundsbild `foretagskort-card-largebw.jpg` |
| **Struktur** | `CardLargeInverted`, `layout--text-left` |

**Innehåll:**
- H2: "För press och skola"
- **Presskontakt**: Mejla press@fortnox.se, länk "Gå till nyhetsrummet"
- **Utbildning**: Mejla skola@fortnox.se, länk "Gå till skola & UF"

### 1.5 Kontor / Besök

| Element | Beskrivning |
|---------|-------------|
| **Layout** | Split: text + bild (byggnad) |
| **Bakgrund** | Vit `#FFFFFF` |
| **Bild** | `fortnox-building-1.jpg` – byggnadsfasad, ca 584×256px renderad |

**Innehåll:**
- H2: "Vill du besöka Fortnox?"
- Text: "Vi finns på flera orter i landet. Här hittar du kontaktuppgifter och besöksadresser till alla våra kontor."
- CTA: "Se alla våra kontor"

### 1.6 Bilder – sammanfattning

| Bild | Syfte | Placering | Storlek (ungefär) |
|------|-------|-----------|-------------------|
| fortnox-kontakt.jpg | Hero – människor/möte | Höger i hero | 1200×256 (crop) |
| foretagskort-card-largebw.jpg | Bakgrund Press/Skola | Bakgrund | 2640×2400 (cover) |
| fortnox-building-1.jpg | Kontor | Höger i sektion | 584×256 |
| (Mobil) z2__generell_mob.jpg, byra_postit.jpg, vaxjo_studioinspelning.jpg | Mobilmeny | Dropdown | 142×247 vardera |

**Bildhantering:** Next.js `Image`, Storyblok CDN, `object-fit: cover`, `border-radius` på kort.

### 1.7 Färgpalett

- **Mörkgrön (hero):** `#0d3b2c`
- **Ljusbeige (kort):** `#F5F0EB` med mönster
- **Gul/creme (press):** `#F4E8D8`
- **Vit:** `#FFFFFF`
- **Text:** Svart/dark gray, vita länkar på mörk bakgrund

### 1.8 Typografi & spacing

- H1: Stor, fet, vit på mörkgrön
- H2: Mindre, avskiljda sektioner
- H5: För underrubriker (Presskontakt, Utbildning)
- Generös padding (`Section-module padding-x padding-y`)
- Maxbredd för innehåll: container (t.ex. 1200px)

---

## 2. Revolut Kontaktsida (revolut.com/sv-SE/contact-us/)

### 2.1 Översikt

Revolut fokuserar på **app-centrerad support** och använder en **minimal, modern layout** med mörk tema, tydliga CTA:er och få men strategiska bilder. Sidan driver användare mot chatt i appen och hjälpcentret.

### 2.2 Hero-sektion

| Element | Beskrivning |
|---------|-------------|
| **Layout** | Split: text vänster, bild/illustration höger |
| **Bakgrund** | Mörk gradient (nästan svart) |
| **Bild** | Illustration/foto 1200×830 – personer med mobiler/datorer |
| **Storlek** | Full viewport-bredd, flex layout |

**Textinnehåll:**
- Små etikett: "Kontakta oss"
- H1: "Vi finns här för dig, dygnet runt"
- Undertext: "Oavsett om du vill bläddra igenom vårt hjälpcenter för att hitta lösningar eller chatta med oss direkt så finns vi här för dig – även på söndagar."

**Design:** Centrerad/balanserad text, ingen primär knapp i hero – fokus på information.

### 2.3 Huvudsektioner (flex/row)

Varje sektion följer mönstret: **text vänster, bild höger** (eller omvänt) med CTA.

**Sektion 1 – Chatta med oss**
- H2: "Chatta med oss"
- Text: Instruktioner (profilikon → Hjälp → Support)
- CTA: "Gå till chatten i appen" (länk till app)
- Bild: 450×600 – mobil/app-screenshot eller illustration

**Sektion 2 – Färdigskrivna svar**
- H2: "Färdigskrivna svar"
- Text: "Hitta detaljerade svar på vanliga frågor i vårt hjälpcenter..."
- CTA: "Gå till hjälpcentret"
- Bild: 450×600

**Sektion 3 – Misstänkt aktivitet**
- H2: "Har du upptäckt något misstänkt?"
- Text: Uppmaning att anmäla omedelbart
- CTA: "Rapportera aktivitet"
- Bild: 1200×747

### 2.4 Accordion / Expandable

**Sektion – Få tillbaka åtkomst**
- H2: "Få tillbaka åtkomst till ditt konto"
- Lista med klickbara knappar (accordion):
  - Jag har förlorat åtkomst till mitt konto eller kort
  - Jag har glömt min lösenkod
  - Jag har förlorat åtkomst till telefonnumret...
  - Jag har glömt lösenkod OCH förlorat åtkomst till telefon...

**Sektion – Snabbåtkomst**
- Etikett: "Snabbåtkomst"
- H2: "Behöver du hjälp? Så här gör du"
- Accordion-lista:
  - Misstänker du bedrägeri? Anmäl det!
  - Dela med dig av din upplevelse av Revolut
  - Media och partnerskap
  - Kontaktuppgifter för domstolsbeslut och officiella förfrågningar

### 2.5 Bilder – sammanfattning

| Typ | Storlek | Syfte |
|-----|---------|-------|
| Hero-bild | 1200×830 | Människor/teknologi |
| Sektion 1–2 | 450×600 | Illustrations/stöd |
| Sektion 3 | 1200×747 | Säkerhet/alert |
| Logo/ikoner | Varierande | Header, footer |

**Bildkällor:** Revolut assets CDN (`assets.revolut.com`)

### 2.6 Färgpalett

- **Bakgrund:** Nästan svart / mörk gradient
- **Accent:** Blå (t.ex. `#0070E0`) för länkar och CTA
- **Text:** Vit/grå på mörk bakgrund
- **Kort/sektioner:** Subtil kontrast, mörka toningar

### 2.7 Layout & teknik

- **Display:** `flex`, `flex-direction: row` på sektioner
- **Sektioner:** `Box`, `Position__Relative`
- **Accordion:** `<button>` med expand/collapse
- **Responsivitet:** Stapelade kolumner på mobil

---

## 3. Jämförelse: Fortnox vs Revolut

| Aspekt | Fortnox | Revolut |
|--------|---------|---------|
| **Målgrupp** | B2B, företag, redovisningsbyråer | B2C, privatpersoner |
| **Hero** | Split, mörkgrön, tydlig CTA | Split, mörk, informativ |
| **Bilder** | Fler, fotografier (kontor, människor) | Färre, illustrationer/screens |
| **Kontaktvägar** | Formulär, telefon, support, kontor | App-chatt, hjälpcenter, formulär |
| **Färger** | Grön, beige, gul, vit | Mörk, blå accent |
| **Kort/Grid** | 3-kort, jämnt | Alternerande bild + text |
| **Accordion** | Nej | Ja (åtkomst, snabbåtkomst) |
| **Footer** | Adress, öppettider, sociala, app | Paket, länkar, legal |

---

## 4. Implementationsguide – Skapa något liknande

### 4.1 Rekommenderad sektionsstruktur

```
1. Hero (split: text + bild)
   - H1, undertext, 1–2 CTA-knappar
   - Bakgrund: mörk eller accentfärg

2. Kontaktvägar (3-kort grid)
   - Kort 1: Primär kontakt (formulär/chat)
   - Kort 2: Support/hjälp
   - Kort 3: Övrigt (t.ex. FAQ, kontor)

3. Sekundär information (stor kort eller 2-kol)
   - T.ex. Press, partners, kontor
   - Valfri bakgrundsbild

4. Snabbåtkomst / FAQ (accordion eller lista)
   - Vanliga frågor eller snabblänkar

5. Löften / trust (valfritt)
   - Svarstid, garanti, etc.
```

### 4.2 Layout-komponenter

**Hero (split):**
```html
<section class="hero-split">
  <div class="hero-content">
    <p class="hero-label">Kontakta oss</p>
    <h1>...</h1>
    <p class="hero-sub">...</p>
    <div class="cta-group">
      <a href="...">Prata med oss</a>
      <a href="...">För [annan målgrupp]</a>
    </div>
  </div>
  <div class="hero-image">
    <img src="..." alt="..." />
  </div>
</section>
```

**3-kort grid:**
```html
<section class="cards-section light-bg">
  <div class="cards-grid">
    <article class="card">...</article>
    <article class="card">...</article>
    <article class="card">...</article>
  </div>
</section>
```

**Accordion (Revolut-stil):**
```html
<section>
  <h2>Få tillbaka åtkomst / Snabbåtkomst</h2>
  <div class="accordion">
    <button aria-expanded="false">Fråga 1</button>
    <div class="panel">...</div>
    <button aria-expanded="false">Fråga 2</button>
    <div class="panel">...</div>
  </div>
</section>
```

### 4.3 Färgval

**Alternativ A – Fortnox-inspirerad:**
- Hero: `#0d3b2c` eller egen mörk accent
- Kort: `#F5F0EB` eller `#FDF8F3`
- Accent: `#2D8B6E` (teal/grön)
- Text: Svart, mörkgrå

**Alternativ B – Revolut-inspirerad:**
- Bakgrund: `#0a0a0a` / `#121212`
- Accent: `#0070E0` (blå)
- Text: Vit, `#a0a0a0`

**Alternativ C – Hybrid (befintlig Source):**
- Behåll nuvarande `#121212`, `#1F1F1F`, `#FDF8F3`, teal
- Lägg till split-hero med bild
- 3-kort grid i beige
- Accordion för FAQ

### 4.4 Bilder som behövs

| Syfte | Rekommendation | Format |
|-------|----------------|--------|
| Hero | Människor i arbete/möte eller illustration | 16:9 eller 4:3, minst 1200px bred |
| Kort (valfritt) | Ikoner eller små illustrationer | SVG eller 200×200 |
| Sekundär sektion | Kontor, team eller abstrakt | 1200×600+ |
| Mobilanpassning | Samma eller croppad version | Responsiv med `object-fit: cover` |

### 4.5 Checklista före implementation

- [ ] Bestäm målgrupp (B2B/B2C/hybrid)
- [ ] Välj färgpalett (Fortnox/Revolut/hybrid)
- [ ] Skaffa eller välj hero-bild
- [ ] Definiera minst 2–3 tydliga kontaktvägar
- [ ] Besluta om accordion för FAQ/snabbåtkomst
- [ ] Planera footer: adress, telefon, sociala medier
- [ ] Responsivitet: mobil-first för kort och accordion
- [ ] Tillgänglighet: fokusstates, aria-expanded för accordion

---

## 5. Slutsats

- **Fortnox** – Sektionerad, B2B-inriktad, många vägar (formulär, support, kontor, press) med mjuka färger och fotografier.
- **Revolut** – App-fokuserad, mörk design, tydliga CTA:er och accordion för vanliga ärenden.

En hybrid kan kombineras med:
1. Split-hero med bild
2. 3-kort grid för kontaktvägar
3. Eventuell accordion för FAQ
4. En sekundär sektion (press/partners/kontor)
5. Er nuvarande kontaktformulär och löften-sektion

Väntar på vidare instruktioner för nästa steg (t.ex. konkret implementation i `app/kontakt/page.tsx`).
