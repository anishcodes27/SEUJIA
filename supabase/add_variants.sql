-- Add variants column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB;

-- Update existing products to use variants instead of separate products
-- First, let's consolidate Jujube Honey
UPDATE products 
SET variants = '[
  {"size": "250gm", "price": 189, "stock": 100},
  {"size": "500gm", "price": 389, "stock": 100}
]'::jsonb,
name = 'Jujube Honey',
slug = 'jujube-honey',
price = 189
WHERE name LIKE 'Jujube Honey%' AND name LIKE '%250gm%';

-- Deactivate the 500gm variant (we'll merge it)
UPDATE products 
SET is_active = false
WHERE name LIKE 'Jujube Honey%' AND name LIKE '%500gm%';

-- Consolidate Multiflora Honey
UPDATE products 
SET variants = '[
  {"size": "250gm", "price": 189, "stock": 100},
  {"size": "500gm", "price": 389, "stock": 100}
]'::jsonb,
name = 'Multiflora Honey',
slug = 'multiflora-honey',
price = 189
WHERE name LIKE 'Multiflora Honey%' AND name LIKE '%250gm%';

-- Deactivate the 500gm variant
UPDATE products 
SET is_active = false
WHERE name LIKE 'Multiflora Honey%' AND name LIKE '%500gm%';

-- Consolidate Ajwain Honey
UPDATE products 
SET variants = '[
  {"size": "250gm", "price": 189, "stock": 100},
  {"size": "500gm", "price": 389, "stock": 100}
]'::jsonb,
name = 'Ajwain Honey',
slug = 'ajwain-honey',
price = 189
WHERE name LIKE 'Ajwain Honey%' AND name LIKE '%250gm%';

-- Deactivate the 500gm variant
UPDATE products 
SET is_active = false
WHERE name LIKE 'Ajwain Honey%' AND name LIKE '%500gm%';

-- Verify the changes
SELECT 
  name, 
  slug, 
  price, 
  variants,
  is_active 
FROM products 
ORDER BY name;
