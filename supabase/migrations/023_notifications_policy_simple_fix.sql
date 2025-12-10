-- Comprehensive fix for notifications INSERT policy
-- The issue is that the WITH CHECK subquery might not be evaluating correctly
-- Let's try a completely different approach

-- First, let's see what policies currently exist
-- Run this to check: SELECT * FROM pg_policies WHERE tablename = 'notifications';

-- Drop ALL existing INSERT policies on notifications
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Approach 1: Simple policy - allow inserts when created_by is set
-- Since only admins can set created_by (and we control this in the code),
-- this should work. But we need to ensure created_by is always set for admin inserts.

-- Actually, let's try a different approach: Allow inserts when the user can read
-- their own profile AND their is_admin is true. This avoids subquery issues.

-- Create a simple policy that checks admin status directly
-- We'll use a CTE or a simpler check
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    -- Direct check: can the current user read their own profile with is_admin = true?
    -- This should work because users can always read their own profile
    EXISTS (
      SELECT 1 
      FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- If the above still doesn't work, the issue is that the subquery in WITH CHECK
-- can't read from user_profiles even for the current user's own row.

-- Alternative: Create a policy that allows inserts when created_by matches auth.uid()
-- AND the user is an admin. But this still requires checking admin status.

-- Let's also verify the user_profiles SELECT policy allows reading own profile
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

-- Test query to verify admin check works:
-- SELECT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true);


