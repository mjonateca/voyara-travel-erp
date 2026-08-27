# Multi-tenancy

Tenant is the security boundary. Company, office and department provide internal scope, but never loosen tenant isolation. Tenant ID is established from the authenticated profile server-side and is never accepted as a trusted client input. RLS protects direct database access; repositories require tenant context; tests attempt cross-tenant reads and writes.

Document sequences, base currencies, brands, markets and commercial policies are configurable at company scope where applicable.
