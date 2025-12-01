-- Create product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_images TEXT[], -- Array of image URLs
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE, -- Set to false if you want to moderate reviews
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);

-- Enable Row Level Security
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews" ON product_reviews
  FOR SELECT USING (is_approved = true);

-- Policy: Anyone can insert reviews (they'll be moderated if is_approved=false)
CREATE POLICY "Anyone can insert reviews" ON product_reviews
  FOR INSERT WITH CHECK (true);

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can read review images
CREATE POLICY "Anyone can read review images" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-images');

-- Storage policy: Anyone can upload review images
CREATE POLICY "Anyone can upload review images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'review-images');
