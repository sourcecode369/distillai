-- Migration: Add enrichment fields to models_catalog
-- Adds parameters, context_window, pricing, and benchmarks for richer model details

-- Add parameters (raw and display)
ALTER TABLE public.models_catalog
ADD COLUMN IF NOT EXISTS parameters NUMERIC, -- Raw number (e.g. 7000000000)
ADD COLUMN IF NOT EXISTS parameters_display TEXT; -- Display string (e.g. "7B")

-- Add context window
ALTER TABLE public.models_catalog
ADD COLUMN IF NOT EXISTS context_window INTEGER; -- Context window in tokens

-- Add pricing (JSONB for flexibility)
ALTER TABLE public.models_catalog
ADD COLUMN IF NOT EXISTS pricing JSONB; -- { "prompt": 5, "completion": 15, "currency": "USD", "per_tokens": 1000000 }

-- Add benchmarks (JSONB array for flexibility)
ALTER TABLE public.models_catalog
ADD COLUMN IF NOT EXISTS benchmarks JSONB; -- [{ "name": "MMLU", "score": 85.5, "unit": "%" }, ...]

-- Add AI insights cache column (if not exists from edge function work)
ALTER TABLE public.models_catalog
ADD COLUMN IF NOT EXISTS ai_insights JSONB;

-- Add comments
COMMENT ON COLUMN models_catalog.parameters IS 'Raw parameter count in billions (e.g., 7000000000 for 7B)';
COMMENT ON COLUMN models_catalog.parameters_display IS 'Human-readable parameter display (e.g., "7B", "70B")';
COMMENT ON COLUMN models_catalog.context_window IS 'Maximum context window size in tokens';
COMMENT ON COLUMN models_catalog.pricing IS 'JSONB pricing object: {"prompt": 5.0, "completion": 15.0} (per 1M tokens)';
COMMENT ON COLUMN models_catalog.benchmarks IS 'Array of benchmark results: [{"name": "MMLU", "score": 85.5, "unit": "%"}]';
COMMENT ON COLUMN models_catalog.ai_insights IS 'Cached AI-generated insights from Gemini';

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_models_catalog_parameters ON models_catalog(parameters DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_models_catalog_context_window ON models_catalog(context_window DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_models_catalog_benchmarks ON models_catalog USING GIN(benchmarks);
CREATE INDEX IF NOT EXISTS idx_models_catalog_ai_insights ON models_catalog USING GIN(ai_insights);
