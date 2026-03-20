-- ============================================================
-- Unreserved.net — Supabase Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Items table
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  source_platform text not null,
  source_url text not null,
  category text not null,
  title text not null,
  year int,
  make text,
  model text,
  location text,
  description text,
  photos text[],
  vin text,
  km_hours text,
  currency text default 'CAD',
  starting_price decimal,
  created_at timestamptz default now()
);

-- 2. Prices table
create table if not exists prices (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete cascade unique not null,
  price decimal not null,
  starts_at timestamptz,
  ends_at timestamptz,
  bids int default 0,
  status text default 'upcoming' check (status in ('upcoming', 'live', 'sold')),
  updated_at timestamptz default now()
);

-- 3. Index for fast price lookups
create index if not exists idx_prices_item_id on prices(item_id);
create index if not exists idx_items_source_platform on items(source_platform);

-- 4. Enable Row Level Security
alter table items enable row level security;
alter table prices enable row level security;

-- 5. Items policies: anon can SELECT and INSERT
create policy "items_select_anon" on items
  for select to anon using (true);

create policy "items_insert_anon" on items
  for insert to anon with check (true);

-- 6. Prices policies: anon can SELECT, only service_role can INSERT/UPDATE
create policy "prices_select_anon" on prices
  for select to anon using (true);

create policy "prices_insert_service" on prices
  for insert to service_role with check (true);

create policy "prices_update_service" on prices
  for update to service_role using (true) with check (true);
