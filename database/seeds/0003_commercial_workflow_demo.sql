-- Agency-specific prices and a populated coordination calendar.
with t as (select id from public.tenants where slug = 'demo-travel-group'),
a as (select id, code, name from public.agencies where tenant_id = (select id from t)),
p as (select id, code from public.products where tenant_id = (select id from t))
insert into public.agency_product_rates (tenant_id, agency_id, product_id, valid_from, valid_to, sale_amount, currency, unit)
select (select id from t), a.id, p.id, date '2026-01-01', date '2027-12-31',
  case when a.name = 'Travel Agency Madrid' then case p.code when 'ACT-SAONA' then 78 when 'TRF-PUJ' then 42 else 95 end
       else case p.code when 'ACT-SAONA' then 86 when 'TRF-PUJ' then 48 else 108 end end,
  'USD', 'PER_PERSON'
from a cross join p
on conflict (agency_id, product_id, valid_from) do update set sale_amount = excluded.sale_amount, valid_to = excluded.valid_to;

with b as (select id, tenant_id, reference, travel_start from public.bookings order by created_at limit 1)
insert into public.activities (tenant_id, booking_id, title, activity_type, starts_at, status, location)
select tenant_id, id, 'Recogida en hotel · ' || reference, 'PICKUP', travel_start::timestamp + time '08:30', 'CONFIRMED', 'Lobby del hotel' from b
union all
select tenant_id, id, 'Excursión principal · ' || reference, 'SERVICE', travel_start::timestamp + time '09:00', 'PLANNED', 'Punto de encuentro' from b
on conflict (tenant_id, booking_id, title, starts_at) do nothing;
