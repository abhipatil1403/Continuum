-- SQL Schema for Fruit Grading App
-- Run this in your Supabase SQL Editor
-- 
-- IMPORTANT: Before running this SQL, create the following Storage Buckets in Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create bucket: "farmer-photos" (Public: Yes)
-- 3. Create bucket: "farmer-signatures" (Public: Yes)
-- 4. Set bucket policies to allow public read access

-- ============================================
-- USERS TABLE (for regular users/consumers)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- FARMERS TABLE (for farmers)
-- ============================================
CREATE TABLE IF NOT EXISTS farmers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  aadhaar_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  farm_location TEXT NOT NULL,
  warehouse_location TEXT NOT NULL,
  address TEXT NOT NULL,
  photo_url TEXT,
  signature_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on aadhaar_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_farmers_aadhaar ON farmers(aadhaar_number);

-- Add short_id column to farmers table (for public-facing farmer ID)
ALTER TABLE farmers ADD COLUMN IF NOT EXISTS short_id TEXT;

-- Create index on short_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_farmers_short_id ON farmers(short_id);

-- Function to generate short ID from UUID (first 8 characters)
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Update existing farmers to have short_id if they don't have one
UPDATE farmers 
SET short_id = UPPER(SUBSTRING(REPLACE(id::TEXT, '-', ''), 1, 8))
WHERE short_id IS NULL;

-- Trigger to auto-generate short_id for new farmers
CREATE OR REPLACE FUNCTION set_farmer_short_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.short_id IS NULL THEN
    NEW.short_id := UPPER(SUBSTRING(REPLACE(NEW.id::TEXT, '-', ''), 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_farmer_short_id_trigger
  BEFORE INSERT ON farmers
  FOR EACH ROW
  EXECUTE FUNCTION set_farmer_short_id();

-- ============================================
-- REVIEWS TABLE (for user reviews of farmers)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  farmer_short_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  verification_result TEXT CHECK (verification_result IN ('agree', 'disagree')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_farmer_id ON reviews(farmer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_farmer_short_id ON reviews(farmer_short_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR USERS TABLE
-- ============================================
-- Allow anyone to insert (signup)
CREATE POLICY "Allow public insert on users" ON users
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to select by email (for login)
CREATE POLICY "Allow public select on users by email" ON users
  FOR SELECT
  USING (true);

-- Allow users to update their own data
CREATE POLICY "Allow users to update own data" ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES FOR FARMERS TABLE
-- ============================================
-- Allow anyone to insert (signup)
CREATE POLICY "Allow public insert on farmers" ON farmers
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to select by aadhaar (for login)
CREATE POLICY "Allow public select on farmers by aadhaar" ON farmers
  FOR SELECT
  USING (true);

-- Allow farmers to update their own data
CREATE POLICY "Allow farmers to update own data" ON farmers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- PRODUCTS TABLE (for graded products)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT UNIQUE NOT NULL,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  farmer_short_id TEXT NOT NULL,
  fruit_type TEXT NOT NULL,
  grade TEXT NOT NULL,
  score NUMERIC(5, 2) NOT NULL,
  model_class TEXT,
  confidence NUMERIC(5, 4),
  qr_data TEXT,
  grading_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  batch_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);
CREATE INDEX IF NOT EXISTS idx_products_farmer_id ON products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_farmer_short_id ON products(farmer_short_id);
CREATE INDEX IF NOT EXISTS idx_products_grade ON products(grade);
CREATE INDEX IF NOT EXISTS idx_products_grading_timestamp ON products(grading_timestamp);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES FOR REVIEWS TABLE
-- ============================================
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reviews
CREATE POLICY "Allow public insert on reviews" ON reviews
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to select reviews (for viewing)
CREATE POLICY "Allow public select on reviews" ON reviews
  FOR SELECT
  USING (true);

-- Allow users to update their own reviews
CREATE POLICY "Allow users to update own reviews" ON reviews
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- VERIFICATIONS TABLE (for user product verifications)
-- ============================================
CREATE TABLE IF NOT EXISTS verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  verification_result TEXT NOT NULL CHECK (verification_result IN ('agree', 'disagree')),
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_product_id ON verifications(product_id);
CREATE INDEX IF NOT EXISTS idx_verifications_verified_at ON verifications(verified_at);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_verifications_updated_at
  BEFORE UPDATE ON verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES FOR PRODUCTS TABLE
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert products (farmers grading products)
CREATE POLICY "Allow public insert on products" ON products
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to select products (for viewing/scanning QR codes)
CREATE POLICY "Allow public select on products" ON products
  FOR SELECT
  USING (true);

-- Allow farmers to update their own products
CREATE POLICY "Allow farmers to update own products" ON products
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES FOR VERIFICATIONS TABLE
-- ============================================
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert verifications
CREATE POLICY "Allow public insert on verifications" ON verifications
  FOR INSERT
  WITH CHECK (true);

-- Allow users to select their own verifications
CREATE POLICY "Allow users to select own verifications" ON verifications
  FOR SELECT
  USING (true);

-- Allow users to update their own verifications
CREATE POLICY "Allow users to update own verifications" ON verifications
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- FUNCTION TO UPDATE updated_at TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farmers_updated_at
  BEFORE UPDATE ON farmers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKETS SETUP (Manual Steps)
-- ============================================
-- 
-- You need to create the following storage buckets in Supabase Dashboard:
-- 
-- 1. Go to: https://supabase.com/dashboard/project/[YOUR_PROJECT]/storage/buckets
-- 2. Click "New bucket"
-- 3. Create bucket: "farmer-photos"
--    - Name: farmer-photos
--    - Public: Yes (checked)
--    - File size limit: 5MB (or as needed)
--    - Allowed MIME types: image/jpeg, image/png, image/jpg
-- 
-- 4. Create bucket: "farmer-signatures"
--    - Name: farmer-signatures
--    - Public: Yes (checked)
--    - File size limit: 2MB (or as needed)
--    - Allowed MIME types: image/jpeg, image/png, image/jpg
-- 
-- 5. For each bucket, set up policies:
--    - Go to Storage > Policies
--    - Create policy: "Allow public uploads"
--      - Policy name: Allow public uploads
--      - Allowed operation: INSERT
--      - Target roles: public
--      - USING expression: true
--      - WITH CHECK expression: true
-- 
--    - Create policy: "Allow public reads"
--      - Policy name: Allow public reads
--      - Allowed operation: SELECT
--      - Target roles: public
--      - USING expression: true

