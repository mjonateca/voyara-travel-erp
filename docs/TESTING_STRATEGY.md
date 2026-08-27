# Testing strategy

Unit tests cover pricing, promotions, cancellation, FX, state machines and permission resolution. Integration tests run migrations and repositories against PostgreSQL, including RLS and tenant-isolation tests. End-to-end tests cover sign-in and critical workflows from quote through booking, confirmation, payment and profitability.

Concurrency tests cover allotments; contract tests cover adapters; seed tests ensure deterministic, idempotent demo fixtures. CI blocks merge on type, lint, test, migration and security checks.
