# Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies

```bash
cd source-public-website
npm install
```

### 2. Create Environment File

```bash
# Copy example file
cp .env.example .env.local

# Then edit .env.local with real values
```

**Critical variables:**
```
ADMIN_SHARED_SECRET=<get from admin portal team>
```

### 3. Run Dev Server

```bash
npm run dev
```

Visit **http://localhost:3000**

---

## Test Checklist

### Visual Test (2 minutes)

- [ ] Open http://localhost:3000
- [ ] Navigate to each page via menu
- [ ] Check mobile menu works (resize browser < 768px)
- [ ] Verify all sections visible

### Pages to check:
- [ ] Homepage - All 7 sections
- [ ] `/tjanster` - All 5 service sections
- [ ] `/portfolio` - Project grid + filter
- [ ] `/portfolio/fashion-store` - Project detail
- [ ] `/om-oss` - Team section
- [ ] `/priser` - 3 pricing cards
- [ ] `/kontakt` - Contact form

### Form Test (3 minutes)

1. Go to `/kontakt`
2. Fill out contact form
3. Submit (will fail without real ADMIN_SHARED_SECRET - that's OK)
4. Check validation works (try invalid email, empty fields)

---

## Build Test

```bash
npm run build
```

Should complete without errors.

---

## Deploy Test (10 minutes)

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow prompts. Will create preview deployment.

---

## Common Issues

**"Module not found" error:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

**"Port 3000 already in use":**
```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

**Build fails:**
- Check TypeScript errors: `npm run build`
- Check all imports correct
- Verify environment variables set

---

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm test             # Run tests (if configured)

# Deployment
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production
```

---

## Next Steps

1. **Test locally** - All pages load and work
2. **Deploy to staging** - Vercel preview deployment
3. **Test on real devices** - iPhone, Android, tablet
4. **Get real content** - Photos, copy from founders
5. **Test integration** - Contact form → admin portal
6. **Launch to production** - Custom domain setup

---

**Need help?** Check `README.md` for full documentation.

