-- Add Shiprocket tracking fields to orders table
-- Run this in Supabase SQL Editor

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shiprocket_order_id INTEGER,
ADD COLUMN IF NOT EXISTS shiprocket_shipment_id INTEGER,
ADD COLUMN IF NOT EXISTS awb_code VARCHAR(255),
ADD COLUMN IF NOT EXISTS courier_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS shipment_status VARCHAR(100) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS estimated_delivery_date VARCHAR(50);

-- Create index for faster tracking queries
CREATE INDEX IF NOT EXISTS idx_orders_awb_code ON orders(awb_code);
CREATE INDEX IF NOT EXISTS idx_orders_shiprocket_order_id ON orders(shiprocket_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_shipment_status ON orders(shipment_status);

-- Comment on columns
COMMENT ON COLUMN orders.shiprocket_order_id IS 'Shiprocket order ID for tracking';
COMMENT ON COLUMN orders.shiprocket_shipment_id IS 'Shiprocket shipment ID for tracking';
COMMENT ON COLUMN orders.awb_code IS 'Air Waybill code for courier tracking';
COMMENT ON COLUMN orders.courier_name IS 'Name of the courier company';
COMMENT ON COLUMN orders.tracking_url IS 'Direct tracking URL';
COMMENT ON COLUMN orders.shipment_status IS 'Current shipment status (pending, shipped, in_transit, delivered, cancelled)';
COMMENT ON COLUMN orders.estimated_delivery_date IS 'Expected delivery date from Shiprocket';
