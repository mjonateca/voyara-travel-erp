-- Writable catalogue and auditable task completion.
alter table public.operations_tasks add column if not exists resolution_notes text;
alter table public.operations_tasks add column if not exists completed_at timestamptz;
alter table public.operations_tasks add column if not exists completed_by uuid references public.profiles(id);

create index if not exists operations_tasks_completed_by_idx on public.operations_tasks(completed_by);

do $$
declare t text;
begin
  foreach t in array array['suppliers','products','contracts','contract_rates'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists "tenant insert" on public.%I', t);
    execute format('drop policy if exists "tenant update" on public.%I', t);
    execute format('drop policy if exists "tenant delete" on public.%I', t);
    execute format('create policy "tenant insert" on public.%I for insert to authenticated with check (tenant_id = (select private.current_tenant_id()))', t);
    execute format('create policy "tenant update" on public.%I for update to authenticated using (tenant_id = (select private.current_tenant_id())) with check (tenant_id = (select private.current_tenant_id()))', t);
    execute format('create policy "tenant delete" on public.%I for delete to authenticated using (tenant_id = (select private.current_tenant_id()))', t);
  end loop;
end $$;

create index if not exists products_supplier_idx on public.products(supplier_id);
create index if not exists contracts_supplier_idx on public.contracts(supplier_id);
create index if not exists contract_rates_product_idx on public.contract_rates(product_id);
