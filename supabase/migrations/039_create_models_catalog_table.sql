-- Migration: Create new models_catalog table for multi-source AI models
-- Clean structure designed for model merging across HuggingFace, OpenRouter, and Ollama

CREATE TABLE IF NOT EXISTS public.models_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Unique Identifiers
  canonical_model_id TEXT UNIQUE NOT NULL, -- Normalized ID for deduplication (e.g., "llama-31-8b")
  model_id TEXT NOT NULL, -- Primary model ID (usually from main source)

  -- Basic Info
  name TEXT NOT NULL,
  publisher TEXT NOT NULL, -- Meta, OpenAI, Mistral, etc.

  -- Classification
  tier VARCHAR(10) CHECK (tier IN ('tier_1', 'tier_2', 'tier_3')),
  access_type VARCHAR(20) DEFAULT 'open_source' CHECK (access_type IN ('api_only', 'open_source', 'hybrid')),
  category TEXT DEFAULT 'LLM', -- LLM, Vision, Audio, Multimodal
  pipeline_tag TEXT, -- From HuggingFace: text-generation, image-to-text, etc.

  -- Multi-Source Support
  source TEXT NOT NULL, -- Primary source: huggingface, openrouter, ollama
  available_on TEXT[] DEFAULT ARRAY[]::TEXT[], -- All platforms: ['huggingface', 'ollama', 'openrouter']
  links JSONB DEFAULT '{}'::jsonb, -- {"huggingface": "url", "ollama": "url", "openrouter": "url"}

  -- Descriptions (from APIs)
  short_description TEXT, -- Brief 1-2 sentence summary
  description TEXT, -- Longer description if available

  -- Metadata Arrays
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  task TEXT[] DEFAULT ARRAY[]::TEXT[], -- Tasks the model can perform

  -- Metrics (from APIs)
  downloads BIGINT DEFAULT 0,
  likes INTEGER DEFAULT 0,

  -- Additional Fields (nullable, for future use)
  license TEXT,
  huggingface_id TEXT, -- Original HF ID if applicable
  openrouter_id TEXT, -- Original OpenRouter ID if applicable

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_modified TIMESTAMPTZ -- External last modified date (from source API)
);

-- Comments for documentation
COMMENT ON TABLE models_catalog IS 'Unified catalog of AI models from multiple sources (HuggingFace, OpenRouter, Ollama)';
COMMENT ON COLUMN models_catalog.canonical_model_id IS 'Normalized unique ID for merging same model across sources (e.g., llama-31-8b)';
COMMENT ON COLUMN models_catalog.tier IS 'Organization tier: tier_1 (major companies like Meta, OpenAI), tier_2 (mid-size), tier_3 (research/community)';
COMMENT ON COLUMN models_catalog.access_type IS 'Model availability: api_only (proprietary API), open_source (downloadable), hybrid (both)';
COMMENT ON COLUMN models_catalog.available_on IS 'Array of platforms where model is available: huggingface, ollama, openrouter';
COMMENT ON COLUMN models_catalog.links IS 'JSONB object with URLs for all platforms: {"huggingface": "...", "ollama": "...", "openrouter": "..."}';
COMMENT ON COLUMN models_catalog.pipeline_tag IS 'HuggingFace pipeline category (text-generation, image-to-text, translation, etc.)';

-- Indexes for performance
CREATE INDEX idx_models_catalog_canonical_id ON models_catalog(canonical_model_id);
CREATE INDEX idx_models_catalog_model_id ON models_catalog(model_id);
CREATE INDEX idx_models_catalog_name ON models_catalog(name);
CREATE INDEX idx_models_catalog_publisher ON models_catalog(publisher);
CREATE INDEX idx_models_catalog_tier ON models_catalog(tier);
CREATE INDEX idx_models_catalog_access_type ON models_catalog(access_type);
CREATE INDEX idx_models_catalog_category ON models_catalog(category);
CREATE INDEX idx_models_catalog_source ON models_catalog(source);
CREATE INDEX idx_models_catalog_pipeline_tag ON models_catalog(pipeline_tag);

-- GIN indexes for array and JSONB fields
CREATE INDEX idx_models_catalog_available_on ON models_catalog USING GIN(available_on);
CREATE INDEX idx_models_catalog_tags ON models_catalog USING GIN(tags);
CREATE INDEX idx_models_catalog_links ON models_catalog USING GIN(links);

-- Full-text search index
CREATE INDEX idx_models_catalog_name_search ON models_catalog USING GIN(to_tsvector('english', name));
CREATE INDEX idx_models_catalog_description_search ON models_catalog USING GIN(to_tsvector('english', COALESCE(short_description, '')));

-- Popularity/metrics indexes
CREATE INDEX idx_models_catalog_downloads ON models_catalog(downloads DESC NULLS LAST);
CREATE INDEX idx_models_catalog_likes ON models_catalog(likes DESC NULLS LAST);

-- Timestamp indexes
CREATE INDEX idx_models_catalog_created_at ON models_catalog(created_at DESC);
CREATE INDEX idx_models_catalog_updated_at ON models_catalog(updated_at DESC);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_models_catalog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER models_catalog_updated_at_trigger
  BEFORE UPDATE ON models_catalog
  FOR EACH ROW
  EXECUTE FUNCTION update_models_catalog_updated_at();

-- Row Level Security (RLS)
ALTER TABLE models_catalog ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (everyone can view models)
CREATE POLICY "Allow public read access to models"
  ON public.models_catalog
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert (for admin scripts)
CREATE POLICY "Allow authenticated insert to models"
  ON public.models_catalog
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update
CREATE POLICY "Allow authenticated update to models"
  ON public.models_catalog
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to delete (for admin cleanup)
CREATE POLICY "Allow authenticated delete from models"
  ON public.models_catalog
  FOR DELETE
  TO authenticated
  USING (true);

-- Grant necessary permissions
GRANT SELECT ON public.models_catalog TO anon;
GRANT ALL ON public.models_catalog TO authenticated;
GRANT ALL ON public.models_catalog TO service_role;
