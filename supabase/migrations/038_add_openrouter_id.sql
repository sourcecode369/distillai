
-- Add openrouter_id column to ai_models table
ALTER TABLE public.ai_models ADD COLUMN IF NOT EXISTS openrouter_id TEXT;
CREATE INDEX IF NOT EXISTS idx_ai_models_openrouter_id ON ai_models(openrouter_id);
