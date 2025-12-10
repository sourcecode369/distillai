-- Direct check approach - verify admin status can be checked
-- First, let's test if we can query the admin status

-- Drop existing policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Test: Let's see if we can create a simpler policy first
-- This checks if the user can read their own profile with is_admin = true
-- Since users can read their own profile, this should work
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    -- Direct query - users should be able to read their own profile
    (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
  );

-- If the above doesn't work, it means the subquery in WITH CHECK
-- is being blocked by RLS on user_profiles even for own profile reads

-- Alternative: Create a helper function that's simpler
CREATE OR REPLACE FUNCTION public.check_is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- But we still need to use it in the policy, which might have the same issue

-- Let's try yet another approach: Grant the authenticated role
-- permission to read from user_profiles for admin checks
-- But this might be too permissive

-- Actually, the best solution might be to ensure the function
-- can definitely bypass RLS. Let's recreate it with explicit settings:

DROP FUNCTION IF EXISTS public.is_admin_user() CASCADE;

CREATE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  result BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ) INTO result;
  
  RETURN COALESCE(result, false);
END;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon;

-- Now try the policy with the function again
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (public.is_admin_user());


