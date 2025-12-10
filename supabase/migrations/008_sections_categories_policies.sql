-- Row Level Security policies for sections and categories

-- Enable RLS
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Sections policies
-- Anyone can view sections
CREATE POLICY "Anyone can view sections"
  ON sections
  FOR SELECT
  USING (true);

-- Admins can manage sections
CREATE POLICY "Admins can manage sections"
  ON sections
  FOR ALL
  USING (is_admin_user());

-- Categories policies
-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
  ON categories
  FOR SELECT
  USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  USING (is_admin_user());




