-- Create policies
-- Allow everyone to read
create policy "Allow public read access"
  on public.ai_tools for select
  using (true);

-- Allow authenticated users (service role/functions) to insert/update
-- For simplicity in this demo, we'll allow anon insert if you want the frontend to trigger it directly via the edge function
-- But typically the Edge Function uses the SERVICE_ROLE_KEY to write.
-- Let's assume the Edge Function uses service_role, which bypasses RLS.
-- So we just need read access for the frontend.
