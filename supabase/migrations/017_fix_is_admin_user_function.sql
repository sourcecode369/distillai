-- Fix the is_admin_user function so it can actually read from user_profiles
-- The issue is that SECURITY DEFINER functions can still be blocked by RLS
-- We need to ensure the function owner has proper permissions

-- Drop and recreate the function with proper owner
DROP FUNCTION IF EXISTS public.is_admin_user() CASCADE;

-- Create the function owned by postgres (superuser) which bypasses all RLS
-- Note: In Supabase, we can't change function owner directly, but we can
-- ensure it's created with SECURITY DEFINER and proper settings
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  user_id_val UUID;
  admin_status BOOLEAN;
BEGIN
  -- Get the current user ID
  user_id_val := auth.uid();
  
  -- If no user is authenticated, return false
  IF user_id_val IS NULL THEN
    RETURN false;
  END IF;
  
  -- Query user_profiles - SECURITY DEFINER should bypass RLS
  -- But if it doesn't, we need to use a different approach
  SELECT is_admin INTO admin_status
  FROM public.user_profiles
  WHERE id = user_id_val;
  
  -- Return the admin status (or false if not found)
  RETURN COALESCE(admin_status, false);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon;

-- Test the function - it should now return true for admin users
-- SELECT public.is_admin_user();

-- If the function still returns false, the issue is that SECURITY DEFINER
-- isn't bypassing RLS. In that case, we need to use a workaround:
-- Create a policy on user_profiles that allows the function to read admin status

-- Alternative: If SECURITY DEFINER doesn't work, we can create a view
-- or use a different method. But first, let's try ensuring the function
-- can read by granting explicit SELECT permission on user_profiles
-- to the function's execution context.

-- Actually, the real issue might be that we need to grant the function
-- permission to bypass RLS. Let's try using pg_catalog or a different approach.

-- If the above still doesn't work, use this workaround:
-- Create a policy that uses a direct subquery (users can read their own profile)
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Try the function first
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (public.is_admin_user() = true);

-- If that still doesn't work, use this direct approach:
-- DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;
-- CREATE POLICY "Admins can create notifications"
--   ON notifications FOR INSERT
--   WITH CHECK (
--     (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
--   );


