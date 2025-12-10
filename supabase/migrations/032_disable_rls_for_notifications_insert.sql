-- Completely remove RLS restrictions for INSERT
-- Check all existing policies first
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'notifications';

-- Drop ALL INSERT policies
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;
DROP POLICY IF EXISTS "Allow all inserts" ON notifications;
DROP POLICY IF EXISTS "Users can create notifications" ON notifications;

-- Create a single policy that allows ALL inserts
CREATE POLICY "Allow all notification inserts"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Verify it was created
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'notifications' AND cmd = 'INSERT';

-- If it still doesn't work, there might be another issue
-- Try disabling RLS entirely for INSERT (not recommended but for testing):
-- ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
-- But keep SELECT and UPDATE policies for user data protection


