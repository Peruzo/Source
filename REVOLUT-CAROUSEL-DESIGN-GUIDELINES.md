# Design Guidelines: Auto-scrolling Feature Carousel Section
## Analys av Revolut "Självständighet för dina barn, lugn och ro för dig" sektion

**Källa:** https://www.revolut.com/sv-SE/revolut-kids-and-teens-parent-and-guardians/  
**Datum:** 2 februari 2026

---

## Översikt

Detta dokument beskriver designen och funktionaliteten för en auto-scrollande feature carousel-sektion med bilder och överlagrad text, baserat på Revoluts implementation.

---

## 1. Struktur och Layout

### 1.1 Huvudcontainer
- **Layout:** Två-kolumns layout på desktop (text vänster, carousel höger)
- **Responsivitet:** Stackad vertikalt på mobil
- **Padding:** Generös padding runt hela sektionen
- **Max-width:** Begränsad bredd för läsbarhet

### 1.2 Text-sektion (Vänster sida)
```
┌─────────────────────────────┐
│ H2: Rubrik                  │
│                              │
│ Paragraph: Beskrivande text │
│                              │
│ [CTA Button]                 │
└─────────────────────────────┘
```

**Specifikationer:**
- **Rubrik (H2):** Stor, fet, centrerad eller vänsterjusterad
- **Text:** Standard vikt, läsbar radlängd
- **CTA Button:** Mörk bakgrund (#000 eller liknande), vit text, avrundade hörn (~8-12px border-radius)

---

## 2. Carousel-komponent

### 2.1 Carousel Container
- **Display:** Block eller flex
- **Overflow:** Visible (för att visa flera kort samtidigt)
- **Gap:** Normal spacing mellan kort
- **Scroll-behavior:** Smooth transitions

### 2.2 Feature Cards (Kort)

Varje kort består av:
1. **Bakgrundsbild** (240px × 339px baserat på analys)
2. **Text overlay** placerad ovanpå bilden
3. **Bakgrundsfärg** som overlay eller bakgrund

**Card-specifikationer:**
- **Storlek:** ~240px bredd × 339px höjd (kan variera)
- **Border-radius:** Avrundade hörn (~16-24px)
- **Box-shadow:** Subtila skuggor för djup
- **Padding:** Intern padding för text (~20-40px)
- **Display:** Flexbox för text-positionering
- **Flex-direction:** Column (vertikal)
- **Align-items:** Flex-start eller center
- **Justify-content:** Flex-end eller center (för text i botten)

**Bakgrundsfärger (exempel från Revolut):**
- Ljus lila/lavendel: `#E8E0F5` eller liknande
- Mörkgrå: `#2C2C2C` eller liknande
- Ljusblå: `#E0F0FF` eller liknande
- Gul/beige: `#FFF8E0` eller liknande
- Brun/orange: `#F5E6D3` eller liknande

**Text-styling:**
- **Färg:** Vit eller mörk (beroende på bakgrund)
- **Font-size:** ~16-20px (responsiv)
- **Font-weight:** Medium till Bold
- **Line-height:** 1.2-1.4
- **Position:** Överlagrad på bilden, vanligtvis i botten eller centrerad

### 2.3 Bildhantering

**Bild-specifikationer:**
- **Format:** PNG eller WebP för kvalitet
- **Storlek:** 240px × 339px (kan skalas responsivt)
- **Position:** Bakgrund eller som `<img>` element
- **Object-fit:** Cover för att behålla proportioner
- **Alt-text:** Beskrivande alt-text för tillgänglighet

**Text-overlay teknik:**
- Använd `position: absolute` för text över bild
- Eller använd CSS `background-image` med `linear-gradient` overlay
- Eller använd en wrapper div med bild som bakgrund och text som child

---

## 3. Auto-scroll Funktionalitet

### 3.1 Scroll-mekanism
- **Typ:** Automatisk horisontell scroll
- **Intervall:** ~5 sekunder mellan varje scroll (baserat på observation)
- **Animation:** Smooth scroll transition
- **Loop:** Oändlig loop (går tillbaka till början efter sista kortet)

### 3.2 Implementation (JavaScript)

```javascript
// Pseudokod för auto-scroll
let currentIndex = 0;
const scrollInterval = 5000; // 5 sekunder
const cardWidth = 240; // eller dynamisk
const gap = 16; // gap mellan kort

function autoScroll() {
  const carousel = document.querySelector('.carousel-container');
  const cards = carousel.querySelectorAll('.feature-card');
  
  currentIndex = (currentIndex + 1) % cards.length;
  
  const scrollPosition = currentIndex * (cardWidth + gap);
  carousel.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  });
  
  // Uppdatera aktiva tab-indikator
  updateTabIndicator(currentIndex);
}

// Starta auto-scroll
const intervalId = setInterval(autoScroll, scrollInterval);

// Pausa vid hover/interaktion
carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
carousel.addEventListener('mouseleave', () => {
  intervalId = setInterval(autoScroll, scrollInterval);
});
```

### 3.3 Pausning och Interaktion
- **Paus vid hover:** Auto-scroll pausas när användaren hovrar över carousel
- **Manuell navigation:** Användare kan klicka på tab-indikatorer för att hoppa till specifikt kort
- **Touch/swipe:** Stöd för swipe-gester på mobil

---

## 4. Tab-indikatorer (Pagination)

### 4.1 Design
- **Typ:** Små cirkulära dots
- **Storlek:** 6px × 6px
- **Border-radius:** 9999px (perfekt cirkel)
- **Bakgrundsfärg (inaktiv):** `rgb(141, 150, 158)` (#8D969E)
- **Bakgrundsfärg (aktiv):** Mörkare färg eller primärfärg
- **Gap:** Normal spacing mellan dots
- **Position:** Under carousel, centrerad

### 4.2 Layout
- **Display:** Flex eller inline-flex
- **Justify-content:** Center
- **Gap:** ~8-12px mellan dots
- **Margin:** Top margin för spacing från carousel

### 4.3 Interaktivitet
- **Klickbar:** Varje dot är klickbar och hoppar till motsvarande kort
- **Aktiv state:** Visuell indikator för vilket kort som är aktivt
- **ARIA:** Använd `role="tablist"` och `role="tab"` för tillgänglighet

---

## 5. Responsiv Design

### 5.1 Desktop (> 1024px)
- Två-kolumns layout
- 5 kort synliga samtidigt (eller fler beroende på skärmstorlek)
- Full carousel-funktionalitet

### 5.2 Tablet (768px - 1024px)
- Två-kolumns layout behålls eller stackas
- 3-4 kort synliga
- Touch-gester aktiverade

### 5.3 Mobil (< 768px)
- Stackad layout (text ovanför carousel)
- 1-2 kort synliga
- Swipe-gester för navigation
- Touch-friendly tab-indikatorer (större klickområde)

---

## 6. CSS Implementation Exempel

```css
/* Huvudcontainer */
.feature-section {
  display: flex;
  flex-direction: row;
  gap: 48px;
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .feature-section {
    flex-direction: column;
    padding: 40px 16px;
  }
}

/* Text-sektion */
.feature-text {
  flex: 1;
}

.feature-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
}

.feature-text p {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 32px;
  color: #333;
}

.feature-cta {
  background-color: #000;
  color: #fff;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: opacity 0.2s;
}

.feature-cta:hover {
  opacity: 0.9;
}

/* Carousel container */
.carousel-container {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.carousel-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* Feature card */
.feature-card {
  position: relative;
  min-width: 240px;
  width: 240px;
  height: 339px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feature-card-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

/* Alternativ: Bakgrundsfärg istället för bild */
.feature-card-colored {
  background-color: var(--card-bg-color);
  display: flex;
  align-items: flex-end;
  padding: 24px;
}

.feature-card-colored .feature-card-text {
  position: static;
  background: none;
  color: var(--card-text-color);
}

/* Tab indicators */
.tab-list {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  list-style: none;
  padding: 0;
}

.tab-item {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background-color: #8D969E;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.tab-item:hover {
  transform: scale(1.2);
}

.tab-item.active {
  background-color: #000;
  width: 24px; /* Eller behåll 6px för konsistent design */
  border-radius: 3px;
}
```

---

## 7. JavaScript Implementation Exempel

```javascript
class AutoScrollCarousel {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.cards = this.container.querySelectorAll('.feature-card');
    this.tabs = document.querySelectorAll('.tab-item');
    this.currentIndex = 0;
    this.interval = options.interval || 5000;
    this.autoScrollEnabled = true;
    this.scrollInterval = null;
    
    this.init();
  }
  
  init() {
    if (!this.container || this.cards.length === 0) return;
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start auto-scroll
    this.startAutoScroll();
  }
  
  setupEventListeners() {
    // Pause on hover
    this.container.addEventListener('mouseenter', () => {
      this.pauseAutoScroll();
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.startAutoScroll();
    });
    
    // Tab clicks
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    this.container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }
  
  startAutoScroll() {
    if (!this.autoScrollEnabled) return;
    
    this.scrollInterval = setInterval(() => {
      this.nextSlide();
    }, this.interval);
  }
  
  pauseAutoScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }
  
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.scrollToSlide(this.currentIndex);
  }
  
  previousSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.scrollToSlide(this.currentIndex);
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.scrollToSlide(index);
    this.pauseAutoScroll();
    setTimeout(() => this.startAutoScroll(), 2000); // Resume after 2 seconds
  }
  
  scrollToSlide(index) {
    const card = this.cards[index];
    if (!card) return;
    
    const cardWidth = card.offsetWidth;
    const gap = 16; // CSS gap value
    const scrollPosition = index * (cardWidth + gap);
    
    this.container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    this.updateTabIndicator(index);
  }
  
  updateTabIndicator(index) {
    this.tabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new AutoScrollCarousel('.carousel-container', {
    interval: 5000 // 5 seconds
  });
});
```

---

## 8. Tillgänglighet (Accessibility)

### 8.1 ARIA-attribut
```html
<div class="carousel-container" role="region" aria-label="Feature carousel">
  <div class="feature-card" role="group" aria-label="Feature 1">
    <!-- Card content -->
  </div>
</div>

<ul class="tab-list" role="tablist" aria-label="Carousel navigation">
  <li role="tab" aria-selected="true" aria-controls="card-1">Page 1</li>
  <li role="tab" aria-selected="false" aria-controls="card-2">Page 2</li>
  <!-- ... -->
</ul>
```

### 8.2 Keyboard Navigation
- **Tab:** Navigera mellan tab-indikatorer
- **Enter/Space:** Aktivera vald tab
- **Arrow keys:** Navigera mellan kort (vänster/höger)

### 8.3 Screen Reader Support
- Beskrivande labels för alla interaktiva element
- Live regions för att meddela scroll-ändringar
- Alt-text för alla bilder

---

## 9. Performance Optimering

### 9.1 Bildoptimering
- Använd WebP-format med fallback
- Lazy loading för bilder utanför viewport
- Responsive images med `srcset`

### 9.2 JavaScript Optimering
- Debounce/throttle scroll events
- Använd `requestAnimationFrame` för smooth animations
- Cleanup intervals vid unmount

### 9.3 CSS Optimering
- Använd `will-change` för animerade element
- GPU-accelererade transforms (`transform` istället för `left/top`)
- Minimera repaints och reflows

---

## 10. Content Guidelines

### 10.1 Text-längd
- **Kort text:** Max 2-3 rader per kort
- **Font-size:** Minst 16px för läsbarhet
- **Kontrast:** Minst 4.5:1 kontrastratio (WCAG AA)

### 10.2 Bildval
- Högkvalitativa bilder med tydligt fokus
- Konsistent bildstorlek och proportioner
- Bilder som kompletterar texten, inte distraherar

### 10.3 Antal kort
- **Rekommenderat:** 5-7 kort för optimal UX
- **Minimum:** 3 kort
- **Maximum:** 10 kort (annars blir det för mycket)

---

## 11. Färgpalett (Exempel)

Baserat på Revoluts implementation:

```css
:root {
  /* Card backgrounds */
  --card-bg-lavender: #E8E0F5;
  --card-bg-dark-gray: #2C2C2C;
  --card-bg-light-blue: #E0F0FF;
  --card-bg-yellow: #FFF8E0;
  --card-bg-brown: #F5E6D3;
  
  /* Text colors */
  --text-dark: #1A1A1A;
  --text-light: #FFFFFF;
  --text-gray: #8D969E;
  
  /* CTA */
  --cta-bg: #000000;
  --cta-text: #FFFFFF;
}
```

---

## 12. Testning Checklista

- [ ] Auto-scroll fungerar korrekt
- [ ] Paus vid hover fungerar
- [ ] Tab-indikatorer uppdateras korrekt
- [ ] Klick på tabs fungerar
- [ ] Touch/swipe fungerar på mobil
- [ ] Keyboard navigation fungerar
- [ ] Screen reader läser korrekt
- [ ] Responsiv design på alla breakpoints
- [ ] Bilder laddas korrekt
- [ ] Performance är acceptabel (60fps)
- [ ] Ingen layout shift vid scroll
- [ ] Tillgänglighetstest (WCAG AA)

---

## 13. Ytterligare Förbättringar

### 13.1 Avancerade Features
- **Fade transitions:** Smooth fade mellan kort
- **Parallax effect:** Subtila parallax-effekter på bilder
- **Progress bar:** Visuell indikator för scroll-progress
- **Pause button:** Explicit pause/play-knapp

### 13.2 Analytics
- Spåra vilka kort som visas mest
- Mät tid på varje kort
- Spåra klick på kort och tabs

---

## 14. Referenser

- **Original URL:** https://www.revolut.com/sv-SE/revolut-kids-and-teens-parent-and-guardians/
- **Analysdatum:** 2 februari 2026
- **Teknologier:** HTML5, CSS3, JavaScript (ES6+)
- **Framework:** Kan implementeras i React, Vue, Next.js, etc.

---

## 15. Implementation Notes

### 15.1 React Exempel (Struktur)
```tsx
interface FeatureCard {
  id: string;
  image: string;
  text: string;
  backgroundColor?: string;
}

const FeatureCarousel: React.FC<{ cards: FeatureCard[] }> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [cards.length]);
  
  return (
    <div className="feature-section">
      {/* Text section */}
      <div className="feature-text">
        <h2>Rubrik</h2>
        <p>Beskrivning</p>
        <a href="#" className="feature-cta">CTA</a>
      </div>
      
      {/* Carousel */}
      <div className="carousel-container">
        {cards.map((card, index) => (
          <div key={card.id} className="feature-card">
            <img src={card.image} alt={card.text} />
            <div className="feature-card-text">{card.text}</div>
          </div>
        ))}
      </div>
      
      {/* Tabs */}
      <ul className="tab-list" role="tablist">
        {cards.map((_, index) => (
          <li
            key={index}
            role="tab"
            className={`tab-item ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </ul>
    </div>
  );
};
```

---

## Slutsats

Denna design kombinerar visuellt tilltalande kort med smooth auto-scroll funktionalitet för att skapa en engagerande användarupplevelse. Genom att följa dessa guidelines kan du skapa en exakt liknande implementation som Revoluts sektion.

**Viktiga takeaways:**
1. Auto-scroll med 5 sekunders intervall
2. Paus vid hover för bättre UX
3. Tab-indikatorer för manuell navigation
4. Responsiv design för alla enheter
5. Tillgänglighet och performance i fokus

---

*Dokument skapat: 2 februari 2026*  
*För vidare instruktioner, vänta på nästa steg.*
