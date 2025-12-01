# Seujia Honey - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] All environment variables documented
- [ ] `.env.example` file is up to date
- [ ] Production secrets ready (Stripe live keys, etc.)
- [ ] Admin password changed from default

### 2. Database
- [ ] Supabase schema applied successfully
- [ ] Sample products added (or ready to add)
- [ ] Storage bucket created and configured
- [ ] Test all database queries work

### 3. Payment Providers
- [ ] Stripe account verified (for live mode)
- [ ] Razorpay account setup (optional)
- [ ] Webhook endpoints ready to configure
- [ ] Test cards work in development

### 4. Code Quality
- [ ] All TypeScript errors resolved
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in browser
- [ ] Tested on mobile and desktop

---

## Vercel Deployment Steps

### Step 1: Prepare Repository

```bash
# Ensure .gitignore includes .env.local
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Vercel Project

1. Visit [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Framework Preset: **Next.js** (auto-detected)
5. Root Directory: `./` (default)

### Step 3: Configure Environment Variables

Add these in Vercel project settings:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Razorpay (if using)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Admin
ADMIN_PASSWORD=your-secure-production-password

# App URL (update after first deploy)
NEXT_PUBLIC_APP_URL=https://seujia-honey.vercel.app
```

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Note your deployment URL (e.g., `seujia-honey.vercel.app`)

### Step 5: Configure Webhooks

#### Stripe Webhooks
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add Endpoint**
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events: `payment_intent.succeeded`
5. Copy the signing secret
6. Update Vercel env var: `STRIPE_WEBHOOK_SECRET`

#### Razorpay Webhooks
1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-domain.vercel.app/api/webhooks/razorpay`
3. Active Events: `payment.captured`, `payment.authorized`
4. Copy the secret
5. Update Vercel env var: `RAZORPAY_WEBHOOK_SECRET`

### Step 6: Update App URL

1. In Vercel, update `NEXT_PUBLIC_APP_URL` to your actual domain
2. Redeploy: `Settings → Redeploy`

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `seujia-honey.com`)
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (5 mins - 48 hours)
5. SSL certificate auto-provisioned

### Update Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://seujia-honey.com
```

### Update Webhooks

Update webhook URLs in Stripe and Razorpay to use your custom domain.

---

## Post-Deployment Testing

### 1. Functional Tests
- [ ] Visit homepage - loads correctly
- [ ] Browse products - images display
- [ ] Add to cart - works on first visit
- [ ] Apply coupon - validates correctly
- [ ] Complete Stripe test payment
- [ ] Check order in admin
- [ ] Verify webhook received (check Stripe dashboard)
- [ ] Confirm inventory decremented

### 2. Performance
- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Check page load times
- [ ] Test on 3G network
- [ ] Verify images are optimized

### 3. Security
- [ ] Admin page requires password
- [ ] API keys not exposed in client code
- [ ] HTTPS enabled (Vercel auto)
- [ ] Webhook signatures verified

---

## Monitoring Setup

### Vercel Analytics (Built-in)
1. Go to Project → Analytics
2. Enable Web Analytics
3. Monitor page views, performance

### Error Tracking (Sentry - Optional)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add to `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## Maintenance

### Regular Tasks
- **Daily**: Check orders in admin
- **Weekly**: Review error logs
- **Monthly**: Update dependencies: `npm update`
- **Quarterly**: Review and optimize database

### Backups
Supabase provides automatic backups (Pro plan). For free tier:
1. Go to Supabase → Database → Backups
2. Manually export if needed

### Updates

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Test locally
npm run build && npm run dev

# Push to trigger auto-deploy
git push origin main
```

---

## Scaling Considerations

### If you grow beyond initial setup:

1. **Database**: Upgrade Supabase plan for more connections
2. **Storage**: Monitor Supabase storage usage
3. **CDN**: Use Vercel's Edge Network (automatic)
4. **Caching**: Implement Redis for session management
5. **Inventory**: Add real-time stock updates
6. **Email**: Integrate transactional email service

---

## Rollback Procedure

If deployment fails:

1. Go to Vercel → Deployments
2. Find last working deployment
3. Click **•••** → **Promote to Production**

Or via CLI:
```bash
vercel rollback
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Razorpay Docs**: https://razorpay.com/docs

---

## Emergency Contacts

Keep these handy:
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- Stripe Support: https://support.stripe.com
- Domain Registrar support

---

## Production Checklist

Before going live:
- [ ] All test data removed from database
- [ ] Real products added with accurate pricing
- [ ] Stripe live mode enabled
- [ ] Payment webhooks tested with live mode
- [ ] Admin password changed to strong password
- [ ] Privacy policy and terms of service pages added
- [ ] Contact email/phone displayed
- [ ] Analytics tracking implemented
- [ ] Error monitoring setup
- [ ] Customer service plan ready
- [ ] Shipping/return policies documented
- [ ] Legal compliance checked (GDPR, etc.)

---

**You're ready to launch! 🚀**
