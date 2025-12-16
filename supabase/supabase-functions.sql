-- SQL Functions for efficiently fetching distinct categories and publishers
-- Run this in your Supabase SQL Editor

-- Function to get distinct categories
CREATE OR REPLACE FUNCTION get_distinct_categories()
RETURNS TABLE (category TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT models_catalog.category
  FROM models_catalog
  WHERE models_catalog.category IS NOT NULL
  ORDER BY models_catalog.category;
END;
$$ LANGUAGE plpgsql;

-- Function to get distinct publishers
CREATE OR REPLACE FUNCTION get_distinct_publishers()
RETURNS TABLE (publisher TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT models_catalog.publisher
  FROM models_catalog
  WHERE models_catalog.publisher IS NOT NULL
  ORDER BY models_catalog.publisher;
END;
$$ LANGUAGE plpgsql;
