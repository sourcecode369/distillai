-- Bookmark Tags Table
-- Allows users to organize bookmarks with tags/folders
-- References bookmarks via user_id + category_id + topic_id (matching bookmarks unique constraint)

CREATE TABLE IF NOT EXISTS bookmark_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, topic_id, tag)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookmark_tags_user_id ON bookmark_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_tags_user_category_topic ON bookmark_tags(user_id, category_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_tags_tag ON bookmark_tags(tag);

-- Row Level Security (RLS) Policies
ALTER TABLE bookmark_tags ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookmark tags
CREATE POLICY "Users can view their own bookmark tags"
  ON bookmark_tags FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own bookmark tags
CREATE POLICY "Users can insert their own bookmark tags"
  ON bookmark_tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmark tags
CREATE POLICY "Users can delete their own bookmark tags"
  ON bookmark_tags FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all bookmark tags
CREATE POLICY "Admins can view all bookmark tags"
  ON bookmark_tags FOR SELECT
  USING (public.is_admin_user());

