-- Migration 002: waitlist_signups for Always Ready early-access pipeline
-- Run in Supabase SQL Editor.

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null,
  name text not null default '',
  business_name text not null default '',
  source text not null default 'always-ready-waitlist',
  status text not null default 'pending',   -- pending | contacted | admitted | declined
  submitted_at timestamptz,
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (email, source)
);

create index if not exists waitlist_signups_source_status_idx
  on public.waitlist_signups (source, status, created_at desc);

create index if not exists waitlist_signups_email_idx
  on public.waitlist_signups (email);

alter table public.waitlist_signups enable row level security;

drop policy if exists "service role manages waitlist" on public.waitlist_signups;
create policy "service role manages waitlist"
  on public.waitlist_signups
  for all
  to service_role
  using (true)
  with check (true);

grant all privileges on public.waitlist_signups to service_role;
