-- Final solution: Use direct subquery that reads own profile
-- Users can read their own profile, so this should work
-- This bypasses the function issue entirely

-- Drop the policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Create policy using direct subquery
-- This works because:
-- 1. Users can read their own profile (per existing RLS policy)
-- 2. The subquery reads WHERE id = auth.uid() (own profile)
-- 3. So it can check is_admin from own profile
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
  );

-- Verify the policy
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'notifications' 
AND policyname = 'Admins can create notifications';

-- Test if you can read your own admin status
-- This should return true:
SELECT is_admin 
FROM public.user_profiles 
WHERE id = auth.uid();

-- If the above SELECT works and returns true, the policy should work
-- If it doesn't work, there's an RLS issue on user_profiles that needs fixing


