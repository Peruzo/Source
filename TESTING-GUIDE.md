# Testing Guide - Contact Form Integration

This guide walks you through testing the contact form integration with the admin portal.

---

## Prerequisites

1. **Node.js installed** (v18+)
2. **Admin portal running** or accessible at https://admin-portal-rn5z.onrender.com
3. **MongoDB access** to verify data (optional but recommended)

---

## Step 1: Environment Setup

### 1.1 Create .env.local file

```bash
cd source-public-website
cp env.example .env.local
```

### 1.2 Verify environment variables

Open `.env.local` and ensure it contains:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_PORTAL_URL=https://admin-portal-rn5z.onrender.com
ADMIN_SHARED_SECRET=f87455ea7a50dd8a235fb95032eb4de9b4ca519b71e5fe020146cd247ad4caca
CUSTOMER_PORTAL_URL=https://source-database.onrender.com
```

**⚠️ Important:** The `ADMIN_SHARED_SECRET` must match the secret in the admin portal's `.env` file.

---

## Step 2: Update Admin Portal Secret

### 2.1 SSH into admin portal (if self-hosted)

```bash
# Connect to server
ssh user@admin-portal-server

# Navigate to admin portal directory
cd /path/to/admin-portal

# Edit .env file
nano .env
```

### 2.2 Add/update the secret

```env
ADMIN_SHARED_SECRET=f87455ea7a50dd8a235fb95032eb4de9b4ca519b71e5fe020146cd247ad4caca
```

### 2.3 Restart admin portal

```bash
# If using PM2
pm2 restart admin-portal

# If using npm
npm restart

# If on Render.com
# Go to dashboard and manually redeploy with new env var
```

---

## Step 3: Start Public Website

### 3.1 Install dependencies

```bash
cd source-public-website
npm install
```

### 3.2 Start dev server

```bash
npm run dev
```

Server should start at http://localhost:3000

---

## Step 4: Test Contact Form Submission

### 4.1 Navigate to contact page

Open browser: http://localhost:3000/kontakt

### 4.2 Open browser developer tools

- Chrome/Edge: Press F12 or Ctrl+Shift+I
- Safari: Enable Dev Tools in Preferences, then Cmd+Option+I
- Firefox: Press F12 or Ctrl+Shift+I

Go to **Console** and **Network** tabs.

### 4.3 Fill in the form

Use test data:

```
Namn: Test Testsson
E-post: test@example.com
Telefon: +46 70 123 45 67
Företag: Test AB
Behov: [Check "Ny hemsida" and "E-handel"]
Meddelande: Detta är ett test av kontaktformuläret.
Budget: 5k_10k
```

### 4.4 Submit the form

Click "Skicka meddelande"

---

## Step 5: Verify Success

### 5.1 Check browser console

You should see:
```
✅ No errors
```

You should NOT see:
```
❌ Network error
❌ 401 Unauthorized
❌ 500 Internal Server Error
```

### 5.2 Check Network tab

Filter by "contact" and look for the API call:

**Request:**
- URL: `http://localhost:3000/api/contact`
- Method: POST
- Status: 200 OK

**Response:**
```json
{
  "success": true
}
```

Click on the request and check **Headers**:
- `x-signature`: Should start with "sha256="
- `x-idempotency-key`: Should be present
- `Content-Type`: application/json

### 5.3 Check admin portal logs

If you have access to admin portal logs:

```bash
# SSH into admin portal
ssh user@admin-portal-server

# View logs (PM2)
pm2 logs admin-portal

# Or check Render.com logs in dashboard
```

Look for:
```
✅ HMAC signature validated
✅ Ingested contact form for test@example.com
```

### 5.4 Check MongoDB (Optional)

Connect to MongoDB and verify the data was saved:

```javascript
// In MongoDB shell or Compass
db.adminstudioradgivnings.find({ 
  customerEmail: "test@example.com" 
}).sort({ createdAt: -1 }).limit(1).pretty()
```

Should return a document with:
```json
{
  "_id": "...",
  "customerEmail": "test@example.com",
  "customerName": "Test Testsson",
  "source": "contact_page",
  "phone": "+46 70 123 45 67",
  "company": "Test AB",
  "description": "Detta är ett test av kontaktformuläret.",
  "metadata": {
    "needs": ["Ny hemsida", "E-handel"],
    "budget": "5k_10k",
    "source": "contact_page",
    "idempotencyKey": "contact-..."
  },
  "status": "open",
  "priority": "medium",
  "createdAt": "2025-10-14T..."
}
```

---

## Step 6: Test Error Scenarios

### 6.1 Test client-side validation

Try to submit the form with:
- ❌ Empty email → Should show validation error
- ❌ Invalid email format → Should show validation error
- ❌ Message too short (<10 chars) → Should show validation error
- ❌ No "Behov" selected → Should show validation error

**Expected:** Form should NOT submit, validation messages should appear.

### 6.2 Test with wrong secret (Optional)

1. Edit `.env.local` and change `ADMIN_SHARED_SECRET` to something wrong
2. Restart dev server
3. Submit form
4. **Expected:** 401 Unauthorized error

**Don't forget to change it back!**

### 6.3 Test network failure (Optional)

1. Turn off WiFi or disconnect internet
2. Submit form
3. **Expected:** Graceful error message, retry logic attempts

---

## Step 7: Production Testing

### 7.1 Deploy to Vercel staging

```bash
# Push to GitHub
git add .
git commit -m "Integration testing ready"
git push

# Vercel will auto-deploy
```

### 7.2 Set environment variables in Vercel

Go to Vercel dashboard → Project → Settings → Environment Variables

Add:
```
NEXT_PUBLIC_SITE_URL=https://your-staging-url.vercel.app
ADMIN_PORTAL_URL=https://admin-portal-rn5z.onrender.com
ADMIN_SHARED_SECRET=f87455ea7a50dd8a235fb95032eb4de9b4ca519b71e5fe020146cd247ad4caca
CUSTOMER_PORTAL_URL=https://source-database.onrender.com
```

### 7.3 Test on staging

Repeat Steps 4-6 on the staging URL.

---

## Troubleshooting

### Error: "ADMIN_SHARED_SECRET not configured"

**Problem:** Environment variable not set  
**Solution:** 
1. Check `.env.local` exists
2. Verify secret is set correctly
3. Restart dev server

### Error: "401 Unauthorized - Invalid signature"

**Problem:** HMAC signature mismatch  
**Solution:**
1. Verify secrets match exactly (no extra spaces)
2. Check admin portal has the same secret
3. Restart both servers

### Error: "Failed to process contact form"

**Problem:** Admin portal endpoint issue  
**Solution:**
1. Check admin portal is running
2. Verify `/admin/api/ingest/contact` route exists
3. Check admin portal logs for details

### Error: "Network request failed"

**Problem:** Cannot reach admin portal  
**Solution:**
1. Check ADMIN_PORTAL_URL is correct
2. Verify admin portal is accessible
3. Check CORS settings in admin portal

### Form submits but no data in MongoDB

**Problem:** Data not being saved  
**Solution:**
1. Check admin portal MongoDB connection
2. Verify AdminStudioRådgivning model exists
3. Check for MongoDB errors in logs

---

## Success Criteria

✅ **Integration is working if:**
- Form submits without errors
- User sees success message
- Console shows no errors
- Network request returns 200 OK
- Admin portal logs show "HMAC signature validated"
- Data appears in MongoDB

---

## Performance Testing

### Test response times

Form submission should:
- ✅ Complete in <3 seconds normally
- ✅ Show loading state while submitting
- ✅ Display success/error message clearly

### Test with slow connection

1. Open Chrome DevTools → Network
2. Set throttling to "Slow 3G"
3. Submit form
4. **Expected:** Should still work, just slower

---

## Lighthouse Audit

```bash
# Build production version
npm run build
npm start

# Open Chrome DevTools → Lighthouse
# Run audit for:
# - Performance
# - Accessibility
# - Best Practices
# - SEO
```

**Target scores:**
- Performance: >85
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---

## Next Steps

After successful testing:

1. ✅ Mark integration as complete
2. 📸 Add real images (see IMAGE-GUIDE.md)
3. 🌐 Cross-browser testing
4. 📱 Mobile device testing
5. 🚀 Deploy to production

---

## Questions?

- **Integration issues?** Check INTEGRATION-STATUS.md
- **Environment setup?** Check README.md
- **Image assets?** Check IMAGE-GUIDE.md

---

**Last Updated:** October 14, 2025  
**Status:** Ready for testing

