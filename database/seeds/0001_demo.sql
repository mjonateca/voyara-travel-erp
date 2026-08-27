-- Deterministic tenant seed; identity users are created through Supabase Auth separately.
insert into public.tenants (id, name, slug) values ('00000000-0000-4000-8000-000000000001', 'Demo Travel Group', 'demo-travel-group') on conflict (slug) do nothing;
insert into public.companies (id, tenant_id, name, base_currency) values ('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'Caribbean DMC', 'USD') on conflict do nothing;
insert into public.offices (id, tenant_id, company_id, name, timezone) values ('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'Punta Cana', 'America/Santo_Domingo') on conflict do nothing;
