# Deployment Guide - Source Public Website

## Quick Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Source public website"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Step 3: Set Environment Variables

In Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_SITE_URL=https://source.com
ADMIN_PORTAL_URL=https://admin-portal-rn5z.onrender.com
ADMIN_SHARED_SECRET=531270ad3174be71ac17c5f0c18f433b93e57c145f096b36d04dcf1f5f4e7d6a
CUSTOMER_PORTAL_URL=https://source-database.onrender.com
```

**Optional (add when ready):**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Step 4: Deploy

Click "Deploy" - Vercel will build and deploy automatically.

### Step 5: Configure Custom Domain

1. In Vercel project settings → Domains
2. Add `source.com`
3. Update DNS records as instructed by Vercel:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

**DNS Provider:** Use Cloudflare (free tier) for best performance.

---

## Pre-Deployment Checklist

### Code Quality
- [x] TypeScript compiles without errors
- [x] ESLint passes
- [x] Build succeeds
- [ ] All pages load without errors
- [ ] Forms submit successfully (test with admin portal)
- [ ] No console errors

### Content
- [ ] Replace placeholder images with real assets
- [ ] Add actual team photos and bios (om-oss page)
- [ ] Review all copy for accuracy
- [ ] Verify contact information correct
- [ ] Check all links work

### Performance
- [ ] Lighthouse mobile score >90
- [ ] Lighthouse desktop score >95
- [ ] Core Web Vitals: All "Good"
- [ ] Images optimized (WebP format)
- [ ] Fonts loading properly

### SEO
- [x] Metadata on all pages
- [x] Sitemap.xml generated
- [x] Robots.txt configured
- [ ] Open Graph images created
- [ ] Alt text on all images
- [ ] Semantic HTML structure

### Security
- [x] Security headers configured
- [x] HTTPS enforced (automatic with Vercel)
- [x] Environment variables secure
- [x] API routes validated
- [x] HMAC authentication implemented

### Integration
- [ ] Contact form → Admin portal (test)
- [ ] Environment variables set
- [ ] Admin portal endpoints confirmed
- [ ] Error handling tested

---

## Testing Before Launch

### Manual Testing

**Test on these devices:**
- [ ] iPhone (Safari)
- [ ] Android phone (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome, Firefox, Safari, Edge)

**Test these scenarios:**
1. Navigate through all pages
2. Submit contact form
3. Test mobile menu
4. Click all links (internal and external)
5. Test form validation (try invalid data)
6. Check responsive design at all breakpoints

### Automated Testing

```bash
# Lighthouse CI (if configured)
npm run lighthouse

# E2E tests (if configured)
npm run test:e2e
```

---

## Post-Deployment

### Immediate (First 24 hours)

1. **Verify deployment:**
   - Visit https://source.com
   - Check all pages load
   - Test contact form

2. **Set up monitoring:**
   - Vercel Analytics (automatic)
   - Google Analytics (add GA_ID)
   - Sentry error tracking (optional)

3. **Submit to Google:**
   - Google Search Console
   - Submit sitemap.xml
   - Request indexing

4. **Monitor:**
   - Check Vercel logs for errors
   - Test form submissions
   - Verify admin portal receives data

### First Week

1. **Analytics setup:**
   - Confirm GA4 tracking works
   - Set up conversion goals (form submissions, demo bookings)
   - Monitor page performance

2. **SEO:**
   - Submit to Bing Webmaster Tools
   - Check indexing status
   - Monitor rankings for target keywords

3. **Performance:**
   - Run Lighthouse audits
   - Check Core Web Vitals in Search Console
   - Monitor Vercel Speed Insights

### Ongoing

1. **Monthly:**
   - Review analytics
   - Update content
   - Check for broken links
   - Dependency updates

2. **Quarterly:**
   - Full performance audit
   - Security review
   - Content refresh
   - A/B testing new messaging

---

## Rollback Procedure

If deployment has issues:

1. **Vercel Dashboard:**
   - Go to Deployments tab
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Or redeploy:**
   ```bash
   git revert HEAD
   git push
   ```

---

## Domain Configuration

### Primary Domain: source.com

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Subdomain Management

**Existing subdomains (don't change):**
- `admin.source.com` → Admin Portal (Render)
- `portal.source.com` → Customer Portal (Render)

**DNS Configuration:**
Keep existing CNAME records pointing to Render deployments.

---

## Monitoring URLs

After deployment, monitor these:

- **Live Site:** https://source.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Google Search Console:** https://search.google.com/search-console
- **Vercel Analytics:** Built into dashboard
- **Admin Portal:** https://admin-portal-rn5z.onrender.com

---

## Troubleshooting

### Common Issues

**Build fails:**
- Check TypeScript errors: `npm run build`
- Check environment variables are set
- Check dependencies are installed

**Forms don't submit:**
- Verify `ADMIN_PORTAL_URL` is correct
- Verify `ADMIN_SHARED_SECRET` matches admin portal
- Check admin portal logs
- Test HMAC signature separately

**Performance issues:**
- Check image optimization
- Verify code splitting
- Check for heavy JavaScript
- Review Vercel Speed Insights

**SEO issues:**
- Verify sitemap.xml accessible
- Check robots.txt allows crawling
- Confirm metadata on all pages
- Use Google Search Console for diagnostics

---

## Next Steps After Launch

1. **Add real content:**
   - Team photos and bios
   - Real project screenshots
   - Customer testimonials (when available)

2. **Add features:**
   - Blog (for SEO)
   - Newsletter signup
   - Live chat integration

3. **Optimize:**
   - A/B testing headlines
   - Conversion rate optimization
   - Performance improvements

4. **Integrate:**
   - Google Analytics events
   - More detailed tracking
   - CRM integration (if needed)

---

## Support

**Technical issues:** Check Vercel logs and documentation
**Integration issues:** Verify with admin portal team
**Content questions:** Refer to `01-foundation/content-strategy/`

---

**Deployment ready!** Follow this guide for smooth launch.

