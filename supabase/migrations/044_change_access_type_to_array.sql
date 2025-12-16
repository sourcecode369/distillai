-- Migration: Change access_type to TEXT[] to store platform availability
-- This allows filtering models by which platform(s) they're available on

-- Drop the old constraint
ALTER TABLE public.models_catalog
DROP CONSTRAINT IF EXISTS models_catalog_access_type_check;

-- Drop the old default value first
ALTER TABLE public.models_catalog
ALTER COLUMN access_type DROP DEFAULT;

-- Change access_type to TEXT[] (array of platforms)
ALTER TABLE public.models_catalog
ALTER COLUMN access_type TYPE TEXT[] USING
  CASE
    WHEN access_type = 'api_only' THEN ARRAY['openrouter']::TEXT[]
    WHEN access_type = 'open_source' THEN ARRAY['huggingface']::TEXT[]
    WHEN access_type = 'hybrid' THEN ARRAY['huggingface', 'openrouter', 'ollama']::TEXT[]
    ELSE ARRAY[access_type]::TEXT[]
  END;

-- Set default to empty array
ALTER TABLE public.models_catalog
ALTER COLUMN access_type SET DEFAULT ARRAY[]::TEXT[];

-- Update comment
COMMENT ON COLUMN models_catalog.access_type IS 'Array of platforms where model is available: huggingface, ollama, openrouter';

-- Drop old index
DROP INDEX IF EXISTS idx_models_catalog_access_type;

-- Create GIN index for array queries (for filtering by platform)
CREATE INDEX idx_models_catalog_access_type ON models_catalog USING GIN (access_type);
