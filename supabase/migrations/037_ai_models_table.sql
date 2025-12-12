CREATE TABLE public.ai_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Info
  name TEXT NOT NULL,
  model_id TEXT UNIQUE, -- e.g., "meta-llama/Llama-3.1-405B"
  publisher TEXT, -- Meta, Mistral, etc.
  category TEXT NOT NULL, -- LLM, Vision, etc.
  model_type TEXT, -- 'base', 'instruct', 'unknown'
  
  -- Classification
  task TEXT[], -- text-generation, etc.
  modality TEXT[], -- text, image, audio, video
  tags TEXT[], -- expanded tags
  license TEXT,
  
  -- Size & Specs
  parameters NUMERIC, -- Raw number (e.g. 7000000000)
  parameters_display TEXT, -- Display string (e.g. "7B")
  context_window INTEGER, -- Context window in tokens
  quantizations TEXT[], -- ['GGUF', 'GPTQ', 'AWQ']
  
  -- Hardware (JSONB for flexibility)
  hardware_requirements JSONB, -- { "minimum_vram_gb": 24, "recommended_ram_gb": 32, "gpu_required": true }
  
  -- Pricing (JSONB)
  pricing JSONB, -- { "prompt": 5, "completion": 15, "currency": "USD", "per_tokens": 1000000 }
  
  -- Popularity Metrics
  downloads INTEGER,
  likes INTEGER,
  popularity_score INTEGER, -- Calculated score
  
  -- Source Info
  source TEXT NOT NULL, -- 'ollama', 'huggingface', 'openrouter', 'manual-curated'
  is_api_only BOOLEAN DEFAULT false,
  is_open_source BOOLEAN DEFAULT true,
  available_on TEXT[], -- ['ollama', 'huggingface', 'openrouter']
  sources_merged INTEGER DEFAULT 1,
  
  -- Descriptions & Images
  short_description TEXT,
  description TEXT, -- Longer description if available
  image_url TEXT, -- Thumbnail/featured image
  
  -- Links
  huggingface_url TEXT,
  ollama_url TEXT,
  openrouter_url TEXT,
  github_url TEXT,
  paper_url TEXT,
  demo_url TEXT,
  official_url TEXT,
  
  -- OpenRouter / API Specific
  top_provider JSONB, 
  per_request_limits JSONB,
  canonical_slug TEXT,
  huggingface_id TEXT,
  created_timestamp BIGINT,
  supported_parameters TEXT[],
  default_parameters JSONB,
  
  -- Metadata
  datasets TEXT[],
  languages TEXT[],
  architecture JSONB, -- { "modality": "text->text", "tokenizer": ... }
  
  -- Features
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_modified TIMESTAMPTZ -- External last modified date
);

-- Indexes for search performance
CREATE INDEX idx_ai_models_category ON ai_models(category);
CREATE INDEX idx_ai_models_publisher ON ai_models(publisher);
CREATE INDEX idx_ai_models_source ON ai_models(source);
CREATE INDEX idx_ai_models_name_search ON ai_models USING gin(to_tsvector('english', name));
CREATE INDEX idx_ai_models_downloads ON ai_models(downloads DESC NULLS LAST);

-- RLS Policies
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON public.ai_models FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert"
  ON public.ai_models FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
  ON public.ai_models FOR UPDATE
  TO authenticated
  USING (true);
