# Content Replacement Guide

## Quick Reference: What to Replace

This guide shows exactly where to replace placeholder content with real content.

## Priority 1: Critical Visuals

### Hero Section Dashboard
**File**: `components/sections/Hero.tsx`
**Lines**: 56-114
**Replace**: Simulated dashboard with gray boxes
**With**: Actual animated dashboard mockup or video

**How to replace**:
1. Create high-quality dashboard screenshot (1920x1080)
2. Or create Lottie animation of dashboard
3. Replace the glass card content with:
```tsx
<Image
  src="/images/dashboard-preview.png"
  alt="Source AI Dashboard"
  width={800}
  height={600}
  className="rounded-2xl"
/>
```

### Service Section Visuals
**File**: `components/sections/WhatWeDo.tsx`
**Lines**: Look for "Image placeholder"
**Replace**: Gray glass cards with numbers
**With**: Actual screenshots of each service

**Services needing screenshots**:
1. E-commerce UI (Product page, checkout)
2. Analytics Dashboard (Real insights panel)
3. Payment integration screen
4. Support portal interface

### Portfolio Projects
**File**: `components/sections/PortfolioTeaser.tsx`
**Lines**: 52-168
**Replace**: Gradient boxes with numbers
**With**: Actual project screenshots

**Projects to add**:
1. Fashion Store (replace gradient-gray-800)
2. SaaS Platform (replace gradient-gray-700)
3. Restaurant (replace gradient-gray-600)

## Priority 2: Metrics & Numbers

### Animated Counters

#### Value Proposition
**File**: `components/sections/ValueProposition.tsx`
**Line**: 47
```tsx
<AnimatedCounter end={180} suffix="%" />
```
**Update**: Replace 180 with actual average improvement percentage

#### Portal Preview
**File**: `components/sections/PortalPreview.tsx`
**Lines**: 35-39
```tsx
const stats = [
  { value: 99.9, suffix: '%', label: 'Uptime' },
  { value: 24, suffix: '/7', label: 'Support' },
  { value: 50, suffix: '+', label: 'Integrationer' },
];
```
**Update**: Replace with actual stats

### Hero Metrics
**Update all placeholder metrics** in components with real data:
- Traffic increases
- Conversion improvements
- Customer satisfaction scores
- Response times

## Priority 3: Team & Company Info

### About Page
**File**: `app/om-oss/page.tsx`
**Add**:
1. Founder photos (circular, 250px)
2. Founder names and bios
3. Company story details
4. Workspace photos

### Contact Information
**Files**: All footer instances
**Verify**:
- Email: help@source.com ✓
- Phone: +46 73 322 12 12 ✓
- Address: (add if physical office exists)

## How to Add Real Images

### Step 1: Optimize Images
```bash
# Recommended sizes
Hero dashboard: 1600x1000px, WebP format
Service screenshots: 1200x900px, WebP format
Portfolio projects: 1200x800px, WebP format
Team photos: 500x500px (circular crop), WebP format
```

### Step 2: Add to Public Folder
```
public/
  images/
    dashboard/
      hero-dashboard.webp
      analytics-panel.webp
    services/
      ecommerce-ui.webp
      payment-integration.webp
    portfolio/
      fashion-store.webp
      saas-platform.webp
      restaurant.webp
    team/
      founder-1.webp
      founder-2.webp
      founder-3.webp
```

### Step 3: Update Components

#### Example: Replace Hero Dashboard
**In `components/sections/Hero.tsx`**, replace the glass card content (lines 56-114) with:

```tsx
<div className="relative rounded-3xl overflow-hidden border border-white/10">
  <Image
    src="/images/dashboard/hero-dashboard.webp"
    alt="Source AI Dashboard showing real-time insights"
    width={800}
    height={600}
    className="w-full h-auto"
    priority
  />
  
  {/* Optional: Add floating insight cards on top */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5 }}
    className="absolute bottom-4 right-4 glass-light rounded-xl p-4 max-w-xs"
  >
    <p className="text-sm text-white">
      <strong className="text-teal">AI Insight:</strong> 80% lämnar vid checkout...
    </p>
  </motion.div>
</div>
```

#### Example: Replace Service Visuals
**In `components/sections/WhatWeDo.tsx`**, find the glass placeholder cards and replace with:

```tsx
<Image
  src={`/images/services/${service.id}.webp`}
  alt={service.title}
  width={600}
  height={450}
  className="rounded-2xl w-full h-auto"
/>
```

## Current Placeholders to Replace

### Homepage
1. ✅ Hero dashboard mockup (lines 56-114 in Hero.tsx)
2. ✅ Service section visuals (4 images in WhatWeDo.tsx)
3. ✅ Portfolio project images (3 images in PortfolioTeaser.tsx)

### Services Page
1. Service screenshots (5 images needed)
2. AI-analys dashboard example

### Portfolio Page
1. All project images
2. Project detail screenshots (4 per project)

### About Page
1. Team photos (3 founders)
2. Company workspace photos
3. "Behind the scenes" images

## Animation Customization

### Adjust Animation Speed
All animations use consistent timing. To adjust globally:

**In components, look for**:
```tsx
transition={{ duration: 0.8, delay: 0.2 }}
```

**Speed up**: Reduce duration to 0.4-0.6
**Slow down**: Increase duration to 1.0-1.2

### Disable Animations (if needed)
Add this to `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing Real Content

### Before Adding Images
1. Ensure images are optimized (< 200KB each)
2. Convert to WebP format
3. Create 1x and 2x versions for retina

### After Adding Images
1. Run Lighthouse audit
2. Check First Contentful Paint < 1.8s
3. Verify Largest Contentful Paint < 2.5s
4. Test on mobile 3G connection

## Common Issues & Solutions

### Custom Cursor Not Showing
- Check that you're on desktop (hidden on mobile/tablet)
- Verify `body { cursor: none; }` in globals.css
- Check browser supports mix-blend-mode

### Animations Not Triggering
- Ensure components are marked 'use client'
- Check Intersection Observer threshold
- Verify viewport settings in motion components

### Build Errors
- All animation components need 'use client' directive
- Framer Motion requires React 18+
- Check all imports are correct

## Performance Checklist

- [ ] All images optimized (WebP, < 200KB)
- [ ] Lazy loading enabled for below-fold content
- [ ] Animations use GPU-accelerated properties (transform, opacity)
- [ ] Custom cursor disabled on mobile
- [ ] No layout shifts (CLS < 0.1)
- [ ] First Load JS < 200KB
- [ ] Lighthouse score > 90

## Deployment Notes

### Environment Variables
Ensure these are set in production:
```
NEXT_PUBLIC_SITE_URL=https://source.com
ADMIN_PORTAL_URL=your-admin-url
ADMIN_SHARED_SECRET=your-secret
```

### Build Command
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Browser Testing Matrix

Test these before launch:
- [ ] Chrome (latest) - Desktop & Mobile
- [ ] Safari (latest) - Desktop & Mobile
- [ ] Firefox (latest) - Desktop
- [ ] Edge (latest) - Desktop
- [ ] Samsung Internet (Android)

## Support

For implementation questions:
- Check component source code (well-commented)
- Review Framer Motion docs: https://www.framer.com/motion/
- Check Tailwind CSS v4 docs: https://tailwindcss.com/

## Quick Wins

Want to make quick impactful changes?

1. **Add real dashboard screenshot**: Biggest visual improvement
2. **Update metrics in counters**: Makes it feel more real
3. **Add team photos**: Builds trust immediately
4. **Replace one portfolio project**: Shows actual work

Start with these four and the site will feel 90% complete!

