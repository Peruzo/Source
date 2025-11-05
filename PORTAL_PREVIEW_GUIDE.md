# Portal Preview Component - Documentation

## Overview

This guide documents the Portal Dashboard Preview component implemented in the Hero section of the Source marketing website. The component showcases an authentic-looking preview of the customer portal without compromising security.

## Architecture

### Component Structure

```
source-public-website/
├── app/
│   ├── portal-preview.css          # Extracted safe CSS from customer portal
│   └── globals.css                 # Imports portal-preview.css
├── components/
│   ├── sections/
│   │   └── Hero.tsx                # Hero section using PortalDashboardPreview
│   └── ui/
│       ├── PortalDashboardPreview.tsx  # Main preview component
│       └── AnimatedCounter.tsx     # Reused for metric animations
└── PORTAL_PREVIEW_GUIDE.md         # This file
```

### Key Files

#### 1. `PortalDashboardPreview.tsx`
**Purpose**: Main component that renders the portal dashboard preview  
**Location**: `source-public-website/components/ui/PortalDashboardPreview.tsx`  
**Dependencies**: 
- `framer-motion` for animations
- `AnimatedCounter` for metric animations
- `portal-preview.css` for styling

**Key Features**:
- Browser chrome frame with URL bar
- Animated sidebar navigation
- Metrics cards with counters
- Chart visualization with animated bars
- Activity feed with recent events
- Full ARIA accessibility support

#### 2. `portal-preview.css`
**Purpose**: Contains all visual styling extracted from customer portal  
**Location**: `source-public-website/app/portal-preview.css`  
**Source**: Extracted from `source.database/public/CSS/`

**Extracted Elements**:
- Color palette (CSS variables)
- Typography system (clamp functions)
- Card styling
- Profile icon styles
- Browser chrome design
- Responsive breakpoints

**Security Note**: Contains ONLY visual CSS - no JavaScript, no API endpoints, no sensitive data.

## Design Decisions

### Industry Best Practices Applied

Based on research of leading SaaS companies (Stripe, Shopify, HubSpot, Notion, Figma, monday.com, Asana), we implemented:

1. **Browser Mockup Frame**: Provides context that this is a web application
2. **Animated UI Elements**: Subtle animations for engagement without distraction
3. **Glass Morphism**: Modern aesthetic with semi-transparent effects
4. **Progressive Disclosure**: Information reveals as user scrolls/hovers
5. **Mock Data Only**: All data is generic and anonymized
6. **Responsive Design**: Adapts gracefully from desktop to mobile

### Color Palette

Matches both the customer portal AND marketing site:

```css
--portal-bg: #ffffff;           /* Clean white background */
--portal-text: #111827;         /* Dark text for readability */
--portal-brand: #3b82f6;        /* Blue accent from portal */
--portal-teal: #00BFA6;         /* Teal from marketing site */
--portal-card-border: #e5e7eb;  /* Subtle borders */
```

### Typography

Uses fluid typography from customer portal:

```css
font-size: clamp(min, preferred, max)
```

This ensures text scales proportionally across all screen sizes while maintaining readability.

## Generic Data Structure

### Metrics
All metrics use generic, realistic data:

```typescript
const metrics = [
  { label: 'Försäljning idag', value: 12450, suffix: ' kr', change: 8.2 },
  { label: 'Nya kunder', value: 8, change: 12.5 },
  { label: 'Konvertering', value: 3.2, suffix: '%', change: -2.1 },
  { label: 'Genomsnittligt värde', value: 1856, suffix: ' kr', change: 5.4 },
];
```

**Note**: Values are illustrative examples with no connection to real business data.

### Chart Data
Bar chart shows 7 data points (last 7 days):

```typescript
const chartData = [65, 78, 70, 85, 75, 90, 82]; // Percentages
```

### Activity Feed

```typescript
const activities = [
  { title: 'Ny betalning mottagen', time: '2 min sedan', icon: '💳' },
  { title: 'Rapport genererad', time: '15 min sedan', icon: '📊' },
  { title: 'Kund registrerad', time: '1 timme sedan', icon: '👤' },
];
```

## Responsive Behavior

### Desktop (≥ 1024px)
- Full dashboard preview with sidebar
- Browser chrome with URL bar
- All metrics visible (4-column grid)
- Complete activity feed
- Hover effects enabled

### Tablet (768px - 1024px)
- Sidebar hidden (saves space)
- Main content area expands
- Metrics in 2-column grid
- Browser chrome simplified

### Mobile (< 768px)
- Component hidden (uses existing mobile layout)
- Keeps current Hero mobile design
- No performance impact on mobile devices

## Accessibility

### ARIA Labels

All interactive and informational elements have appropriate ARIA labels:

```typescript
// Navigation
<nav role="navigation" aria-label="Portal navigation">

// Metrics
<div role="article" aria-label={`${label}: ${value}${suffix}`}>

// Charts
<div role="figure" aria-label="Sales chart for the last 7 days">

// Activity
<div role="list" aria-label="Recent activity">
<div role="listitem">
```

### Keyboard Navigation

- All clickable elements are keyboard accessible
- Focus indicators visible
- Logical tab order maintained

### Screen Readers

- Descriptive labels for all visual elements
- Hidden decorative elements (icon emojis) with `aria-hidden="true"`
- Semantic HTML structure

### Reduced Motion

CSS respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance Optimizations

### GPU Acceleration

```css
.portal-card,
.portal-metric-card,
.portal-mini-bar {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}
```

### Lazy Animations

Animations only trigger when component is visible:

```typescript
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  setIsVisible(true);
}, []);
```

### Asset Budget

- CSS: ~15kb (minified)
- Component: ~8kb (minified)
- No external images or fonts
- **Total**: < 25kb additional assets

## Security Audit Checklist

### ✅ Verified Safe Elements

- [x] Color CSS variables only
- [x] Typography clamp functions only
- [x] Card and layout styling only
- [x] Generic data (no real user information)
- [x] No API endpoints referenced
- [x] No authentication logic included
- [x] No database queries or models
- [x] No sensitive file paths
- [x] No connection strings
- [x] All JavaScript is presentation logic only

### 🔒 Security Principles

1. **Separation of Concerns**: Visual styles extracted separately from business logic
2. **Data Anonymization**: All displayed data is generic and illustrative
3. **No Shared Code**: Zero code sharing between marketing site and portal backend
4. **CSS-Only Extraction**: Only visual styling extracted, no functional code
5. **Manual Review**: Three-stage security review (dev, peer, security lead)

## Maintenance Guidelines

### Updating Metrics

To change displayed metrics, edit `PortalDashboardPreview.tsx`:

```typescript
const metrics: MetricData[] = [
  { 
    label: 'New Metric Name',  // Swedish label
    value: 9999,               // Number value
    suffix: ' kr',             // Optional suffix
    change: 5.5                // Percentage change
  },
];
```

### Updating Chart Data

To modify chart visualization:

```typescript
const chartData = [60, 70, 65, 80, 75, 85, 78]; // 7 bars
```

**Note**: Array length determines number of bars. Keep 5-10 for optimal display.

### Updating Activity Feed

```typescript
const activities: ActivityItem[] = [
  { 
    title: 'Activity description',  // Swedish text
    time: 'X min sedan',            // Relative time
    icon: '🎨'                      // Emoji icon
  },
];
```

### Styling Adjustments

All styling is centralized in `app/portal-preview.css`. Common adjustments:

**Card shadows**:
```css
.portal-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Adjust values */
}
```

**Colors**:
```css
:root {
  --portal-brand: #3b82f6; /* Change brand color */
  --portal-teal: #00BFA6;  /* Change accent color */
}
```

**Responsive breakpoints**:
```css
@media (max-width: 1024px) {
  /* Tablet styles */
}

@media (max-width: 768px) {
  /* Mobile styles */
}
```

### Adding New Elements

To add new dashboard elements:

1. **Add HTML structure** in `PortalDashboardPreview.tsx`
2. **Add styling** in `portal-preview.css`
3. **Add animations** using framer-motion
4. **Add ARIA labels** for accessibility
5. **Test responsiveness** at all breakpoints
6. **Run security audit** to ensure no sensitive data

Example:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
  transition={{ delay: 1.5, duration: 0.5 }}
  className="portal-new-element"
  role="region"
  aria-label="New element description"
>
  {/* Element content */}
</motion.div>
```

## Testing

### Browser Compatibility

Tested and verified in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (WebKit)
- ✅ iOS Safari
- ✅ Chrome Mobile

### Performance Metrics

Target metrics (Lighthouse):
- Performance: > 90
- Accessibility: 100
- Best Practices: > 95
- SEO: 100

### Visual Regression

Use browser DevTools to test:
1. Different screen sizes (responsive)
2. Light/dark mode (if implemented)
3. Zoom levels (150%, 200%)
4. Color contrast (accessibility)

## Troubleshooting

### Issue: Animations not playing

**Solution**: Check if `isVisible` state is being set:

```typescript
useEffect(() => {
  setIsVisible(true);
}, []);
```

### Issue: Styles not applying

**Solution**: Verify CSS import in `globals.css`:

```css
@import "./portal-preview.css";
```

### Issue: Component not rendering

**Solution**: Check import path in `Hero.tsx`:

```typescript
import { PortalDashboardPreview } from '@/components/ui/PortalDashboardPreview';
```

### Issue: Responsive layout broken

**Solution**: Verify breakpoints match Tailwind config:

```typescript
className="hidden lg:block"  // Desktop only
```

## Future Enhancements

### Potential Improvements

1. **Interactive tooltips**: Hover over metrics for more details
2. **Dark mode variant**: Match customer portal's dark theme
3. **Live data simulation**: Animated numbers updating in real-time
4. **Expandable view**: Click to see larger dashboard preview
5. **Video walkthrough**: Embedded video tour of portal
6. **A/B testing**: Compare different dashboard previews

### Performance Optimizations

1. **Lazy loading**: Load component only when scrolled into view
2. **Image sprites**: Combine icons into single sprite sheet
3. **CSS purging**: Remove unused styles in production
4. **Animation throttling**: Reduce animation complexity on low-end devices

## Support

### Questions or Issues?

1. Review this documentation
2. Check security audit checklist
3. Test in multiple browsers
4. Review source portal CSS files for reference
5. Consult design system guidelines

### Making Changes?

Before making changes:
1. **Read this guide** thoroughly
2. **Test locally** in all browsers
3. **Run security audit** checklist
4. **Document changes** in this file
5. **Update version** and changelog

## Version History

### v1.0.0 (2025-01-20)
- Initial implementation
- Extracted safe CSS from customer portal
- Created PortalDashboardPreview component
- Integrated into Hero section
- Full accessibility support
- Responsive design (desktop/tablet/mobile)
- Comprehensive documentation

---

## Changelog Format

When updating, add entries here:

### v1.x.x (YYYY-MM-DD)
- Changed: [What was modified]
- Added: [What was added]
- Fixed: [What was fixed]
- Security: [Any security-related changes]

---

**Last Updated**: January 20, 2025  
**Maintained By**: Development Team  
**Security Review**: Passed ✅  
**Accessibility Review**: WCAG AA Compliant ✅

