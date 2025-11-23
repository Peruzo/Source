# Revolut Section - Quick Visual Reference Guide

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    BLACK BACKGROUND                          │
│                                                               │
│  ┌──────────────┐      ┌──────────────────────────────┐    │
│  │              │      │  FULL KOLL PÅ PENGARNA       │    │
│  │              │      │  (White, Bold, Large)         │    │
│  │   IMAGE      │      │                               │    │
│  │  (40-45%)    │      │  Body text paragraph 1       │    │
│  │              │      │  (White text)                │    │
│  │  Rounded     │      │                               │    │
│  │  Corners     │      │  Body text paragraph 2       │    │
│  │              │      │  (White text, disclaimer)    │    │
│  │              │      │                               │    │
│  │  ┌─────────┐ │      │  [Hjälp dem att öppna...]   │    │
│  │  │ CARD    │ │      │  (White button, black text)  │    │
│  │  │(overlap)│ │      │                               │    │
│  │  │ Dark    │ │      │  [Fickor] [Analys] [Uppgift]│    │
│  │  │ Grey    │ │      │  (White) (Grey)  (Grey)     │    │
│  │  └─────────┘ │      │                               │    │
│  └──────────────┘      └──────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Color Palette

| Element | Color | Hex Code (Estimated) |
|---------|-------|---------------------|
| Background | Black | #000000 |
| Heading Text | White | #ffffff |
| Body Text | White | #ffffff |
| Interactive Card | Dark Grey | #1a1a1a or #2a2a2a |
| Active Tab Button | White | #ffffff |
| Active Tab Text | Black | #000000 |
| Inactive Tab Button | Dark Grey | #1a1a1a or #2a2a2a |
| Inactive Tab Text | White | #ffffff |
| CTA Button | White | #ffffff |
| CTA Button Text | Black | #000000 |
| Icon Background | Orange | #FF6B35 (or similar) |
| Icon Checkmark | White | #ffffff |

## Typography Hierarchy

```
Heading: "Full koll på pengarna"
├── Font: Sans-serif (Bold)
├── Size: Large (40-56px desktop)
├── Color: White (#ffffff)
└── Weight: 700-800

Body Text
├── Font: Sans-serif (Regular/Medium)
├── Size: Standard (16-18px desktop)
├── Color: White (#ffffff)
└── Weight: 400-500

Button Text
├── Font: Sans-serif
├── Size: Medium (16-18px)
├── Color: Black (#000000) on white button
└── Weight: 500-600
```

## Interactive Card Structure

```
┌─────────────────────────────┐
│  Dark Grey Rounded Card     │
│                             │
│  ┌───┐  Allmänt  3 954,12 kr│
│  │ 🎥 │                     │
│  └───┘                     │
│                             │
│  ┌───┐  Strandresa  1 440 kr│
│  │ ✓ │                     │
│  └───┘                     │
│                             │
└─────────────────────────────┘
     ↓
[Fickor] [Analys] [Uppgifter]
 White    Grey     Grey
```

## Component Specifications

### Image
- **Width:** 40-45% of container
- **Aspect Ratio:** Vertical/Portrait
- **Border Radius:** Large (20-30px)
- **Content:** Lifestyle photography
- **Position:** Left column

### Text Column
- **Width:** 55-60% of container
- **Alignment:** Left-aligned
- **Vertical Alignment:** Top-aligned with image
- **Background:** Transparent (shows black background)

### Interactive Card
- **Position:** Absolute (overlaps image bottom-left)
- **Background:** Dark grey
- **Border Radius:** Rounded corners
- **Content:** Two pocket items with icons
- **Icons:** Orange circular badges

### Tab Buttons
- **Layout:** Horizontal flex
- **Shape:** Rounded rectangles
- **Active:** White bg, black text
- **Inactive:** Dark grey bg, white text
- **Spacing:** Evenly distributed

## Spacing System (Estimated)

- **Section Padding:** 60-100px vertical, 40-60px horizontal
- **Image-Text Gap:** 40-60px
- **Heading-Body Gap:** 20-30px
- **Body-CTA Gap:** 20-30px
- **Card-Buttons Gap:** 10-20px
- **Button Spacing:** 10-15px between buttons

## Responsive Behavior

### Desktop (>1024px)
- Two-column layout
- Image left, text right
- Card overlaps image
- Full-size typography

### Tablet (768-1024px)
- May maintain two-column or stack
- Adjusted spacing
- Scaled typography

### Mobile (<768px)
- Single column (stacked)
- Image above or below text
- Card may reposition
- Smaller typography
- Full-width buttons

## Key Design Principles

1. **Dark Theme:** Black background creates modern, premium feel
2. **High Contrast:** White text on black ensures readability
3. **Rounded Corners:** Soft, friendly aesthetic throughout
4. **Overlapping Elements:** Card on image creates depth
5. **Visual Hierarchy:** Large heading, readable body, clear CTA
6. **Interactive Feedback:** Tab buttons clearly show active state
7. **Lifestyle Imagery:** Natural, relatable photography
8. **Product Demo:** Card shows actual product interface


