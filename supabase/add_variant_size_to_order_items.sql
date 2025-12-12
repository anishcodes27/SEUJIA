-- Add variant_size column to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS variant_size TEXT;

-- This will help track which variant was ordered for proper stock restoration
