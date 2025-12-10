-- Additional RLS policies for topics table
-- This file ensures proper access control for topics

-- Ensure the is_admin_user function exists (from 002_admin_policies.sql)
-- If it doesn't exist, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'is_admin_user' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    CREATE OR REPLACE FUNCTION public.is_admin_user()
    RETURNS BOOLEAN AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND is_admin = true
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END $$;

-- Verify RLS is enabled
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Anyone can view topics" ON topics;
DROP POLICY IF EXISTS "Admins can create topics" ON topics;
DROP POLICY IF EXISTS "Admins can update topics" ON topics;
DROP POLICY IF EXISTS "Admins can delete topics" ON topics;

-- Recreate policies
CREATE POLICY "Anyone can view topics"
  ON topics FOR SELECT
  USING (true);

CREATE POLICY "Admins can create topics"
  ON topics FOR INSERT
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update topics"
  ON topics FOR UPDATE
  USING (public.is_admin_user());

CREATE POLICY "Admins can delete topics"
  ON topics FOR DELETE
  USING (public.is_admin_user());




