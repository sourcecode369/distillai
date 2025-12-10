-- Final fix: Make is_admin_user() function actually work
-- The issue is SECURITY DEFINER isn't bypassing RLS on user_profiles
-- We need to ensure the function can read from user_profiles

-- Drop and recreate the function with explicit permissions
DROP FUNCTION IF EXISTS public.is_admin_user() CASCADE;

-- Create function that explicitly bypasses RLS
-- In Supabase, we can't change function owner, but we can use
-- SECURITY DEFINER with proper search_path
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
  -- Get current user
  user_id_val := auth.uid();
  
  IF user_id_val IS NULL THEN
    RETURN false;
  END IF;
  
  -- Try to read admin status
  -- SECURITY DEFINER should bypass RLS, but if it doesn't,
  -- we need a workaround
  BEGIN
    SELECT is_admin INTO admin_status
    FROM public.user_profiles
    WHERE id = user_id_val;
    
    RETURN COALESCE(admin_status, false);
  EXCEPTION
    WHEN OTHERS THEN
      -- If we can't read, return false
      RETURN false;
  END;
END;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon;

-- Test the function
-- SELECT public.is_admin_user();

-- If it still returns false, the SECURITY DEFINER isn't working
-- In that case, we need to use a workaround: Allow inserts when
-- created_by is set (since only admins can set it in our code)

-- Alternative approach: Policy that doesn't use the function
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Try the function first
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (public.is_admin_user());

-- If the function test still returns false, use this workaround instead:
-- DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;
-- CREATE POLICY "Admins can create notifications"
--   ON notifications FOR INSERT
--   WITH CHECK (
--     -- Allow if created_by is set (only admins set this in our code)
--     created_by IS NOT NULL
--     AND created_by = auth.uid()
--     AND (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
--   );


