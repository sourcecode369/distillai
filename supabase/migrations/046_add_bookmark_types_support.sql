-- Migration: Add Bookmark Types Support
-- Description: Adds support for different bookmark types (models, topics, tools, etc.)
--              by adding type and item_id columns to the bookmarks table

-- ============================================================================
-- PART 1: Add new columns to bookmarks table
-- ============================================================================

-- Add type column (default 'topic' for existing records)
ALTER TABLE public.bookmarks
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'topic';

-- Add item_id column (for direct reference to items like models)
ALTER TABLE public.bookmarks
ADD COLUMN IF NOT EXISTS item_id TEXT;

-- Add comments for documentation
COMMENT ON COLUMN bookmarks.type IS 'Type of bookmark: topic, model, tool, etc.';
COMMENT ON COLUMN bookmarks.item_id IS 'Direct ID reference for non-topic bookmarks (e.g., model UUID)';

-- ============================================================================
-- PART 2: Migrate existing data
-- ============================================================================

-- For existing topic bookmarks, set item_id to combination of category_id and topic_id
UPDATE public.bookmarks
SET item_id = category_id || '-' || topic_id
WHERE item_id IS NULL AND category_id IS NOT NULL AND topic_id IS NOT NULL;

-- ============================================================================
-- PART 3: Update indexes for better query performance
-- ============================================================================

-- Drop old index if exists
DROP INDEX IF EXISTS idx_bookmarks_user_category_topic;

-- Create new composite index for topic bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_category_topic
  ON public.bookmarks(user_id, category_id, topic_id)
  WHERE type = 'topic';

-- Create index for direct item lookup (models, tools, etc.)
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_item
  ON public.bookmarks(user_id, type, item_id)
  WHERE item_id IS NOT NULL;

-- Create index for type-based queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_type
  ON public.bookmarks(user_id, type, created_at DESC);

-- ============================================================================
-- PART 4: Update constraints
-- ============================================================================

-- Allow NULL category_id and topic_id for non-topic bookmarks
-- (Remove NOT NULL constraint if it exists)
ALTER TABLE public.bookmarks
ALTER COLUMN category_id DROP NOT NULL;

ALTER TABLE public.bookmarks
ALTER COLUMN topic_id DROP NOT NULL;

-- Add check constraint: either (categoryId + topicId) or item_id must be set
ALTER TABLE public.bookmarks
DROP CONSTRAINT IF EXISTS bookmarks_reference_check;

ALTER TABLE public.bookmarks
ADD CONSTRAINT bookmarks_reference_check
CHECK (
  (category_id IS NOT NULL AND topic_id IS NOT NULL) OR
  (item_id IS NOT NULL)
);

COMMENT ON CONSTRAINT bookmarks_reference_check ON public.bookmarks IS 'Ensures either topic reference (category_id + topic_id) or item_id is provided';
