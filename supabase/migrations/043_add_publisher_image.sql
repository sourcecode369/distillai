-- Migration: Add publisher_image field to models_catalog
-- Stores the logo/avatar URL for each publisher/organization

ALTER TABLE public.models_catalog
ADD COLUMN IF NOT EXISTS publisher_image TEXT;

COMMENT ON COLUMN models_catalog.publisher_image IS 'Logo/avatar URL for the publisher organization';

CREATE INDEX IF NOT EXISTS idx_models_catalog_publisher_image ON models_catalog(publisher_image) WHERE publisher_image IS NOT NULL;
