# Quick Start Guide - Source Public Website

## 🚀 För AI-agenter (Teknisk Setup)

### 1. Grundläggande Installation (5 minuter)

```bash
# Klona och navigera till projektet
cd source-public-website
npm install

# Starta utvecklingsserver
npm run dev
```

**Öppna:** http://localhost:3000

### 2. Verifiera Installation

**Visuell Test:**
- [ ] Homepage laddar utan fel
- [ ] Alla 7 sektioner visas
- [ ] Animationer fungerar (scrolla ner)
- [ ] Custom cursor visas på desktop
- [ ] Navigation fungerar (mobilmeny)

**Sidor att kontrollera:**
- [ ] `/` - Homepage med alla sektioner
- [ ] `/tjanster` - 5 service-sektioner
- [ ] `/portfolio` - Projekt-grid
- [ ] `/om-oss` - Team-sektion
- [ ] `/priser` - 3 pricing-kort
- [ ] `/kontakt` - Kontaktformulär

### 3. Build Test

```bash
npm run build
```

**Förväntat resultat:** Bygg lyckas utan fel

## 👨‍💼 För Projektledning (Övergripande Process)

### Projektstruktur Förståelse

**Arkitektur:**
- **Next.js 15** med App Router
- **TypeScript** för typ-säkerhet
- **Tailwind CSS v4** för styling
- **Framer Motion** för animationer

**Unika Funktioner:**
- Custom cursor med magnetic effects
- Bento grid layouts (7-5-5 kolumner)
- Scroll-triggered animations
- Glassmorphism design system
- Performance: 174KB first load

### Kvalitetsstandarder

**Design:**
- Mobil-först responsiv design
- 8-point spacing system
- Fluid typography (clamp-based)
- Accessibility: WCAG 2.1 AA

**Kod:**
- 100% TypeScript coverage
- ESLint compliant
- Modular komponent-arkitektur
- Performance-optimerad

## 👨‍💻 För Utvecklare (Kodningsriktlinjer)

### Komponent-arkitektur

**Animation Hooks:**
```typescript
// Använd för scroll-triggered animationer
const { ref, isVisible } = useScrollTrigger();

// Använd för parallax-effekter
const { y } = useParallax(sectionRef, 0.5);

// Använd för mouse-interaktioner
const position = useMousePosition();
```

**Layout Components:**
```typescript
// Bento grid för asymmetriska layouter
<BentoCard span={3}> {/* Tar 3/12 av bredden */}

// Responsiva containers
<Container className="max-w-[1440px]">
```

### Styling-system

**CSS Variables:**
```css
/* Använd för konsistenta färger */
.text-teal       /* #00BFA6 */
.bg-black-secondary /* #121212 */
.glass          /* Glassmorphism effekt */
```

**Responsive Breakpoints:**
```css
/* Mobil-först approach */
px-6 md:px-10 lg:px-20  /* Progressiv padding */
py-20 md:py-32 lg:py-40 /* Progressiv spacing */
```

## 🧪 För Testning (Testprocedurer)

### Automatiserade Tester

```bash
# Kör byggtest
npm run build

# Kör linting
npm run lint

# Kör TypeScript-check
npm run type-check
```

### Manuella Tester

**Cross-browser Testing:**
- [ ] Chrome (desktop + mobil)
- [ ] Firefox (desktop + mobil)
- [ ] Safari (desktop + mobil)
- [ ] Edge (desktop)

**Performance Testing:**
- [ ] Lighthouse score >90 (mobile)
- [ ] Core Web Vitals: Alla "Good"
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <2.5s

**Animation Testing:**
- [ ] Scroll-triggered reveals fungerar
- [ ] Magnetic buttons följer cursor
- [ ] Parallax-effekter är smooth
- [ ] Custom cursor fungerar på desktop

## 🚀 För Deployment (Lanseringsguide)

### Vercel Deployment (Rekommenderat)

**Steg 1: GitHub Setup**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main
```

**Steg 2: Vercel Deployment**
1. Gå till [vercel.com](https://vercel.com)
2. Klicka "New Project"
3. Importera GitHub repository
4. Konfigurera:
   - Framework: Next.js
   - Build Command: `npm run build`

**Steg 3: Environment Variables**
```bash
NEXT_PUBLIC_SITE_URL=https://source.com
ADMIN_SHARED_SECRET=<from-admin-portal>
```

### Domain Konfiguration

**För source.com:**
1. Vercel Project Settings → Domains
2. Lägg till `source.com`
3. Uppdatera DNS records enligt Vercel-instruktioner

## 🔧 Felsökning

### Vanliga Problem

**"Module not found" Error:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

**Build Fails:**
- Kontrollera TypeScript errors: `npm run build`
- Verifiera alla imports är korrekta
- Kontrollera environment variables

**Animationer Fungerar Inte:**
- Kontrollera att Framer Motion är installerat
- Verifiera CSS imports i globals.css
- Testa i olika browsers

**Kontaktformulär Fungerar Inte:**
- Kontrollera ADMIN_SHARED_SECRET i environment
- Verifiera admin portal endpoint fungerar
- Kontrollera network requests i dev tools

## 📋 Checklista Innan Lansering

### Kritiska Uppgifter
- [ ] Kontaktformulär-integration testad
- [ ] Alla bilder ersatta från placeholders
- [ ] SEO metadata komplett
- [ ] Performance >90 Lighthouse
- [ ] Cross-browser testad

### Rekommenderade Uppgifter
- [ ] Team-foton tillagda
- [ ] Portfolio-projektbilder
- [ ] Analytics tracking implementerat
- [ ] Error monitoring (Sentry) setup

---

**Nästa steg:** Se `MASTER-GUIDE.md` för detaljerad teknisk dokumentation
**Support:** Kontrollera komponent-kommentarer för implementations-detaljer
