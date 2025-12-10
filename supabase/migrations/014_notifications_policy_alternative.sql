-- Alternative approach: Use a policy that checks admin status directly
-- This avoids potential issues with SECURITY DEFINER functions in RLS context

-- First, let's check if we can read from user_profiles in the policy
-- We'll create a policy that uses a subquery with proper permissions

-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Try approach 1: Direct query with auth.uid() check
-- This should work if user_profiles allows reading your own row
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    -- Check if current user is admin by querying their own profile
    -- This works because users can always read their own profile
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- If the above doesn't work, the issue is that the policy can't read from user_profiles
-- even for the current user's own row. In that case, we need to ensure
-- the user_profiles SELECT policy allows reading your own profile (which it should)

-- Verify the user_profiles policy exists and allows reading own profile
-- This should already exist from migration 001_initial_schema.sql
-- But let's make sure:
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


