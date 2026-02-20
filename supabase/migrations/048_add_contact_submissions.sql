create table if not exists public.contact_submissions (
  id         uuid        default gen_random_uuid() primary key,
  name       text        not null,
  email      text        not null,
  subject    text        not null,
  message    text        not null,
  is_read    boolean     default false,
  created_at timestamptz default now()
);

alter table public.contact_submissions enable row level security;

-- Anyone (guest or logged-in) can submit the contact form
create policy "Anyone can submit contact form"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

-- Only service role (admin) can read submissions
-- (access via Supabase dashboard or service-role key)
