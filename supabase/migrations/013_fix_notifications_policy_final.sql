-- Final fix for notifications INSERT policy
-- The issue is that SECURITY DEFINER functions might not work in all RLS contexts
-- We'll use a different approach: grant the function owner explicit access

-- First, ensure the function exists and is owned by a superuser role
-- The function owner needs to be able to bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $func$
BEGIN
  -- SECURITY DEFINER runs with function owner's privileges
  -- This should bypass RLS on user_profiles
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Create the policy using the function
-- The function should bypass RLS when checking admin status
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (public.is_admin_user() = true);

-- Alternative: If the above still doesn't work, we can try using
-- a policy that directly queries with proper permissions
-- But first, let's test if the function approach works

-- Verify the function can be called
-- This is just for debugging - you can remove it after testing
DO $$
DECLARE
  test_user_id UUID;
  is_admin_result BOOLEAN;
BEGIN
  -- Get current user ID
  SELECT auth.uid() INTO test_user_id;
  
  -- Test the function
  SELECT public.is_admin_user() INTO is_admin_result;
  
  RAISE NOTICE 'Current user ID: %', test_user_id;
  RAISE NOTICE 'Is admin result: %', is_admin_result;
END $$;


