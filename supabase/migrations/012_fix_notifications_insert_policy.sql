-- Fix notifications INSERT policy
-- The issue is that the RLS policy is blocking inserts
-- Since is_admin_user() is SECURITY DEFINER, it should bypass RLS on user_profiles
-- But we need to ensure the function is properly accessible

-- Ensure the function exists and is SECURITY DEFINER (runs with creator's privileges)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $func$
BEGIN
  -- SECURITY DEFINER allows this to bypass RLS on user_profiles
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Recreate the policy using the SECURITY DEFINER function
-- This function bypasses RLS, so it can check admin status even when
-- the user_profiles table has RLS enabled
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (public.is_admin_user());

