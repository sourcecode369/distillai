-- Add section field to topics table for custom section classification
-- This allows topics to be organized by meaningful sections (e.g., "Fundamentals", "Core Concepts", "Advanced Topics")

-- Add column only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'topics' AND column_name = 'section'
  ) THEN
    ALTER TABLE topics ADD COLUMN section TEXT;

    -- Add index for better query performance
    CREATE INDEX idx_topics_section ON topics(section);

    -- Update existing topics to have sections based on their difficulty
    -- This is a starting point - admins can customize these later
    UPDATE topics
    SET section = CASE
      WHEN difficulty = 'Beginner' THEN 'Fundamentals'
      WHEN difficulty = 'Intermediate' THEN 'Core Concepts'
      WHEN difficulty = 'Advanced' THEN 'Advanced Topics'
      ELSE 'Fundamentals'
    END
    WHERE section IS NULL;
  END IF;
END $$;
