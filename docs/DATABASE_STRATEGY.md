# Database strategy

PostgreSQL is authoritative. UUID primary keys, `timestamptz`, check constraints, foreign keys and targeted composite indexes are mandatory. Money is stored as `numeric(20,6)` or integer minor units with an explicit currency; JavaScript floats never calculate financial amounts.

Migrations are forward-only and reviewed. RLS is enabled on tenant-owned tables, backed by `profiles.tenant_id = auth.uid()` predicates. Application authorization is additional, never a substitute. Financial records are append-only or reversal-based; soft deletion is exceptional.
