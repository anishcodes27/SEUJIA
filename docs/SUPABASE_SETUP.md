# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Choose organization or create new one
4. Enter project details:
   - Name: `seujia-honey`
   - Database Password: (save this securely!)
   - Region: Choose closest to your users
5. Click **Create new project**
6. Wait 2-3 minutes for provisioning

---

## Step 2: Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. Verify tables created: Go to **Table Editor**

You should see these tables:
- `products`
- `coupons`
- `orders`
- `order_items`

---

## Step 3: Set Up Storage

### Create Storage Bucket

1. Go to **Storage** in left sidebar
2. Click **Create a new bucket**
3. Bucket name: `product-images`
4. **Public bucket**: Toggle ON (important!)
5. File size limit: `5242880` (5MB)
6. Allowed MIME types: Leave empty or specify `image/*`
7. Click **Create bucket**

### Set Bucket Policies (Optional)

If you want more control, set up RLS policies:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow authenticated uploads (for admin)
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

---

## Step 4: Get API Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in settings menu
3. Copy these values:

```
Project URL: https://xxxxx.supabase.co
Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important**: 
- `Anon Key` is safe for client-side use
- `Service Role Key` must ONLY be used server-side (never expose to client)

---

## Step 5: Add Sample Data

### Option 1: Using SQL Editor

```sql
-- Add sample products
INSERT INTO products (name, slug, description, price, stock, image_url, is_active) VALUES
('Raw Wildflower Honey', 'raw-wildflower-honey', 'Pure, unfiltered wildflower honey harvested from local apiaries. Rich in antioxidants and natural enzymes.', 24.99, 50, 'https://images.unsplash.com/photo-1587049352846-4a222e784720?w=800', true),
('Manuka Honey', 'manuka-honey', 'Premium Manuka honey from New Zealand. Known for its unique antibacterial properties and rich flavor.', 49.99, 30, 'https://images.unsplash.com/photo-1558642891-54be180ea339?w=800', true),
('Acacia Honey', 'acacia-honey', 'Light and delicate acacia honey. Perfect for sweetening tea or drizzling over desserts.', 19.99, 40, 'https://images.unsplash.com/photo-1581122037-2c1c2c6e9e3e?w=800', true),
('Honeycomb', 'honeycomb', 'Pure honeycomb straight from the hive. A natural delicacy rich in vitamins and minerals.', 34.99, 25, 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800', true);

-- Add sample coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_uses, is_active) VALUES
('WELCOME10', 'percentage', 10, 0, 100, true),
('SAVE5', 'fixed', 5, 20, 50, true);
```

### Option 2: Using Table Editor

1. Go to **Table Editor**
2. Select `products` table
3. Click **Insert row**
4. Fill in the fields
5. Click **Save**

---

## Step 6: Upload Product Images

### Method 1: Via Admin Dashboard (After Deployment)
1. Navigate to `/admin` on your deployed site
2. Add/Edit product
3. Use the file upload input
4. Image automatically uploads to Supabase

### Method 2: Via Supabase Dashboard
1. Go to **Storage** → `product-images`
2. Click **Upload file**
3. Select images from your computer
4. After upload, click on the file
5. Click **Get public URL**
6. Copy the URL and paste into products table `image_url` column

### Method 3: Using Free Stock Images
Use Unsplash or Pexels URLs directly:
```
https://images.unsplash.com/photo-1587049352846-4a222e784720?w=800&q=80
```

---

## Step 7: Configure RLS (Optional - Recommended for Production)

Row Level Security adds an extra layer of protection.

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access to active products
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
TO public
USING (is_active = true);

-- Only service role can modify products
CREATE POLICY "Service role can do everything"
ON products
TO service_role
USING (true)
WITH CHECK (true);

-- Similar policies for other tables...
```

> **Note**: When using Service Role Key (in API routes), RLS is bypassed. RLS mainly protects against direct database access.

---

## Step 8: Test Database Connection

Create a test file `test-supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
);

async function testConnection() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Products:', data);
  }
}

testConnection();
```

Run: `node test-supabase.js`

---

## Troubleshooting

### "relation 'products' does not exist"
- Schema not run correctly. Go back to Step 2
- Make sure you ran ALL of the SQL in `schema.sql`

### "permission denied for table products"
- Check RLS policies if enabled
- Verify you're using the correct API key
- Use Service Role Key for admin operations

### "Failed to upload image"
- Bucket name must be exactly `product-images`
- Bucket must be set to **Public**
- Check file size is under limit
- Verify CORS settings in Storage settings

### "No rows returned"
- Add sample data (Step 5)
- Check `is_active = true` on products
- Verify table has data: Go to Table Editor

---

## Supabase Dashboard Overview

### Key Sections

1. **Table Editor**: View/edit data directly
2. **SQL Editor**: Run custom queries
3. **Storage**: Manage uploaded files
4. **Database**: Schema, migrations, backups
5. **API Docs**: Auto-generated API documentation
6. **Logs**: Query logs, function logs
7. **Settings**: API keys, project settings

---

## Production Considerations

### Backups
- Free tier: Manual exports via Table Editor
- Pro tier: Automated daily backups
- Consider exporting data weekly

### Performance
- Add indexes for frequently queried columns:
  ```sql
  CREATE INDEX idx_products_price ON products(price);
  CREATE INDEX idx_orders_customer_email ON orders(customer_email);
  ```

### Monitoring
- Check **Reports** tab for usage stats
- Set up alerts for quota limits
- Monitor database size

### Scaling
- Start with Free tier (500MB database, 1GB storage)
- Upgrade to Pro when needed (8GB database, 100GB storage)
- Monitor connection limits

---

## Quick Reference

### Useful SQL Queries

```sql
-- Count total products
SELECT COUNT(*) FROM products WHERE is_active = true;

-- Total revenue
SELECT SUM(total) FROM orders WHERE payment_status = 'paid';

-- Top selling products
SELECT product_name, SUM(quantity) as total_sold
FROM order_items
GROUP BY product_name
ORDER BY total_sold DESC
LIMIT 10;

-- Active coupons
SELECT code, discount_value, current_uses, max_uses
FROM coupons
WHERE is_active = true;
```

### Storage Paths

```
Bucket: product-images
URL Pattern: https://[project-id].supabase.co/storage/v1/object/public/product-images/[filename]
```

---

**Your Supabase setup is complete! 🎉**

Next: Configure your `.env.local` file with these credentials and start the dev server.
