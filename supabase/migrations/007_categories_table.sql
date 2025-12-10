-- Create categories table
-- Categories are the "handbooks" that contain topics

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT UNIQUE NOT NULL, -- e.g., "llms", "generative-ai"
  section_id TEXT REFERENCES sections(section_id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL, -- e.g., "Brain", "Sparkles" - maps to lucide-react icons
  color_classes TEXT NOT NULL, -- e.g., "bg-indigo-50 text-indigo-600"
  display_order INTEGER DEFAULT 0, -- For ordering categories within a section
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_section_id ON categories(section_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_category_id ON categories(category_id);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();




