/*
  # Nepal Gift House Database Schema

  ## Overview
  Complete database schema for Nepal Gift House - a gift shop e-commerce platform
  with admin approval workflow, role-based access, and WhatsApp ordering.

  ## Tables Created

  ### 1. profiles
  Extends Supabase auth.users with custom fields
  - `id` (uuid, FK to auth.users)
  - `full_name` (text)
  - `phone` (text)
  - `role` (enum: 'admin', 'staff', 'customer')
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### 2. categories
  Product categories (Teddy Bears, Gifts, etc.)
  - `id` (uuid, primary key)
  - `name` (text)
  - `slug` (text, unique)
  - `description` (text)
  - `display_order` (integer)
  - `created_at` (timestamp)

  ### 3. products
  Main product catalog
  - `id` (uuid, primary key)
  - `category_id` (uuid, FK to categories)
  - `name` (text)
  - `description` (text)
  - `price` (numeric)
  - `offer_price` (numeric, nullable)
  - `images` (jsonb array)
  - `tags` (text array)
  - `status` (enum: 'draft', 'live', 'out_of_stock')
  - `created_by` (uuid, FK to profiles)
  - `approved_by` (uuid, FK to profiles, nullable)
  - `approved_at` (timestamp, nullable)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### 4. featured_items
  Homepage featured products and banners
  - `id` (uuid, primary key)
  - `product_id` (uuid, FK to products, nullable)
  - `title` (text)
  - `subtitle` (text)
  - `image_url` (text)
  - `type` (enum: 'banner', 'featured_product', 'offer')
  - `display_order` (integer)
  - `is_active` (boolean)
  - `created_at` (timestamp)

  ## Security (RLS Policies)

  ### profiles
  - Authenticated users can read all profiles
  - Users can update their own profile
  - Only admins can change roles

  ### categories
  - Everyone can read categories
  - Only admins can create/update/delete

  ### products
  - Everyone can read LIVE products
  - Staff and admins can read ALL products
  - Staff can create products (auto-set to DRAFT)
  - Admins can update/delete/approve products
  - Staff can only update their own DRAFT products

  ### featured_items
  - Everyone can read active featured items
  - Only admins can manage featured items

  ## Notes
  - All timestamps use timestamptz for timezone support
  - Images stored as JSONB array for flexibility
  - Tags stored as text array for easy filtering
  - Approval workflow enforced through RLS and status field
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE product_status AS ENUM ('draft', 'live', 'out_of_stock');
CREATE TYPE featured_type AS ENUM ('banner', 'featured_product', 'offer');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  role user_role DEFAULT 'customer' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL,
  offer_price numeric(10, 2),
  images jsonb DEFAULT '[]'::jsonb NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[] NOT NULL,
  status product_status DEFAULT 'draft' NOT NULL,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create featured_items table
CREATE TABLE IF NOT EXISTS featured_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  title text NOT NULL,
  subtitle text,
  image_url text,
  type featured_type NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE featured_items ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_featured_items_active ON featured_items(is_active, display_order);

-- RLS Policies for profiles
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for categories
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for products
CREATE POLICY "Anyone can read live products"
  ON products FOR SELECT
  TO authenticated, anon
  USING (status = 'live');

CREATE POLICY "Staff and admins can read all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff can create products as draft"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
    AND created_by = auth.uid()
    AND status = 'draft'
  );

CREATE POLICY "Staff can update own draft products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    AND status = 'draft'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'staff'
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    AND status = 'draft'
  );

CREATE POLICY "Admins can update any product"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for featured_items
CREATE POLICY "Anyone can read active featured items"
  ON featured_items FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can read all featured items"
  ON featured_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage featured items"
  ON featured_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Teddy Bears', 'teddy-bears', 'Soft and cuddly teddy bears perfect for gifting', 1),
  ('Gift Items', 'gift-items', 'Special gift items for all occasions', 2),
  ('Festival Specials', 'festival-specials', 'Special items for festivals and celebrations', 3)
ON CONFLICT (slug) DO NOTHING;