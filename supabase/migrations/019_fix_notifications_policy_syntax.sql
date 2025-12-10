-- Fix the syntax error in the notifications INSERT policy
-- The current policy has: WHERE user_profiles.id = auth.uid() = true
-- This is incorrect - it should be: WHERE user_profiles.id = auth.uid() and then = true outside

-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Recreate with correct syntax
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
  );


