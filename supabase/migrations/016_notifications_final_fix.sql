-- Final comprehensive fix for notifications INSERT policy
-- The user is confirmed to be an admin, so the issue is with RLS evaluation

-- Step 1: Test if the function works when called directly
-- Run this to verify: SELECT public.is_admin_user();
-- If it returns true, the function works, but RLS policy evaluation is the issue

-- Step 2: Recreate the function with maximum permissions
DROP FUNCTION IF EXISTS public.is_admin_user() CASCADE;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  -- SECURITY DEFINER should bypass RLS, but let's be explicit
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$;

-- Grant execute to all roles
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO service_role;

-- Step 3: Drop and recreate the policy
-- Try using the function first
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (public.is_admin_user());

-- Step 4: If the above still doesn't work, the issue is that RLS policy evaluation
-- can't properly call SECURITY DEFINER functions. In that case, we need to
-- use a workaround: create a policy that allows inserts when created_by matches
-- the current user AND the user is an admin, OR use a different approach.

-- Alternative approach if function doesn't work in RLS context:
-- We can create a policy that checks admin status via a materialized approach
-- But first, let's test if the function approach works now.

-- Step 5: Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'notifications' AND policyname = 'Admins can create notifications';


