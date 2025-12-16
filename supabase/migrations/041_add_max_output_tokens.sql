-- Migration: Add max_output_tokens field to models_catalog
-- For API models (especially OpenRouter), this stores the maximum number of output tokens

ALTER TABLE public.models_catalog
ADD COLUMN IF NOT EXISTS max_output_tokens INTEGER;

COMMENT ON COLUMN models_catalog.max_output_tokens IS 'Maximum output tokens supported by the model (for API models)';

CREATE INDEX IF NOT EXISTS idx_models_catalog_max_output_tokens ON models_catalog(max_output_tokens DESC NULLS LAST);
