-- SmartLease Supabase Schema
-- Paste this into your Supabase SQL Editor (supabase.com > your project > SQL Editor)

-- 1. Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  major text,
  class_year text,
  gender text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Anyone can read profiles" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- 2. Roommate Profiles
create table roommate_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null unique,
  sleep_schedule text default 'Flexible',
  cleanliness integer default 3 check (cleanliness between 1 and 5),
  noise integer default 3 check (noise between 1 and 5),
  guests text default 'Sometimes',
  study_habits text default 'Both',
  bio text default '',
  budget_min integer default 500,
  budget_max integer default 1500,
  move_in text default 'Fall 2026',
  bed_preference text default '2 Bed',
  social_tags text[] default '{}',
  preferred_apartment_index integer,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table roommate_profiles enable row level security;
create policy "Anyone can read active roommate profiles" on roommate_profiles
  for select using (active = true);
create policy "Users can insert own roommate profile" on roommate_profiles
  for insert with check (auth.uid() = user_id);
create policy "Users can update own roommate profile" on roommate_profiles
  for update using (auth.uid() = user_id);


-- 3. Roommate Actions (match / pass)
create table roommate_actions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  target_user_id uuid references profiles(id) on delete cascade not null,
  action text not null check (action in ('match', 'pass')),
  created_at timestamptz default now(),
  unique(user_id, target_user_id)
);

alter table roommate_actions enable row level security;
create policy "Users can read own actions" on roommate_actions
  for select using (auth.uid() = user_id or auth.uid() = target_user_id);
create policy "Users can insert own actions" on roommate_actions
  for insert with check (auth.uid() = user_id);


-- 4. Reviews (no auth required)
create table reviews (
  id uuid default gen_random_uuid() primary key,
  apartment_index integer not null,
  stars integer not null check (stars between 1 and 5),
  text text not null,
  author_name text not null,
  class_year text,
  created_at timestamptz default now()
);

alter table reviews enable row level security;
create policy "Anyone can read reviews" on reviews for select using (true);
create policy "Anyone can insert reviews" on reviews for insert with check (true);


-- 5. Subleases (auth required to post)
create table subleases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  apartment_index integer not null,
  bed_type text not null,
  price integer not null,
  available_from date not null,
  available_until date not null,
  description text default '',
  contact_email text not null,
  active boolean default true,
  created_at timestamptz default now()
);

alter table subleases enable row level security;
create policy "Anyone can read active subleases" on subleases
  for select using (active = true);
create policy "Users can insert own subleases" on subleases
  for insert with check (auth.uid() = user_id);
create policy "Users can update own subleases" on subleases
  for update using (auth.uid() = user_id);
