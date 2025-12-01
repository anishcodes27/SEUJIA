-- =============================================
-- ADD SEUJIA HONEY PRODUCTS
-- =============================================
-- Run this SQL in your Supabase SQL Editor after running schema.sql

-- Delete existing sample products (optional)
-- DELETE FROM products;

-- Insert Jujube Honey Products
INSERT INTO products (name, slug, description, price, image_url, stock, is_active) VALUES
(
  'Jujube Honey - 250gm', 
  'jujube-honey-250gm', 
  'Pure Jujube (Ber) honey harvested from jujube flowers. Known for its rich taste and medicinal properties. Perfect for boosting immunity and energy. Note: Flavor may vary according to season.',
  249.00,
  'https://your-supabase-url/storage/v1/object/public/product-images/jujube-250.jpg',
  100,
  true
),
(
  'Jujube Honey - 500gm', 
  'jujube-honey-500gm', 
  'Pure Jujube (Ber) honey harvested from jujube flowers. Known for its rich taste and medicinal properties. Perfect for boosting immunity and energy. Note: Flavor may vary according to season.',
  449.00,
  'https://your-supabase-url/storage/v1/object/public/product-images/jujube-500.jpg',
  100,
  true
);

-- Insert Multiflora Honey Products
INSERT INTO products (name, slug, description, price, image_url, stock, is_active) VALUES
(
  'Multiflora Honey - 250gm', 
  'multiflora-honey-250gm', 
  'Natural multiflora honey collected from various wildflowers. Rich in antioxidants and natural enzymes. A perfect all-purpose honey for daily use. Note: Flavor may vary according to season.',
  179.00,
  'https://your-supabase-url/storage/v1/object/public/product-images/multiflora-250.jpg',
  100,
  true
),
(
  'Multiflora Honey - 500gm', 
  'multiflora-honey-500gm', 
  'Natural multiflora honey collected from various wildflowers. Rich in antioxidants and natural enzymes. A perfect all-purpose honey for daily use. Note: Flavor may vary according to season.',
  369.00,
  'https://your-supabase-url/storage/v1/object/public/product-images/multiflora-500.jpg',
  100,
  true
);

-- Insert Ajwain Honey Products
INSERT INTO products (name, slug, description, price, image_url, stock, is_active) VALUES
(
  'Ajwain Honey - 250gm', 
  'ajwain-honey-250gm', 
  'Premium Ajwain (Carom) honey with distinctive flavor and aroma. Excellent for digestion and respiratory health. Known for its therapeutic properties. Note: Flavor may vary according to season.',
  189.00,
  'https://your-supabase-url/storage/v1/object/public/product-images/ajwain-250.jpg',
  100,
  true
),
(
  'Ajwain Honey - 500gm', 
  'ajwain-honey-500gm', 
  'Premium Ajwain (Carom) honey with distinctive flavor and aroma. Excellent for digestion and respiratory health. Known for its therapeutic properties. Note: Flavor may vary according to season.',
  389.00,
  'https://your-supabase-url/storage/v1/object/public/product-images/ajwain-500.jpg',
  100,
  true
);

-- Verify the products were added
SELECT name, price, stock, is_active FROM products ORDER BY name;
