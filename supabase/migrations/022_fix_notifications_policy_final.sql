-- Final fix for notifications INSERT policy
-- The policy should allow admins to create notifications for ANY user_id
-- Let's verify and fix the policy

-- First, check what policies exist
-- SELECT * FROM pg_policies WHERE tablename = 'notifications';

-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Recreate with explicit check
-- The WITH CHECK only verifies the INSERTER is an admin
-- It does NOT restrict which user_id can be in the notification row
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    -- Check if current user (person doing the insert) is an admin
    -- This allows inserting notifications for ANY user_id value
    (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
  );

-- Verify the policy was created correctly
-- It should show: with_check = (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
-- NOT: WHERE id = auth.uid() = true (which would be wrong syntax)


