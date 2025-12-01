-- =============================================
-- Seujia Honey E-commerce Database Schema
-- Supabase (PostgreSQL)
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster slug lookups
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);

-- =============================================
-- COUPONS TABLE
-- =============================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_value DECIMAL(10, 2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for coupon code lookups
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  shipping_address TEXT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  coupon_code VARCHAR(50),
  payment_provider VARCHAR(20) CHECK (payment_provider IN ('razorpay', 'cod')),
  payment_intent_id VARCHAR(255),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for order lookups
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(payment_status, order_status);

-- =============================================
-- ORDER_ITEMS TABLE
-- =============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for order item lookups
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for products table
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders table
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional - for development)
-- =============================================

-- Insert sample products
INSERT INTO products (name, slug, description, price, image_url, stock, is_active) VALUES
('Raw Wildflower Honey', 'raw-wildflower-honey', 'Pure, unfiltered wildflower honey harvested from local apiaries. Rich in antioxidants and natural enzymes.', 24.99, 'https://placeholder-url/wildflower.jpg', 50, true),
('Manuka Honey', 'manuka-honey', 'Premium Manuka honey from New Zealand. Known for its unique antibacterial properties and rich flavor.', 49.99, 'https://placeholder-url/manuka.jpg', 30, true),
('Acacia Honey', 'acacia-honey', 'Light and delicate acacia honey. Perfect for sweetening tea or drizzling over desserts.', 19.99, 'https://placeholder-url/acacia.jpg', 40, true),
('Honeycomb', 'honeycomb', 'Pure honeycomb straight from the hive. A natural delicacy rich in vitamins and minerals.', 34.99, 'https://placeholder-url/honeycomb.jpg', 25, true);

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_uses, is_active, expires_at) VALUES
('WELCOME10', 'percentage', 10, 0, 100, true, NOW() + INTERVAL '30 days'),
('SAVE5', 'fixed', 5, 20, 50, true, NOW() + INTERVAL '60 days');

-- =============================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- =============================================
-- Enable RLS if you want to use Supabase Auth
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Public read access to products
-- CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);

-- =============================================
-- STORAGE BUCKET SETUP
-- =============================================
-- Run this in Supabase Dashboard > Storage > Create bucket
-- Bucket name: product-images
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/*
