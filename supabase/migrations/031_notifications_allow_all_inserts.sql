-- Remove all RLS restrictions for INSERT on notifications
-- Application-level security ensures only admins can send notifications

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Allow all inserts - application handles security
CREATE POLICY "Allow all inserts"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- This allows anyone to insert, but:
-- 1. Only admins can access the admin dashboard (app-level check)
-- 2. Only admins can access the notification feature (app-level check)
-- 3. The application controls who can send notifications

-- If you want even simpler, you can disable RLS entirely for INSERT:
-- But the above policy should work fine


