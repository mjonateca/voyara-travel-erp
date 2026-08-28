create unique index if not exists activities_business_key_idx on public.activities(tenant_id, booking_id, title, starts_at);
