-- Remove overlapping permissive policies and support safe tenant-wide team lookup.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$ select tenant_id from public.profiles where id = (select auth.uid()) $$;
revoke all on function private.current_tenant_id() from public;
grant execute on function private.current_tenant_id() to authenticated;

drop policy if exists "tenant members read profiles" on public.profiles;
create policy "tenant members read profiles" on public.profiles for select to authenticated
using (tenant_id = (select private.current_tenant_id()));

do $$
declare t text;
begin
  foreach t in array array['agencies','customers','quotes','quote_services','bookings','booking_services','operations_tasks','invoices','agency_product_rates','activities'] loop
    execute format('drop policy if exists "tenant write" on public.%I', t);
    execute format('drop policy if exists "tenant insert" on public.%I', t);
    execute format('drop policy if exists "tenant update" on public.%I', t);
    execute format('drop policy if exists "tenant delete" on public.%I', t);
    execute format('create policy "tenant insert" on public.%I for insert to authenticated with check (tenant_id = (select private.current_tenant_id()))', t);
    execute format('create policy "tenant update" on public.%I for update to authenticated using (tenant_id = (select private.current_tenant_id())) with check (tenant_id = (select private.current_tenant_id()))', t);
    execute format('create policy "tenant delete" on public.%I for delete to authenticated using (tenant_id = (select private.current_tenant_id()))', t);
  end loop;
end $$;

create index if not exists activities_assigned_idx on public.activities(assigned_to);
create index if not exists activities_booking_idx on public.activities(booking_id);
create index if not exists agency_rates_product_idx on public.agency_product_rates(product_id);
create index if not exists operations_tasks_assigned_idx on public.operations_tasks(assigned_to);
