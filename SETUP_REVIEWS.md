# Setup Product Reviews

## Quick Setup Instructions

To enable the product reviews feature, you need to create the database table in Supabase.

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar

### Step 2: Run the SQL Script

Copy and paste the following SQL script and click "Run":

```sql
-- Create product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_images TEXT[], -- Array of image URLs
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE, -- Set to false if you want to moderate reviews
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);

-- Enable Row Level Security
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved reviews (PUBLIC ACCESS)
CREATE POLICY "Anyone can read approved reviews" ON product_reviews
  FOR SELECT USING (is_approved = true);

-- Policy: Anyone can insert reviews
CREATE POLICY "Anyone can insert reviews" ON product_reviews
  FOR INSERT WITH CHECK (true);

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can read review images (PUBLIC ACCESS)
CREATE POLICY "Anyone can read review images" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-images');

-- Storage policy: Anyone can upload review images
CREATE POLICY "Anyone can upload review images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'review-images');
```

### Step 3: Verify Setup

After running the SQL:

1. Check "Table Editor" in Supabase
2. You should see a new table: `product_reviews`
3. Check "Storage" → you should see bucket: `review-images`

### Step 4: Test It Out

1. Go to any product page on your website
2. Scroll to the bottom to see the "Customer Reviews" section
3. Anyone can view reviews (no login required)
4. Anyone can submit reviews with:
   - Star rating (1-5 stars)
   - Review text
   - Up to 5 photos

## Features

✅ **Public Reviews** - Everyone can see all approved reviews
✅ **Photo Reviews** - Customers can upload up to 5 photos per review
✅ **Star Ratings** - 1-5 star rating system with visual stars
✅ **No Login Required** - Anyone can view and submit reviews
✅ **Automatic Approval** - Reviews are automatically approved (can be changed)

## Review Display

Reviews show:
- Customer name
- Star rating (⭐⭐⭐⭐⭐)
- Review text
- Photos (if uploaded)
- Date posted
- Sorted by newest first

## That's It!

Once you run the SQL script, the review section will appear on all product pages and be fully functional.
