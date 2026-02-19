-- Migration: Add Featured Models Support
-- Description: Adds featured status columns to models_catalog, creates history tracking table,
--              updates RLS policies for admin-only featured control, and adds helper functions

-- ============================================================================
-- PART 1: Add Featured Columns to models_catalog
-- ============================================================================

ALTER TABLE public.models_catalog
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS featured_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS featured_by UUID REFERENCES auth.users(id);

-- Comments for documentation
COMMENT ON COLUMN models_catalog.is_featured IS 'Whether model is currently featured (admin-controlled)';
COMMENT ON COLUMN models_catalog.featured_until IS 'Optional end date for featured status (not auto-enforced, for admin reference only)';
COMMENT ON COLUMN models_catalog.featured_at IS 'Timestamp when model was most recently featured';
COMMENT ON COLUMN models_catalog.featured_by IS 'Admin user ID who featured the model';

-- Indexes for efficient featured model queries
CREATE INDEX IF NOT EXISTS idx_models_catalog_is_featured
  ON models_catalog(is_featured)
  WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_models_catalog_featured_at
  ON models_catalog(featured_at DESC NULLS LAST)
  WHERE is_featured = true;

-- ============================================================================
-- PART 2: Create featured_models_history Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.featured_models_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Model reference (SET NULL on delete to preserve history)
  model_id UUID REFERENCES models_catalog(id) ON DELETE SET NULL,
  canonical_model_id TEXT NOT NULL,
  model_name TEXT NOT NULL,
  publisher TEXT NOT NULL,

  -- Featured period tracking
  featured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unfeatured_at TIMESTAMPTZ,
  featured_until TIMESTAMPTZ, -- Admin-set target date (reference only)

  -- Admin tracking
  featured_by UUID REFERENCES auth.users(id),
  unfeatured_by UUID REFERENCES auth.users(id),

  -- Metadata snapshot at time of featuring (for analytics/monetization)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE featured_models_history IS 'Historical tracking of all featured model periods for analytics and monetization';
COMMENT ON COLUMN featured_models_history.featured_until IS 'Admin-provided target end date (not enforced automatically)';
COMMENT ON COLUMN featured_models_history.metadata IS 'Snapshot of model data at featuring time for historical analysis';

-- Indexes for history queries
CREATE INDEX IF NOT EXISTS idx_featured_history_model_id
  ON featured_models_history(model_id);

CREATE INDEX IF NOT EXISTS idx_featured_history_canonical_id
  ON featured_models_history(canonical_model_id);

CREATE INDEX IF NOT EXISTS idx_featured_history_featured_at
  ON featured_models_history(featured_at DESC);

CREATE INDEX IF NOT EXISTS idx_featured_history_unfeatured_at
  ON featured_models_history(unfeatured_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_featured_history_featured_by
  ON featured_models_history(featured_by);

CREATE INDEX IF NOT EXISTS idx_featured_history_metadata
  ON featured_models_history USING GIN(metadata);

-- Trigger for updated_at
CREATE TRIGGER featured_history_updated_at_trigger
  BEFORE UPDATE ON featured_models_history
  FOR EACH ROW
  EXECUTE FUNCTION update_models_catalog_updated_at(); -- Reuse existing trigger function

-- ============================================================================
-- PART 3: Update RLS Policies - Admin-Only Featured Updates
-- ============================================================================

-- Drop existing overly permissive update policy
DROP POLICY IF EXISTS "Allow authenticated update to models" ON public.models_catalog;

-- Recreate update policy: authenticated users can update (featured changes enforced by trigger below)
CREATE POLICY "Allow authenticated update to models"
  ON public.models_catalog
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger function to enforce admin-only featured updates
CREATE OR REPLACE FUNCTION public.enforce_featured_admin_only()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if featured fields are being changed
  IF (NEW.is_featured IS DISTINCT FROM OLD.is_featured
      OR NEW.featured_until IS DISTINCT FROM OLD.featured_until
      OR NEW.featured_at IS DISTINCT FROM OLD.featured_at
      OR NEW.featured_by IS DISTINCT FROM OLD.featured_by) THEN

    -- Verify user is admin
    IF NOT public.is_admin_user() THEN
      RAISE EXCEPTION 'Only admins can modify featured status';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to models_catalog
DROP TRIGGER IF EXISTS enforce_featured_admin_only_trigger ON public.models_catalog;
CREATE TRIGGER enforce_featured_admin_only_trigger
  BEFORE UPDATE ON public.models_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_featured_admin_only();

-- RLS for featured_models_history table
ALTER TABLE featured_models_history ENABLE ROW LEVEL SECURITY;

-- Public read access to history
CREATE POLICY "Allow public read access to featured history"
  ON public.featured_models_history
  FOR SELECT
  USING (true);

-- Only admins can insert/update history
CREATE POLICY "Allow admin insert to featured history"
  ON public.featured_models_history
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Allow admin update to featured history"
  ON public.featured_models_history
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Grant necessary permissions
GRANT SELECT ON public.featured_models_history TO anon;
GRANT ALL ON public.featured_models_history TO authenticated;
GRANT ALL ON public.featured_models_history TO service_role;

-- ============================================================================
-- PART 4: Helper Functions
-- ============================================================================

-- Function: feature_model
-- Purpose: Feature a model and create history entry
CREATE OR REPLACE FUNCTION public.feature_model(
  p_model_id UUID,
  p_featured_until TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id UUID;
  v_model_record RECORD;
  v_history_id UUID;
BEGIN
  -- Get admin user ID
  v_admin_id := auth.uid();

  -- Verify admin status
  IF NOT public.is_admin_user() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Admin privileges required'
    );
  END IF;

  -- Get model details
  SELECT * INTO v_model_record
  FROM models_catalog
  WHERE id = p_model_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Model not found'
    );
  END IF;

  -- Update model to featured
  UPDATE models_catalog
  SET
    is_featured = true,
    featured_at = NOW(),
    featured_until = p_featured_until,
    featured_by = v_admin_id
  WHERE id = p_model_id;

  -- Create history entry with metadata snapshot
  INSERT INTO featured_models_history (
    model_id,
    canonical_model_id,
    model_name,
    publisher,
    featured_at,
    featured_until,
    featured_by,
    metadata
  ) VALUES (
    p_model_id,
    v_model_record.canonical_model_id,
    v_model_record.name,
    v_model_record.publisher,
    NOW(),
    p_featured_until,
    v_admin_id,
    jsonb_build_object(
      'tier', v_model_record.tier,
      'access_type', v_model_record.access_type,
      'category', v_model_record.category,
      'downloads', v_model_record.downloads,
      'likes', v_model_record.likes,
      'parameters', v_model_record.parameters,
      'parameters_display', v_model_record.parameters_display
    )
  )
  RETURNING id INTO v_history_id;

  RETURN jsonb_build_object(
    'success', true,
    'history_id', v_history_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Function: unfeature_model
-- Purpose: Unfeature a model and update history entry
CREATE OR REPLACE FUNCTION public.unfeature_model(p_model_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  v_admin_id := auth.uid();

  -- Verify admin status
  IF NOT public.is_admin_user() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Admin privileges required'
    );
  END IF;

  -- Update model
  UPDATE models_catalog
  SET
    is_featured = false,
    featured_until = NULL
  WHERE id = p_model_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Model not found'
    );
  END IF;

  -- Update most recent history entry (use subquery to get the id)
  UPDATE featured_models_history
  SET
    unfeatured_at = NOW(),
    unfeatured_by = v_admin_id
  WHERE id = (
    SELECT id
    FROM featured_models_history
    WHERE model_id = p_model_id
      AND unfeatured_at IS NULL
    ORDER BY featured_at DESC
    LIMIT 1
  );

  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.feature_model TO authenticated;
GRANT EXECUTE ON FUNCTION public.unfeature_model TO authenticated;

-- Comments for documentation
COMMENT ON FUNCTION public.feature_model IS 'Feature a model (admin only). Creates history entry and updates model status.';
COMMENT ON FUNCTION public.unfeature_model IS 'Unfeature a model (admin only). Updates history entry and model status.';
