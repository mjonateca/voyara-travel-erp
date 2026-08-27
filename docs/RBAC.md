# RBAC

Roles are tenant-scoped collections of globally named permissions. Initial permission namespaces include booking, quote, cost, margin, product, contract, supplier, operations, finance, accounting, reports, users, settings and audit. UI capability checks only improve usability; each server action/use case requires an authenticated actor, tenant scope and permission.

Sensitive fields are projected only when permitted: for example, cost and margin require `cost.view` and `margin.view`. Role changes are audited.
