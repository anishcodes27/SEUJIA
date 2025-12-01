# Adding Seujia Honey Products - Quick Guide

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

## Step 2: Run the Product Insert SQL

Copy and paste the SQL from `supabase/add_products.sql` into the SQL editor and click "Run".

This will add 6 products:

### Products Added:
1. **Jujube Honey - 250gm** - ₹249
2. **Jujube Honey - 500gm** - ₹449
3. **Multiflora Honey - 250gm** - ₹179
4. **Multiflora Honey - 500gm** - ₹369
5. **Ajwain Honey - 250gm** - ₹189
6. **Ajwain Honey - 500gm** - ₹389

## Step 3: Update Image URLs

After running the SQL, you need to upload product images and update the URLs:

### Upload Images to Supabase Storage:

1. In Supabase dashboard, go to **Storage**
2. Click on the **product-images** bucket (create it if it doesn't exist)
3. Upload your product images with these names:
   - `jujube-250.jpg`
   - `jujube-500.jpg`
   - `multiflora-250.jpg`
   - `multiflora-500.jpg`
   - `ajwain-250.jpg`
   - `ajwain-500.jpg`

### Get the Public URLs:

1. Click on each uploaded image
2. Click "Get URL" or "Copy URL"
3. Copy the public URL

### Update the Database:

Run this SQL to update the image URLs (replace with your actual URLs):

```sql
-- Update image URLs (replace with your actual Supabase Storage URLs)
UPDATE products SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/product-images/jujube-250.jpg' 
WHERE slug = 'jujube-honey-250gm';

UPDATE products SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/product-images/jujube-500.jpg' 
WHERE slug = 'jujube-honey-500gm';

UPDATE products SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/product-images/multiflora-250.jpg' 
WHERE slug = 'multiflora-honey-250gm';

UPDATE products SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/product-images/multiflora-500.jpg' 
WHERE slug = 'multiflora-honey-500gm';

UPDATE products SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/product-images/ajwain-250.jpg' 
WHERE slug = 'ajwain-honey-250gm';

UPDATE products SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/product-images/ajwain-500.jpg' 
WHERE slug = 'ajwain-honey-500gm';
```

## Step 4: Verify Products

Run this query to see all your products:

```sql
SELECT name, price, stock, is_active FROM products ORDER BY name;
```

## Alternative: Add Products via Admin Panel

If you prefer using the admin panel:

1. Go to `http://localhost:3000/admin`
2. Enter admin password (from your `.env.local`)
3. Click "Products" tab
4. Click "Add New Product"
5. Fill in the form for each product:
   - Upload image
   - Enter name, description, price
   - Set stock quantity
   - Mark as active
6. Click "Save Product"

## Features Included:

✅ **Seasonal Flavor Notice** - Added to home page explaining natural variations
✅ **Product Descriptions** - Include seasonal variation note
✅ **Proper Pricing** - As per your specifications
✅ **Stock Management** - Set to 100 units each
✅ **SEO-friendly Slugs** - Auto-generated for URLs

## Need Help?

- Make sure the `product-images` bucket exists in Supabase Storage
- Ensure the bucket is set to "Public"
- Image URLs must be publicly accessible
- Check that `.env.local` has correct Supabase credentials

---

Your products are now ready to display on the website! 🍯
