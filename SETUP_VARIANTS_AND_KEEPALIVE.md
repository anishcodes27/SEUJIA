# Setup Guide: Product Variants & Keep-Alive System

## 🎯 What's New

### 1. Product Variants (Size Selection)
Instead of separate products for 250gm and 500gm, users can now select the size from a single product.

### 2. Auto Keep-Alive System
Prevents Supabase from pausing due to inactivity by automatically pinging your database twice a week.

---

## 📋 Setup Steps

### Step 1: Update Supabase Database

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your `seujia-honey-store` project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the entire content from `supabase/add_variants.sql`
   - Paste it into the SQL Editor
   - Click "Run" (▶️ button)
   
4. **Verify Changes**
   - You should see a message: "Success. 6 rows returned"
   - Go to "Table Editor" → "products"
   - You should now see:
     - ✅ 3 active products (Jujube Honey, Multiflora Honey, Ajwain Honey)
     - ✅ 3 inactive products (the old 500gm variants)
     - ✅ New `variants` column with size/price data

---

### Step 2: Set Up GitHub Actions (Keep-Alive)

#### A. Push Code to GitHub

1. **Initialize Git (if not already done)**
   ```bash
   cd "/home/anish/Desktop/seujia_web (final copy)"
   git init
   git add .
   git commit -m "Add product variants and keep-alive system"
   ```

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name: `seujia-honey-store`
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/seujia-honey-store.git
   git branch -M main
   git push -u origin main
   ```

#### B. Add GitHub Secret

1. **Go to Repository Settings**
   - Open your GitHub repository
   - Click "Settings" tab
   - Click "Secrets and variables" → "Actions"

2. **Add New Secret**
   - Click "New repository secret"
   - Name: `APP_URL`
   - Value: Your production URL (e.g., `https://seujia-honey.vercel.app`)
     - If not deployed yet, use: `http://localhost:3000` (temporary)
   - Click "Add secret"

#### C. Enable GitHub Actions

1. **Go to Actions Tab**
   - Click "Actions" tab in your repository
   - You'll see the "Keep Supabase Database Active" workflow

2. **Enable the Workflow**
   - If there's a message about enabling workflows, click "I understand my workflows, go ahead and enable them"

3. **Test Manual Run (Optional)**
   - Click on "Keep Supabase Database Active" workflow
   - Click "Run workflow" dropdown
   - Click "Run workflow" button
   - Wait ~30 seconds and refresh to see results

#### D. Schedule Details

The workflow runs automatically:
- **Monday at 10:00 AM UTC**
- **Thursday at 10:00 AM UTC**

This ensures your database stays active (2 pings per week is enough).

---

### Step 3: Test Locally

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Keep-Alive Endpoint**
   - Open: http://localhost:3000/api/keep-alive
   - You should see:
     ```json
     {
       "success": true,
       "message": "Database is active",
       "timestamp": "2025-11-28T..."
     }
     ```

3. **Test Product Variants**
   - Open: http://localhost:3000/shop
   - You should now see 3 products instead of 6
   - Each product should have size buttons (250gm, 500gm)
   - Price should update when you select different sizes
   - Cart should track each variant separately

---

## 🎨 How Product Variants Work

### Before (Old System)
```
Products List:
- Jujube Honey 250gm - ₹189
- Jujube Honey 500gm - ₹389
- Multiflora Honey 250gm - ₹189
- Multiflora Honey 500gm - ₹389
```

### After (New System)
```
Products List:
- Jujube Honey
  [250gm] ₹189  [500gm] ₹389
  
- Multiflora Honey  
  [250gm] ₹189  [500gm] ₹389
  
- Ajwain Honey
  [250gm] ₹189  [500gm] ₹389
```

### User Experience
1. User sees "Jujube Honey" product
2. Clicks on size button (250gm or 500gm)
3. Price updates automatically
4. Clicks "Add to Cart"
5. Cart shows: "Jujube Honey (250gm) - ₹189"

---

## 🔧 Technical Details

### Database Schema
```sql
-- New variants column structure
variants: [
  {
    "size": "250gm",
    "price": 189,
    "stock": 100
  },
  {
    "size": "500gm", 
    "price": 389,
    "stock": 100
  }
]
```

### Cart Item Structure
```typescript
{
  product: Product,
  quantity: 2,
  selectedVariant: {
    size: "250gm",
    price: 189,
    stock: 100
  }
}
```

---

## 📝 Adding More Variants

To add a 1kg variant to a product:

1. **Update via SQL Editor**
   ```sql
   UPDATE products 
   SET variants = jsonb_insert(
     variants,
     '{2}',
     '{"size": "1kg", "price": 750, "stock": 50}'::jsonb
   )
   WHERE slug = 'jujube-honey';
   ```

2. **Or via Table Editor**
   - Go to Table Editor → products
   - Find the product
   - Click on the `variants` cell
   - Add new variant to the JSON array
   - Click save

---

## 🚀 Deployment Notes

### When Deploying to Vercel/Netlify:

1. **Update APP_URL Secret**
   - Go to GitHub repo → Settings → Secrets
   - Edit `APP_URL` secret
   - Change from `http://localhost:3000` to your actual URL
   - Example: `https://seujia-honey.vercel.app`

2. **Verify Keep-Alive Endpoint**
   - Visit: `https://your-domain.com/api/keep-alive`
   - Should return success message

3. **Check Scheduled Runs**
   - Go to GitHub → Actions tab
   - Look for "Keep Supabase Database Active"
   - Check run history to ensure it's working

---

## 🐛 Troubleshooting

### Products Not Showing Variants

**Problem:** Products still show as separate items

**Solution:**
```bash
# Re-run the migration
# Go to Supabase SQL Editor and run add_variants.sql again
```

### Keep-Alive Not Working

**Problem:** GitHub Action fails

**Solution:**
1. Check `APP_URL` secret is correct
2. Ensure your deployment is live
3. Check endpoint manually: `curl https://your-url.com/api/keep-alive`
4. Check GitHub Actions logs for errors

### Database Still Pausing

**Problem:** Database paused despite keep-alive

**Solutions:**
- Check GitHub Actions history - are the runs succeeding?
- Increase frequency (change cron to 3 times per week):
  ```yaml
  - cron: '0 10 * * 1,3,5'  # Mon, Wed, Fri
  ```
- Verify endpoint is actually reaching database

### Cart Shows Wrong Prices

**Problem:** Cart displays wrong variant prices

**Solution:**
```bash
# Clear browser localStorage
localStorage.clear();
# Refresh page
```

---

## ✅ Success Checklist

- [ ] Database migration completed (variants column added)
- [ ] 3 active products with variants visible
- [ ] Size selection buttons work on product cards
- [ ] Cart shows correct variant and price
- [ ] Keep-alive endpoint accessible
- [ ] GitHub Actions workflow enabled
- [ ] APP_URL secret configured
- [ ] First scheduled run successful (or manual test passed)

---

## 🎯 Benefits

### Product Variants
- ✅ Cleaner product catalog (3 instead of 6 products)
- ✅ Better user experience
- ✅ Easier to add new sizes (1kg, 2kg, etc.)
- ✅ More professional look

### Keep-Alive System
- ✅ Database never pauses
- ✅ No manual intervention needed
- ✅ Free (uses GitHub Actions free tier)
- ✅ Reliable (runs automatically)

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all steps were completed
3. Check browser console for errors
4. Check GitHub Actions logs
5. Check Supabase logs

---

**Setup Date:** November 28, 2025
**Version:** 2.0 (Variants + Keep-Alive)
