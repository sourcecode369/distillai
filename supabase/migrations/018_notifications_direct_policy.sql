-- Use direct subquery approach - users can read their own profile
-- This bypasses the function issue entirely

-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Create policy using direct subquery
-- The WITH CHECK verifies that the person INSERTING (auth.uid()) is an admin
-- It does NOT restrict which user_id can be in the notification row
-- This allows admins to create notifications for ANY user
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    -- Check if the current user (person doing the insert) is an admin
    -- This allows admins to insert notifications for any user_id
    (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
  );

-- This approach works because:
-- 1. The RLS policy "Users can view their own profile" allows: auth.uid() = id
-- 2. When we query WHERE id = auth.uid(), it matches the user's own profile
-- 3. So the subquery can read is_admin from the user's own profile
-- 4. The WITH CHECK only verifies the INSERTER is an admin, not the notification recipient
-- 5. This allows admins to create notifications for any user_id value

