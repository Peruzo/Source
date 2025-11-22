# Revolut "Full koll på pengarna" Section - Design Analysis

## Overview
This document provides a comprehensive analysis of the "Full koll på pengarna" section from Revolut's website (https://www.revolut.com/sv-SE/revolut-kids-and-teens-parent-and-guardians/) to enable exact replication of the design.

---

## Visual Summary (From Screenshot Analysis)

### Key Visual Characteristics
1. **Dark Theme:** Entire section uses black/dark background with white text
2. **Two-Column Layout:** Image (40-45% width) on left, text content (55-60% width) on right
3. **Image:** Vertical portrait image with significantly rounded corners showing lifestyle photography
4. **Interactive Element:** Dark grey card overlapping bottom-left of image, demonstrating the product
5. **Tab Navigation:** Three rounded buttons below card - white (active) and dark grey (inactive)
6. **Typography:** All white text on dark background for strong contrast
7. **CTA Button:** White button with black text positioned below body text

---

## Section Content
**Heading:** "Full koll på pengarna"

**Body Text:**
"Ge ditt barn verktygen som krävs för att organisera sina pengar med Fickor. Med dessa anpassade underkonton kan de sätta undan pengar för specifika ändamål – oavsett om det handlar om ett par nya hörlurar eller en middag med kompisarna.

Fickor är inga sparkonton och genererar ingen ränta."

---

## 1. Layout Structure

### Overall Layout
- **Layout Type:** Two-column layout (split-screen design)
- **Desktop Layout:** Image on left, text content on right
- **Responsive Behavior:** Layout adapts to mobile (likely stacks vertically on smaller screens)

### Section Dimensions
- **Container Width:** Full viewport width (or constrained to max-width container)
- **Image Column:** Approximately 40-45% of section width
- **Text Column:** Approximately 55-60% of section width
- **Vertical Spacing:** Adequate padding/margin between elements
- **Background:** Black/dark background (#000000 or very dark grey)

---

## 2. Image Placement and Size

### Image Specifications
- **Position:** Left side of the section
- **Width:** Approximately 40-45% of container width
- **Aspect Ratio:** Vertical/portrait orientation (taller than wide)
- **Content:** Two teenagers walking away from viewer toward a body of water (beach/river scene)
  - Person on left: Blue hoodie, black backpack
  - Person on right: White long-sleeved shirt, red shorts, grey bucket hat, black backpack
  - Natural lighting (late afternoon/soft light)
  - Water with small ripples visible
- **Alignment:** Left-aligned within its column
- **Visual Style:** 
  - **Border Radius:** Significantly rounded corners (modern, friendly aesthetic)
  - High-quality photography
  - Natural, lifestyle imagery
  - Takes up substantial portion of section height

### Image Behavior
- **Responsive:** Scales proportionally on different screen sizes
- **Loading:** Optimized for web performance
- **Accessibility:** Should include alt text

---

## 3. Text Placement, Font, and Style

### Text Layout
- **Position:** Right side of the section (opposite the image)
- **Alignment:** Left-aligned text within the right column
- **Vertical Spacing:** 
  - Adequate spacing between heading and body text
  - Comfortable line-height for readability

### Typography - Heading
- **Text:** "Full koll på pengarna"
- **Font Family:** Sans-serif (likely Revolut's brand font - possibly Inter, Roboto, or custom font)
- **Font Weight:** Bold (700 or 800)
- **Font Size:** Large, prominent size (estimated 40-56px on desktop, scales down on mobile)
- **Line Height:** Tighter than body text (approximately 1.2-1.3)
- **Color:** **White (#ffffff)** - stands out prominently on dark background
- **Letter Spacing:** Normal to slightly tight
- **Position:** Vertically aligned with top edge of image

### Typography - Body Text
- **Font Family:** Same sans-serif as heading (consistent brand font)
- **Font Weight:** Regular (400) or Medium (500)
- **Font Size:** Standard readable size (estimated 16-18px on desktop)
- **Line Height:** Comfortable for reading (approximately 1.5-1.6)
- **Color:** **White (#ffffff)** - all text is white on dark background
- **Paragraph Spacing:** Line break separates first and second paragraph
- **Text Style:** 
  - First paragraph: Regular white text
  - Second paragraph (disclaimer): "Fickor är inga sparkonton och genererar ingen ränta." - Same white color, may be slightly smaller

### Call-to-Action Button
- **Text:** "Hjälp dem att öppna en Ficka" (Help them open a Pocket)
- **Position:** Below the body text
- **Style:** White button with rounded corners
- **Text Color:** Black text on white button background
- **Shape:** Rounded corners (modern, friendly aesthetic)

### Text Styling Details
- **Emphasis:** Key phrases may be bolded
- **Disclaimer Text:** "Fickor är inga sparkonton och genererar ingen ränta." - Likely styled differently (smaller font, italic, or different color)

---

## 4. Interactive Card/Slideshow Component

### Card Structure
- **Position:** Overlapping the bottom-left corner of the main image
- **Type:** Dark grey rounded-rectangle card that demonstrates the "Fickor" feature
- **Layout:** Card positioned partially over the image, creating depth and visual interest

### Card Design - "Fickor" View
- **Background:** Dark grey rounded rectangle
- **Border Radius:** Rounded corners (consistent with overall design)
- **Position:** Overlaps bottom-left corner of main image (absolute positioning)
- **Content Structure:** Displays two pocket items in a list format:
  
  1. **"Allmänt" (General)**
     - **Icon:** Orange circular icon/badge with camera-like symbol inside
     - **Text:** "Allmänt" (pocket name)
     - **Amount:** "3 954,12 kr" (3,954.12 SEK) - displayed next to name
     - **Layout:** Icon on left, text and amount on right (horizontal flex layout)
  
  2. **"Strandresa" (Beach trip)**
     - **Icon:** Orange circular icon/badge with white checkmark (indicates active/selected pocket)
     - **Text:** "Strandresa" (pocket name)
     - **Amount:** "1 440 kr" (1,440 SEK) - displayed next to name
     - **Layout:** Icon on left, text and amount on right (horizontal flex layout)
     - **Visual Indicator:** Checkmark suggests this is the currently selected/active pocket

- **Visual Hierarchy:** 
  - Icons: Orange circular badges (likely 40-50px diameter)
  - Text: White/light colored text for readability on dark background
  - Amount: Same color as text, positioned inline with pocket name
- **Spacing:** 
  - Vertical spacing between pocket items
  - Horizontal spacing between icon and text
  - Padding around card edges
- **Typography in Card:**
  - Pocket names: Medium weight, readable size
  - Amounts: Same or similar styling to names

### Navigation Buttons (Tab Interface)
- **Position:** Directly below the interactive card
- **Quantity:** Three buttons arranged horizontally
- **Type:** Tab-style buttons (not circular indicators)
- **Design:**
  - **Shape:** Rounded-corner rectangular buttons
  - **Layout:** Horizontal arrangement with spacing between buttons
  - **Active State:** 
    - **"Fickor" button:** White background with black text (currently active)
  - **Inactive State:**
    - **"Analys" button:** Dark grey background with white text
    - **"Uppgifter" button:** Dark grey background with white text
- **Functionality:**
  - Clickable to switch between different views/features
  - Visual indication of current active tab
  - Smooth transition when clicked
  - Each button represents a different feature view:
    1. **Fickor** - Pockets/sub-accounts (active)
    2. **Analys** - Analysis/insights
    3. **Uppgifter** - Tasks/assignments

### Button Styling Details
- **Active Button ("Fickor"):**
  - Background: White (#ffffff)
  - Text Color: Black (#000000)
  - Border Radius: Rounded corners
- **Inactive Buttons ("Analys", "Uppgifter"):**
  - Background: Dark grey (matches card background)
  - Text Color: White (#ffffff)
  - Border Radius: Rounded corners (same as active)
- **Hover State:** Likely has interactive feedback
- **Spacing:** Evenly distributed with consistent gaps between buttons

---

## 5. Color Scheme

### Color Palette (From Screenshot)
- **Background:** **Black or very dark grey** (#000000 or #0a0a0a)
- **Text Primary (Heading):** **White** (#ffffff)
- **Text Secondary (Body):** **White** (#ffffff)
- **Interactive Card Background:** **Dark grey** (lighter than background, likely #1a1a1a or #2a2a2a)
- **Active Tab Button:** **White** (#ffffff) with **black text** (#000000)
- **Inactive Tab Buttons:** **Dark grey** (same as card) with **white text** (#ffffff)
- **CTA Button:** **White** (#ffffff) with **black text** (#000000)
- **Icon Accent:** **Orange** (for circular icons in the card, likely #FF6B35 or similar)
- **Icon Checkmark:** **White** (#ffffff) on orange icon background

---

## 6. Spacing and Padding

### Section Padding
- **Horizontal Padding:** Adequate padding on left and right (likely 20-40px)
- **Vertical Padding:** Generous top and bottom padding (likely 60-100px)

### Internal Spacing
- **Between Image and Text:** Adequate gap (likely 40-60px) - text column starts aligned with image top
- **Heading to Body Text:** Comfortable spacing (likely 20-30px)
- **Body Text to CTA Button:** Moderate spacing (likely 20-30px)
- **CTA Button to Card:** The interactive card overlaps the image, positioned at bottom-left
- **Card to Navigation Buttons:** Directly below card with minimal spacing (likely 10-20px)

---

## 7. Responsive Design Considerations

### Desktop (1024px+)
- Two-column layout (image left, text right)
- Full-size images
- Larger font sizes
- Horizontal slideshow

### Tablet (768px - 1023px)
- May maintain two-column or switch to stacked
- Adjusted font sizes
- Scaled images

### Mobile (< 768px)
- Single column (stacked layout)
- Image above text or vice versa
- Smaller font sizes
- Full-width slideshow
- Touch-friendly button sizes

---

## 8. Interactive Elements

### Hover States
- Buttons: Visual feedback on hover
- Links: Color change or underline

### Transitions
- Slideshow: Smooth fade or slide animation
- Button clicks: Instant or animated response
- Overall: Subtle, professional animations

---

## 9. Implementation Recommendations

### HTML Structure
```html
<section class="full-koll-section" style="background: #000;">
  <div class="container">
    <div class="content-wrapper">
      <div class="image-column">
        <div class="image-wrapper">
          <img src="..." alt="Two teenagers walking toward water" class="rounded-image">
          <!-- Interactive card overlaps image -->
          <div class="interactive-card">
            <div class="pocket-item">
              <div class="pocket-icon orange-icon">
                <svg><!-- Camera icon --></svg>
              </div>
              <div class="pocket-info">
                <span class="pocket-name">Allmänt</span>
                <span class="pocket-amount">3 954,12 kr</span>
              </div>
            </div>
            <div class="pocket-item active">
              <div class="pocket-icon orange-icon">
                <svg><!-- Icon with checkmark --></svg>
              </div>
              <div class="pocket-info">
                <span class="pocket-name">Strandresa</span>
                <span class="pocket-amount">1 440 kr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-column">
        <h2 class="white-heading">Full koll på pengarna</h2>
        <p class="white-text">Ge ditt barn verktygen som krävs för att organisera sina pengar med Fickor. Med dessa anpassade underkonton kan de sätta undan pengar för specifika ändamål – oavsett om det handlar om ett par nya hörlurar eller en middag med kompisarna.</p>
        <p class="white-text disclaimer">Fickor är inga sparkonton och genererar ingen ränta.</p>
        
        <button class="cta-button">Hjälp dem att öppna en Ficka</button>
        
        <div class="tab-navigation">
          <button class="tab-btn active">Fickor</button>
          <button class="tab-btn">Analys</button>
          <button class="tab-btn">Uppgifter</button>
        </div>
      </div>
    </div>
  </div>
</section>
```

### CSS Key Properties
- **Layout:** Flexbox or Grid for two-column layout
- **Background:** Black/dark background (#000000)
- **Image:** 
  - Rounded corners (border-radius: 20-30px or similar)
  - Vertical/portrait aspect ratio
  - Position: relative (for overlapping card)
- **Text:** All white (#ffffff) on dark background
- **Interactive Card:**
  - Position: absolute (overlapping image bottom-left)
  - Dark grey background
  - Rounded corners
  - Padding for content
- **Tab Buttons:**
  - Active: white background, black text
  - Inactive: dark grey background, white text
  - Rounded corners
  - Horizontal flex layout
- **Responsive units:** rem, em, % for scalability
- **Media queries:** For breakpoints
- **Transitions:** Smooth animations for tab switching
- **Consistent spacing system**

### JavaScript Functionality
- Slideshow navigation
- Button click handlers
- Auto-advance (optional)
- Keyboard navigation (accessibility)

---

## 10. Accessibility Considerations

- Alt text for images
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for slideshow
- Sufficient color contrast
- Focus states for interactive elements

---

## Notes for Implementation

1. **Exact Measurements:** Visit the website and use browser DevTools to get precise measurements
2. **Font Identification:** Use browser DevTools to identify exact font family and weights
3. **Color Values:** Use color picker tools to get exact hex/rgb values
4. **Animation Timing:** Observe transition durations for smooth replication
5. **Breakpoints:** Test responsive behavior at different screen sizes

---

## Next Steps

1. Inspect the live website using browser DevTools
2. Capture exact CSS values (fonts, colors, spacing)
3. Take screenshots at different breakpoints
4. Test interactive elements (slideshow, buttons)
5. Document any additional details not covered here

