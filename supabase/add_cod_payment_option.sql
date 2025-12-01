-- =============================================
-- Add COD (Cash on Delivery) Payment Option
-- Run this in your Supabase SQL Editor
-- =============================================

-- Update the check constraint to include 'cod' as a valid payment provider
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_payment_provider_check;

ALTER TABLE orders 
ADD CONSTRAINT orders_payment_provider_check 
CHECK (payment_provider IN ('razorpay', 'cod'));

-- Add a comment to document the change
COMMENT ON COLUMN orders.payment_provider IS 'Payment method: razorpay or cod (Cash on Delivery)';
