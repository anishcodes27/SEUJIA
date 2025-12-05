-- Update product prices to actual values

-- Jujube Honey: 250gm = ₹189, 500gm = ₹389
UPDATE products
SET 
  price = 189,
  variants = '[
    {"size": "250gm", "price": 189, "stock": 100},
    {"size": "500gm", "price": 389, "stock": 100}
  ]'::jsonb
WHERE slug = 'jujube-honey';

-- Multiflora Honey: 250gm = ₹149, 500gm = ₹299
UPDATE products
SET 
  price = 149,
  variants = '[
    {"size": "250gm", "price": 149, "stock": 100},
    {"size": "500gm", "price": 299, "stock": 100}
  ]'::jsonb
WHERE slug = 'multiflora-honey';

-- Ajwain Honey: 250gm = ₹249, 500gm = ₹499
UPDATE products
SET 
  price = 249,
  variants = '[
    {"size": "250gm", "price": 249, "stock": 100},
    {"size": "500gm", "price": 499, "stock": 100}
  ]'::jsonb
WHERE slug = 'ajwain-honey';
