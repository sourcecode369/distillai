-- Migration: Remove duplicate models from models_catalog
-- Keep the first occurrence (lowest id) of each model_id and delete the rest

-- First, identify duplicates
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    -- Count duplicates
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT model_id, COUNT(*) as cnt
        FROM public.models_catalog
        GROUP BY model_id
        HAVING COUNT(*) > 1
    ) dups;

    RAISE NOTICE 'Found % duplicate model_ids', duplicate_count;

    -- Delete duplicates, keeping the row with the smallest id (oldest entry)
    DELETE FROM public.models_catalog
    WHERE id IN (
        SELECT id
        FROM (
            SELECT id,
                   ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY id ASC) as rn
            FROM public.models_catalog
        ) t
        WHERE t.rn > 1
    );

    GET DIAGNOSTICS duplicate_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % duplicate rows', duplicate_count;
END $$;

-- Add a unique constraint on model_id to prevent future duplicates
-- Drop the constraint if it already exists, then recreate it
ALTER TABLE public.models_catalog
DROP CONSTRAINT IF EXISTS unique_model_id;

ALTER TABLE public.models_catalog
ADD CONSTRAINT unique_model_id UNIQUE (model_id);

COMMENT ON CONSTRAINT unique_model_id ON public.models_catalog IS 'Ensures each model_id is unique in the catalog';
