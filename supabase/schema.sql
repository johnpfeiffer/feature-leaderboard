create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feature_requests (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (length(trim(title)) > 0 and length(title) <= 120),
  description text not null check (length(trim(description)) > 0 and length(description) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists feature_requests_created_at_id_idx
  on public.feature_requests (created_at desc, id desc);

alter table public.profiles enable row level security;
alter table public.feature_requests enable row level security;

create policy "authenticated users can read profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

create policy "users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "authenticated users can read feature requests"
  on public.feature_requests
  for select
  to authenticated
  using (true);

create policy "authenticated users can create their own feature requests"
  on public.feature_requests
  for insert
  to authenticated
  with check (auth.uid() = author_id);

