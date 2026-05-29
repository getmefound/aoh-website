-- Migration 002: gap-based prospecting pipeline fields and owner-visible view.
-- Run in Supabase SQL Editor after Migration 001.

alter table public.prospecting_leads
  add column if not exists pipeline_stage text not null default 'cold',
  add column if not exists report_url text not null default '',
  add column if not exists grades jsonb not null default '{}'::jsonb,
  add column if not exists signal_statuses jsonb not null default '{}'::jsonb,
  add column if not exists place_id text not null default '',
  add column if not exists smartlead_campaign_id text not null default '',
  add column if not exists smartlead_lead_id text not null default '',
  add column if not exists smartlead_email_stats_id text not null default '',
  add column if not exists last_reply_intent text not null default '',
  add column if not exists last_reply_at timestamptz,
  add column if not exists last_reply_text text not null default '',
  add column if not exists report_sent_at timestamptz;

create index if not exists prospecting_leads_pipeline_stage_idx
  on public.prospecting_leads (pipeline_stage, updated_at desc);

create index if not exists prospecting_leads_report_url_idx
  on public.prospecting_leads (report_url)
  where report_url <> '';

create index if not exists prospecting_leads_smartlead_campaign_idx
  on public.prospecting_leads (smartlead_campaign_id, pipeline_stage, updated_at desc);

create or replace view public.prospecting_pipeline_view as
select
  id,
  created_at,
  updated_at,
  email,
  business_name,
  owner_first_name,
  phone,
  website,
  address,
  city,
  state,
  country,
  category,
  status,
  pipeline_stage,
  blockers,
  source_tier,
  source_tier_label,
  source_geo,
  source_query,
  assigned_sender,
  assigned_sender_domain,
  review_count,
  rating,
  photos_count,
  hours_present,
  days_since_last_review,
  latest_review_date,
  worst_gap,
  gap_hook,
  visibility_score,
  grades,
  signal_statuses,
  report_url,
  signal_missing_hours,
  signal_no_website,
  signal_thin_profile,
  signal_stale_reviews,
  signal_few_reviews,
  signal_few_photos,
  competitor_name,
  competitor_review_count,
  email_verification_status,
  email_verification_flags,
  place_id,
  smartlead_campaign_id,
  smartlead_lead_id,
  smartlead_email_stats_id,
  last_reply_intent,
  last_reply_at,
  report_sent_at,
  metadata
from public.prospecting_leads;

grant select on public.prospecting_pipeline_view to service_role;
