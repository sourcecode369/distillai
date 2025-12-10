-- Enable required extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Schedule the job to run every Sunday at midnight
-- Replace <PROJECT_REF> and <ANON_KEY> with your actual values
select
  cron.schedule(
    'discover-tools-weekly', -- Job name
    '0 0 * * 0',            -- Cron schedule (Every Sunday at 00:00)
    $$
    select
      net.http_post(
        url:='https://<PROJECT_REF>.supabase.co/functions/v1/discover-tools',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer <ANON_KEY>"}'::jsonb,
        body:='{}'::jsonb
      ) as request_id;
    $$
  );

-- To check scheduled jobs:
-- select * from cron.job;

-- To unschedule:
-- select cron.unschedule('discover-tools-weekly');
