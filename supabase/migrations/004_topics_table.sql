-- Topics Table for Content Management
-- This table stores topics that can be managed by admins

CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id TEXT NOT NULL,
  topic_id TEXT NOT NULL, -- Original topic ID from static files (for reference)
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'Beginner',
  read_time TEXT,
  tags TEXT[] DEFAULT '{}',
  content JSONB, -- Store full topic content (sections, quiz, etc.)
  is_custom BOOLEAN DEFAULT FALSE, -- true if created by admin, false if from static files
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, topic_id) -- Prevent duplicates per category
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_category_id ON topics(category_id);
CREATE INDEX IF NOT EXISTS idx_topics_topic_id ON topics(topic_id);
CREATE INDEX IF NOT EXISTS idx_topics_created_by ON topics(created_by);
CREATE INDEX IF NOT EXISTS idx_topics_updated_at ON topics(updated_at DESC);

-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read topics (for displaying content)
CREATE POLICY "Anyone can view topics"
  ON topics FOR SELECT
  USING (true);

-- Policy: Only admins can insert topics
CREATE POLICY "Admins can create topics"
  ON topics FOR INSERT
  WITH CHECK (public.is_admin_user());

-- Policy: Only admins can update topics
CREATE POLICY "Admins can update topics"
  ON topics FOR UPDATE
  USING (public.is_admin_user());

-- Policy: Only admins can delete topics
CREATE POLICY "Admins can delete topics"
  ON topics FOR DELETE
  USING (public.is_admin_user());

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_topics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on topic updates
CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW
  EXECUTE FUNCTION update_topics_updated_at();




