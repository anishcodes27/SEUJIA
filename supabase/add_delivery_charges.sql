-- Add delivery_charges column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_charges DECIMAL(10, 2) DEFAULT 0;

-- Update existing orders to have 0 delivery charges if NULL
UPDATE orders 
SET delivery_charges = 0 
WHERE delivery_charges IS NULL;
