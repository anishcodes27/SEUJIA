# Product Reviews & Coming Soon Card - Setup Guide

## 🎯 New Features Added

### 1. Product Review System
- ⭐ Star ratings (1-5 stars)
- 📝 Text reviews
- 📷 Image uploads (up to 5 images per review)
- ✅ Verified purchase badges
- 📊 Average rating display
- 🔒 Review moderation (optional)

### 2. Coming Soon Card
- 🌸 Seasonal varieties teaser
- 💡 Shows upcoming honey types
- 🎨 Eye-catching design
- 📍 Appears at end of product grid

---

## 📋 Setup Steps

### Step 1: Set Up Database Tables (5 minutes)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Create Reviews Table**
   - Click "SQL Editor"
   - Click "New Query"
   - Copy entire content from: `supabase/reviews_schema.sql`
   - Click "Run" (▶️)

3. **Verify Table Creation**
   - Go to "Table Editor"
   - You should see new table: `product_reviews`
   - Check columns: id, product_id, user_name, user_email, rating, review_text, review_images, etc.

4. **Create Storage Bucket**
   - The SQL script automatically creates `review-images` bucket
   - Go to "Storage" to verify
   - The bucket should be **PUBLIC** (for displaying images)

---

### Step 2: Test Locally

1. **Start Dev Server**
   ```bash
   npm run dev
   ```

2. **Test Coming Soon Card**
   - Visit: http://localhost:3000/shop
   - Scroll to bottom
   - You should see "More Varieties Coming Soon!" card

3. **Test Review System**
   - Visit any product page
   - Click "Write a Review" button
   - Fill in the form
   - Upload images (optional)
   - Submit review
   - Review should appear below

---

## 🎨 Coming Soon Card Features

### What It Shows
- Seasonal flower emoji (animated)
- "More Varieties Coming Soon!" message
- List of upcoming varieties:
  - Litchi
  - Eucalyptus
  - Wild Forest
  - & More

### Where It Appears
- ✅ Homepage (after featured products)
- ✅ Shop page (end of product grid)

### Customization

To change upcoming varieties:

**File:** `components/ComingSoonCard.tsx`

```tsx
<span className="text-xs bg-honey-100 text-honey-800 px-2 py-1 rounded-full">
  Your Variety Name
</span>
```

---

## 📝 Product Review System

### User Flow

1. **User visits product page**
2. **Sees existing reviews** with ratings and images
3. **Clicks "Write a Review"**
4. **Fills form:**
   - Name (required)
   - Email (required)
   - Star rating (required)
   - Review text (optional)
   - Upload images (optional, max 5)
5. **Submits review**
6. **Review appears immediately** (or after moderation)

### Review Display

Each review shows:
- ⭐ Star rating
- 👤 Reviewer name
- 📅 Review date
- ✅ "Verified Purchase" badge (if applicable)
- 📝 Review text
- 📷 Review images (if uploaded)

### Average Rating

Product page header shows:
- Overall star rating (calculated from all reviews)
- Number of reviews
- Visual star display

---

## 🔧 Technical Details

### Database Schema

**Table:** `product_reviews`

```sql
- id: UUID (primary key)
- product_id: UUID (foreign key to products)
- user_name: VARCHAR(255)
- user_email: VARCHAR(255)
- rating: INTEGER (1-5)
- review_text: TEXT (optional)
- review_images: TEXT[] (array of image URLs)
- is_verified_purchase: BOOLEAN
- is_approved: BOOLEAN (for moderation)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Storage Bucket

**Bucket:** `review-images`
- Public access enabled
- Accepts all image formats
- No size limit (recommended: compress before upload)

### API Endpoints

**Get Reviews:**
```
GET /api/products/[productId]/reviews
```

**Submit Review:**
```
POST /api/products/[productId]/reviews
Body: {
  user_name, user_email, rating, review_text, review_images
}
```

---

## 🎯 Review Moderation (Optional)

By default, reviews appear immediately. To enable moderation:

### 1. Update Default Behavior

**File:** `supabase/reviews_schema.sql`

Change line:
```sql
is_approved BOOLEAN DEFAULT TRUE,
```

To:
```sql
is_approved BOOLEAN DEFAULT FALSE,
```

### 2. Create Admin Approval System

Reviews will need manual approval before showing.

To approve a review:
```sql
UPDATE product_reviews 
SET is_approved = true 
WHERE id = 'review-id-here';
```

---

## 📸 Image Upload Details

### User Experience
1. User clicks "📷 Add Photos"
2. Selects up to 5 images
3. Images preview instantly
4. Can remove images before submitting
5. Images upload to Supabase Storage
6. URLs saved in review record

### Technical Implementation
- Uses Supabase Storage API
- Generates unique filenames
- Stores in `review-images` bucket
- Returns public URLs
- Displays in review using Next.js Image component

### File Naming
```javascript
const fileName = `${random}-${timestamp}.${extension}`;
// Example: abc123-1701234567890.jpg
```

---

## 🎨 Customization Options

### 1. Change Maximum Images

**File:** `components/ProductReviews.tsx`

Find line:
```tsx
if (files.length + imageFiles.length > 5) {
```

Change `5` to your desired number.

### 2. Add Review Guidelines

**File:** `components/ProductReviews.tsx`

Add before form:
```tsx
<div className="bg-blue-50 p-4 rounded-lg mb-4">
  <p className="text-sm text-blue-800">
    Please share honest feedback. Include photos if possible!
  </p>
</div>
```

### 3. Customize Coming Soon Varieties

**File:** `components/ComingSoonCard.tsx`

Update the badges section:
```tsx
<span className="text-xs bg-honey-100 text-honey-800 px-2 py-1 rounded-full">
  Jamun
</span>
<span className="text-xs bg-honey-100 text-honey-800 px-2 py-1 rounded-full">
  Sidr
</span>
```

### 4. Change Star Icon

Replace `★` with any emoji or icon:
```tsx
<span>⭐</span> // or 🌟 or 🍯
```

---

## 🐛 Troubleshooting

### Reviews Not Showing

**Problem:** Reviews submitted but not visible

**Solutions:**
1. Check `is_approved` is `true` in database
2. Verify Row Level Security policies
3. Check browser console for errors
4. Ensure product_id matches actual product

### Image Upload Fails

**Problem:** Images don't upload

**Solutions:**
1. Check `review-images` bucket exists
2. Verify bucket is PUBLIC
3. Check storage policies allow INSERT
4. Ensure file size < 5MB
5. Check browser console for errors

### Coming Soon Card Not Showing

**Problem:** Card doesn't appear on shop page

**Solutions:**
1. Check you have at least 1 product
2. Clear browser cache
3. Restart dev server
4. Check for TypeScript errors

### Average Rating Wrong

**Problem:** Average rating calculation incorrect

**Solutions:**
1. Check all reviews have valid ratings (1-5)
2. Only approved reviews should count
3. Refresh page to recalculate

---

## 🚀 Deployment Notes

### Before Deploying

1. ✅ Run `supabase/reviews_schema.sql` on production database
2. ✅ Create `review-images` bucket in production
3. ✅ Test review submission on production
4. ✅ Test image uploads on production
5. ✅ Verify RLS policies work correctly

### After Deployment

1. Submit a test review
2. Upload test images
3. Verify review appears
4. Check images display correctly
5. Test on mobile devices

---

## 📊 Analytics Ideas

### Track Review Metrics

Add to your analytics:
- Number of reviews per product
- Average rating per product
- Reviews with photos vs without
- Review submission rate
- Most reviewed products

### Display on Product Cards

You could show average rating on product cards:

**File:** `components/ProductCard.tsx`

Add after product name:
```tsx
{product.average_rating && (
  <div className="flex items-center gap-1 mb-2">
    <span className="text-yellow-400">★</span>
    <span className="text-sm text-gray-600">
      {product.average_rating.toFixed(1)} ({product.review_count})
    </span>
  </div>
)}
```

---

## ✅ Success Checklist

### Database Setup
- [ ] `product_reviews` table created
- [ ] `review-images` bucket created
- [ ] Bucket is public
- [ ] RLS policies working
- [ ] Test review submitted

### Coming Soon Card
- [ ] Shows on homepage
- [ ] Shows on shop page
- [ ] Varieties list is customized
- [ ] Looks good on mobile

### Review System
- [ ] Review form displays
- [ ] Can submit text review
- [ ] Can upload images (up to 5)
- [ ] Images display in reviews
- [ ] Average rating calculates correctly
- [ ] Reviews sorted by date (newest first)

---

## 🎉 Benefits

### For Customers
- ✅ See real feedback from other buyers
- ✅ View actual product photos from customers
- ✅ Make informed purchase decisions
- ✅ Know what varieties are coming

### For Your Business
- ✅ Build trust with social proof
- ✅ Get valuable customer feedback
- ✅ User-generated content (photos)
- ✅ Increase conversions
- ✅ Create anticipation for new products

---

## 📞 Next Steps

1. **Run the database migration** (reviews_schema.sql)
2. **Test the review system** locally
3. **Customize Coming Soon varieties** if needed
4. **Deploy to production**
5. **Encourage customers** to leave reviews (maybe offer a small discount)

---

**Setup Date:** November 28, 2025
**Version:** 3.0 (Reviews + Coming Soon)
