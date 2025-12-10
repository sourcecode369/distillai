-- Fix the admin SELECT policy on user_profiles
-- The is_admin_user() function isn't working, so we'll use a direct check

-- Drop the existing admin SELECT policy
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;

-- Recreate using direct subquery (same approach as notifications)
CREATE POLICY "Admins can view all user profiles"
  ON user_profiles FOR SELECT
  USING (
    -- Check if current user is an admin by reading their own profile
    (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
  );

-- This allows admins to see all user profiles
-- The USING clause checks if the viewer (auth.uid()) is an admin
-- If true, they can see all rows (no additional WHERE clause needed)


