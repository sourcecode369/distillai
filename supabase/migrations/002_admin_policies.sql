-- Admin RLS Policies
-- These policies allow users with is_admin = true to access all data

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies for user_profiles
CREATE POLICY "Admins can view all user profiles"
  ON user_profiles FOR SELECT
  USING (public.is_admin_user());

CREATE POLICY "Admins can update all user profiles"
  ON user_profiles FOR UPDATE
  USING (public.is_admin_user());

-- Admin policies for bookmarks
CREATE POLICY "Admins can view all bookmarks"
  ON bookmarks FOR SELECT
  USING (public.is_admin_user());

-- Admin policies for reading_history
CREATE POLICY "Admins can view all reading history"
  ON reading_history FOR SELECT
  USING (public.is_admin_user());

-- Admin policies for user_progress
CREATE POLICY "Admins can view all user progress"
  ON user_progress FOR SELECT
  USING (public.is_admin_user());

-- Note: User deletion requires service role key or additional setup
-- For production, consider using Supabase Admin API or service role key
-- in a secure backend service rather than client-side deletion




