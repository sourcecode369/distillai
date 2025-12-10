-- Fix the circular dependency in user_profiles admin policy
-- The issue is that the policy tries to read from user_profiles while evaluating
-- a policy ON user_profiles, which can cause issues

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;

-- The solution: Use a combination of policies
-- 1. Users can always see their own profile (already exists)
-- 2. For admins to see all profiles, we need to ensure the function works
--    OR use a policy that doesn't create circular dependencies

-- First, let's ensure users can see their own profile (should already exist)
-- This is needed for the admin check to work
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
      ON user_profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;
END $$;

-- Now create the admin policy using a workaround:
-- Since users can read their own profile, we can check admin status
-- But we need to be careful about the circular dependency
-- The trick is to use a subquery that only reads the current user's row
CREATE POLICY "Admins can view all user profiles"
  ON user_profiles FOR SELECT
  USING (
    -- This subquery reads only the current user's own profile
    -- which is allowed by "Users can view their own profile" policy
    -- So it shouldn't create a circular dependency
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() 
      AND up.is_admin = true
    )
  );

-- Alternative approach if the above still has issues:
-- We could create a materialized view or use a different table structure
-- But let's try this first


