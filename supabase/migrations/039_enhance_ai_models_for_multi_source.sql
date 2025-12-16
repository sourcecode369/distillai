-- Migration: Enhance ai_models table for multi-source model merging
-- Adds tier classification, access type, canonical IDs, and flexible links storage

-- Add tier classification column
ALTER TABLE public.ai_models
ADD COLUMN IF NOT EXISTS tier VARCHAR(10)
CHECK (tier IN ('tier_1', 'tier_2', 'tier_3'));

-- Add access type column (replaces is_api_only boolean with more flexibility)
ALTER TABLE public.ai_models
ADD COLUMN IF NOT EXISTS access_type VARCHAR(20) DEFAULT 'open_source'
CHECK (access_type IN ('api_only', 'open_source', 'hybrid'));

-- Add canonical model ID for cross-source deduplication
ALTER TABLE public.ai_models
ADD COLUMN IF NOT EXISTS canonical_model_id TEXT UNIQUE;

-- Add pipeline_tag from HuggingFace (useful for categorization)
ALTER TABLE public.ai_models
ADD COLUMN IF NOT EXISTS pipeline_tag TEXT;

-- Add flexible JSONB links field for future extensibility
-- Stores: {"huggingface": "url", "ollama": "url", "openrouter": "url", ...}
ALTER TABLE public.ai_models
ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '{}'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN ai_models.tier IS 'Organization tier: tier_1 (major companies), tier_2 (mid-size), tier_3 (research/community)';
COMMENT ON COLUMN ai_models.access_type IS 'Model accessibility: api_only (proprietary API), open_source (downloadable), hybrid (both)';
COMMENT ON COLUMN ai_models.canonical_model_id IS 'Normalized ID for merging same model across sources (e.g., hf:meta-llama-llama-31-8b)';
COMMENT ON COLUMN ai_models.links IS 'JSONB object containing URLs for all platforms where model is available';
COMMENT ON COLUMN ai_models.pipeline_tag IS 'HuggingFace pipeline tag (e.g., text-generation, image-to-text)';

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_ai_models_tier ON ai_models(tier);
CREATE INDEX IF NOT EXISTS idx_ai_models_access_type ON ai_models(access_type);
CREATE INDEX IF NOT EXISTS idx_ai_models_canonical_id ON ai_models(canonical_model_id);
CREATE INDEX IF NOT EXISTS idx_ai_models_pipeline_tag ON ai_models(pipeline_tag);
CREATE INDEX IF NOT EXISTS idx_ai_models_links ON ai_models USING GIN(links);

-- Create index for available_on array (if not exists)
CREATE INDEX IF NOT EXISTS idx_ai_models_available_on ON ai_models USING GIN(available_on);

-- Update existing records to populate access_type based on is_api_only
UPDATE ai_models
SET access_type = CASE
  WHEN is_api_only = true THEN 'api_only'
  WHEN is_api_only = false THEN 'open_source'
  ELSE 'open_source'
END
WHERE access_type IS NULL;

-- Populate canonical_model_id for existing records (if model_id exists)
-- This is a best-effort normalization
UPDATE ai_models
SET canonical_model_id =
  CASE
    WHEN source = 'huggingface' AND model_id IS NOT NULL THEN 'hf:' || LOWER(REPLACE(REPLACE(REPLACE(model_id, '/', '-'), '_', '-'), ' ', '-'))
    WHEN source = 'openrouter' AND openrouter_id IS NOT NULL THEN 'or:' || LOWER(REPLACE(REPLACE(REPLACE(openrouter_id, '/', '-'), '_', '-'), ' ', '-'))
    WHEN source = 'ollama' AND model_id IS NOT NULL THEN 'ollama:' || LOWER(REPLACE(REPLACE(REPLACE(model_id, '/', '-'), '_', '-'), ' ', '-'))
    ELSE 'legacy:' || id::text
  END
WHERE canonical_model_id IS NULL;

-- Populate links JSONB from existing URL columns
UPDATE ai_models
SET links = jsonb_build_object(
  'huggingface', COALESCE(huggingface_url, ''),
  'ollama', COALESCE(ollama_url, ''),
  'openrouter', COALESCE(openrouter_url, ''),
  'github', COALESCE(github_url, ''),
  'paper', COALESCE(paper_url, ''),
  'demo', COALESCE(demo_url, ''),
  'official', COALESCE(official_url, '')
)
WHERE links = '{}'::jsonb;

-- Remove empty strings from links JSONB
UPDATE ai_models
SET links = (
  SELECT jsonb_object_agg(key, value)
  FROM jsonb_each_text(links)
  WHERE value != ''
)
WHERE links != '{}'::jsonb;

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_models_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS ai_models_updated_at_trigger ON ai_models;
CREATE TRIGGER ai_models_updated_at_trigger
  BEFORE UPDATE ON ai_models
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_models_updated_at();

-- Grant permissions (maintain existing RLS)
-- Public can read, authenticated can insert/update (from 037 migration)
