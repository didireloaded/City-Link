-- Windhoek City Cab backend foundation.
-- Apply with Supabase CLI when available; this migration is intentionally credential-free.

create extension if not exists pgcrypto;

alter table public.profiles add column if not exists role text not null default 'passenger' check (role in ('passenger','driver','dispatcher','admin','corporate_admin'));
alter table public.profiles add column if not exists push_tokens jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists corporate_account_id uuid;

create table if not exists public.corporate_accounts (
  id uuid primary key default gen_random_uuid(), name text not null, billing_email text,
  active boolean not null default true, created_at timestamptz not null default now()
);
do $$ begin
  alter table public.profiles add constraint profiles_corporate_account_fk foreign key (corporate_account_id) references public.corporate_accounts(id) on delete set null;
exception when duplicate_object then null;
end $$;

create table if not exists public.driver_profiles (
  id uuid primary key default gen_random_uuid(), profile_id uuid unique not null references public.profiles(id) on delete cascade,
  license_number text, status text not null default 'offline' check (status in ('offline','available','assigned','on_trip','suspended')),
  current_lat numeric(10,7), current_lng numeric(10,7), last_seen_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.vehicle_documents (
  id uuid primary key default gen_random_uuid(), vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  document_type text not null, storage_path text not null, expires_at date, verified_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.dispatch_jobs (
  id uuid primary key default gen_random_uuid(), booking_id uuid unique not null references public.bookings(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','offered','accepted','rejected','expired','cancelled')),
  offered_driver_id uuid references public.drivers(id) on delete set null, expires_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.driver_location_events (
  id bigint generated always as identity primary key, driver_id uuid not null references public.drivers(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null, lat numeric(10,7) not null, lng numeric(10,7) not null,
  heading numeric, speed numeric, recorded_at timestamptz not null default now()
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), profile_id uuid references public.profiles(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade, channel text not null check (channel in ('push','whatsapp','email','sms')),
  template text not null, payload jsonb not null default '{}'::jsonb, status text not null default 'queued' check (status in ('queued','sent','failed')),
  provider_message_id text, sent_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key, actor_id uuid references auth.users(id) on delete set null,
  action text not null, entity_type text not null, entity_id uuid, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(), provider text not null, event_type text not null, external_id text not null,
  payload jsonb not null, processed_at timestamptz, created_at timestamptz not null default now(), unique(provider, external_id)
);

alter table public.corporate_accounts enable row level security;
alter table public.driver_profiles enable row level security;
alter table public.vehicle_documents enable row level security;
alter table public.dispatch_jobs enable row level security;
alter table public.driver_location_events enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.webhook_events enable row level security;
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.vehicle_categories enable row level security;
alter table public.vehicles enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_status_events enable row level security;
alter table public.pricing_rules enable row level security;

create or replace function public.current_profile_id() returns uuid language sql stable security invoker as $$ select id from public.profiles where user_id = (select auth.uid()) limit 1 $$;
create or replace function public.has_role(required_roles text[]) returns boolean language sql stable security invoker as $$ select exists(select 1 from public.profiles where user_id = (select auth.uid()) and role = any(required_roles)) $$;

create policy "public verified pricing" on public.pricing_rules for select to anon, authenticated using (verified = true);
create policy "admins manage services" on public.services for all to authenticated using (public.has_role(array['admin'])) with check (public.has_role(array['admin']));
create policy "admins manage fleet" on public.vehicles for all to authenticated using (public.has_role(array['admin','dispatcher'])) with check (public.has_role(array['admin','dispatcher']));
create policy "admins manage categories" on public.vehicle_categories for all to authenticated using (public.has_role(array['admin'])) with check (public.has_role(array['admin']));

create policy "profiles own row" on public.profiles for select to authenticated using (user_id = (select auth.uid()) or public.has_role(array['admin','dispatcher']));
create policy "profiles own update" on public.profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "public active services" on public.services for select to anon, authenticated using (active);
create policy "public active categories" on public.vehicle_categories for select to anon, authenticated using (active);
create policy "public active vehicles" on public.vehicles for select to anon, authenticated using (active);
create policy "customers own bookings" on public.bookings for select to authenticated using (customer_id = public.current_profile_id() or public.has_role(array['admin','dispatcher']));
create policy "customers create bookings" on public.bookings for insert to authenticated with check (customer_id = public.current_profile_id());
create policy "customers update bookings" on public.bookings for update to authenticated using (customer_id = public.current_profile_id() or public.has_role(array['admin','dispatcher'])) with check (customer_id = public.current_profile_id() or public.has_role(array['admin','dispatcher']));
create policy "booking status visible" on public.booking_status_events for select to authenticated using (exists(select 1 from public.bookings b where b.id = booking_id and (b.customer_id = public.current_profile_id() or public.has_role(array['admin','dispatcher']))));
create policy "driver own profile" on public.driver_profiles for select to authenticated using (profile_id = public.current_profile_id() or public.has_role(array['admin','dispatcher']));
create policy "driver own locations" on public.driver_location_events for insert to authenticated with check (exists(select 1 from public.driver_profiles dp where dp.profile_id = public.current_profile_id()));
create policy "customer notifications" on public.notifications for select to authenticated using (profile_id = public.current_profile_id());
create policy "corporate members" on public.corporate_accounts for select to authenticated using (id = (select corporate_account_id from public.profiles where user_id = (select auth.uid())) or public.has_role(array['admin']));

create index if not exists idx_driver_locations_driver_time on public.driver_location_events(driver_id, recorded_at desc);
create index if not exists idx_notifications_profile_status on public.notifications(profile_id, status);
create index if not exists idx_dispatch_jobs_status on public.dispatch_jobs(status, created_at);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);

alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.driver_location_events;
alter publication supabase_realtime add table public.notifications;

insert into storage.buckets (id, name, public) values ('city-cab-documents','city-cab-documents',false) on conflict (id) do nothing;
