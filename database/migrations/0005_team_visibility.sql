-- Operations coordinators need to assign work to any member of their tenant.
drop policy if exists "members read own profile" on public.profiles;
drop policy if exists "tenant members read profiles" on public.profiles;
create policy "tenant members read profiles" on public.profiles for select to authenticated
using (tenant_id = (select tenant_id from public.profiles where id = (select auth.uid())));
grant select on public.profiles to authenticated;
