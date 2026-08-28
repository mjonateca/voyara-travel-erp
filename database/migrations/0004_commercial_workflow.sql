-- Agency pricing, operational coordination and document issuance.
alter table public.agencies add column if not exists email text;
alter table public.agencies add column if not exists phone text;
alter table public.agencies add column if not exists commission_pct numeric(8,3) not null default 0 check (commission_pct between 0 and 100);
alter table public.agencies add column if not exists payment_terms_days integer not null default 15 check (payment_terms_days >= 0);
alter table public.customers add column if not exists phone text;
alter table public.customers add column if not exists nationality text;
alter table public.quotes add column if not exists notes text;
alter table public.quotes add column if not exists created_at timestamptz not null default now();
alter table public.operations_tasks add column if not exists assigned_to uuid references public.profiles(id);
alter table public.invoices add column if not exists issued_at timestamptz;

create table if not exists public.agency_product_rates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  valid_from date not null,
  valid_to date not null,
  sale_amount numeric(20,6) not null check (sale_amount >= 0),
  currency char(3) not null,
  unit text not null default 'PER_PERSON',
  created_at timestamptz not null default now(),
  check (valid_to >= valid_from),
  unique (agency_id, product_id, valid_from)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  booking_id uuid references public.bookings(id) on delete cascade,
  title text not null,
  activity_type text not null check (activity_type in ('SERVICE','PICKUP','PAYMENT','DEADLINE','MEETING')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'PLANNED' check (status in ('PLANNED','CONFIRMED','DONE','CANCELLED')),
  location text,
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists agency_rates_lookup_idx on public.agency_product_rates(tenant_id, agency_id, product_id, valid_from, valid_to);
create index if not exists activities_calendar_idx on public.activities(tenant_id, starts_at);
alter table public.agency_product_rates enable row level security;
alter table public.activities enable row level security;

grant select, insert, update, delete on public.agency_product_rates to authenticated;
grant select, insert, update, delete on public.activities to authenticated;

do $$
declare t text;
begin
  foreach t in array array['agencies','customers','quotes','quote_services','bookings','booking_services','operations_tasks','invoices','agency_product_rates','activities'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists "tenant write" on public.%I', t);
    execute format('create policy "tenant write" on public.%I for all to authenticated using (tenant_id = (select tenant_id from public.profiles where id = (select auth.uid()))) with check (tenant_id = (select tenant_id from public.profiles where id = (select auth.uid())))', t);
  end loop;
end $$;

drop policy if exists "tenant read" on public.agency_product_rates;
create policy "tenant read" on public.agency_product_rates for select to authenticated using (tenant_id = (select tenant_id from public.profiles where id = (select auth.uid())));
drop policy if exists "tenant read" on public.activities;
create policy "tenant read" on public.activities for select to authenticated using (tenant_id = (select tenant_id from public.profiles where id = (select auth.uid())));
