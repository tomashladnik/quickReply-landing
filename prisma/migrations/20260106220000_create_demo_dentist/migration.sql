-- Create demo_dentist table (missing in prod)
create table if not exists public.demo_dentist (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists demo_dentist_email_idx on public.demo_dentist (email);

