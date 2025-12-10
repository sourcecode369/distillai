-- Create sections table
-- Sections organize categories into groups on the homepage

CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id TEXT UNIQUE NOT NULL, -- e.g., "core-ai-fields"
  title TEXT NOT NULL,
  subtitle TEXT,
  display_order INTEGER DEFAULT 0, -- For ordering sections on homepage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_sections_display_order ON sections(display_order);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION update_sections_updated_at();

-- Insert default sections (will be populated by migration script)
-- This is just the structure




