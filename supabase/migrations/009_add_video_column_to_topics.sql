-- Add video column to topics table
-- This allows storing YouTube/video URLs directly on the topic

ALTER TABLE topics 
ADD COLUMN IF NOT EXISTS video TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN topics.video IS 'YouTube embed URL or video URL for the topic';

-- Create index for video column (useful for filtering topics with videos)
CREATE INDEX IF NOT EXISTS idx_topics_video ON topics(video) WHERE video IS NOT NULL;


