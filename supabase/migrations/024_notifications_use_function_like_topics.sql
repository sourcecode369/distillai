-- Use the exact same pattern as topics table
-- Topics table uses: WITH CHECK (public.is_admin_user())
-- And it works! So let's use the same approach

-- First, ensure the function exists and is properly configured
-- The function MUST be SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  result BOOLEAN;
BEGIN
  -- SECURITY DEFINER should allow this to bypass RLS on user_profiles
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ) INTO result;
  
  RETURN COALESCE(result, false);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO service_role;

-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Use the EXACT same pattern as topics table
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (public.is_admin_user());

-- Test the function (should return true for admin users)
-- SELECT public.is_admin_user();

-- If the function still returns false, the issue is that SECURITY DEFINER
-- isn't bypassing RLS on user_profiles. In that case, we need to ensure
-- the function owner has proper permissions or use a different approach.

-- Verify the policy was created
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'notifications' 
AND policyname = 'Admins can create notifications';


