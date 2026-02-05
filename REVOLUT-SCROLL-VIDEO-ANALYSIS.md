# Analys: Revolut – "En introduktion till flexibla penningfonder" (scroll-styrd sektion)

## Källa
- **Sida:** https://www.revolut.com/sv-SE/flexible-cash-funds/
- **Sektion:** Rubriken "En introduktion till flexibla penningfonder" och den full-width visuella blocket under.

## Teknisk uppbyggnad (Revolut)

### Struktur
- **Wrapper:** En `<section>` med relativ position och stor höjd (ca 830px+ i inspekterat fall).
- **Inre layout:** Ett absolut positionerat block som innehåller:
  - `will-change: transform`
  - `transform: translateY(0px)` – värdet uppdateras troligen via scroll.
- **Media:** Revolut använder **inte** en HTML5-video i denna sektion. De använder en **bildsekvens** levererad via `<picture>` med flera källor:
  - `srcset` med 1080w, 2048w, 3840w (WebP).
  - En `<img>` som visar den aktuella bilden.

### Scroll-styrning (antagande utifrån DOM)
- Scrollposition mappas till ett `translateY`-värde (eller liknande) så att antingen:
  - olika delar av en hög bild visas, eller
  - olika bilder i en sekvens byts ut.
- Full-width: innehållet är full viewport-bredd och fyller höjden (t.ex. via aspect-ratio eller fast höjd).

### Positionering
- Den visuella containern är **absolut** positionerad inom sectionen.
- Sectionen har tillräcklig höjd för att användaren ska kunna scrolla och därmed styra animationen.

## Vår implementation (Tjänster-sidan)

Vi har valt **scroll-styrd video** istället för bildsekvens:

1. **Sektion:** En wrapper med höjd `200vh` (mobil) / `250vh` (desktop) så att det finns tillräckligt med scrollutrymme.
2. **Sticky video:** Inuti en `position: sticky; top: 0`-container så att videon ligger kvar i viewport medan användaren scrollar genom sektionen.
3. **Scroll → currentTime:** Linjär mappning:
   - `scrollProgress = clamp(-rect.top / (rect.height - window.innerHeight), 0, 1)`
   - `video.currentTime = scrollProgress * video.duration`
4. **Ingen autoplay:** Video är `muted`, `playsInline`, `preload="auto"`, utan autoplay. Endast `currentTime` uppdateras vid scroll.
5. **requestAnimationFrame:** Scroll-hanteraren körs via `requestAnimationFrame` för att hålla uppdateringar synkade med rullning.
6. **Fallback:** Om `video.duration` inte är giltig sätts `useFallback` och videon visas statiskt (första frame) utan scroll-styrning.

Detta ger en premium, linjär scroll-upplevelse där scrollhjulet styr videons tidslinje direkt, i linje med målsättningen.
