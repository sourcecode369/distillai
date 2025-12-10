-- Fix notifications INSERT policy
-- The previous policy might not be working correctly, so we'll drop and recreate it

-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Recreate the policy using the is_admin_user function (same as topics table)
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (public.is_admin_user());

