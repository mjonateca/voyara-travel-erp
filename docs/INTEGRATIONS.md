# Integrations

Ports isolate `PaymentProvider`, `EmailProvider`, supplier adapters, storage, webhooks and background jobs. Stripe and Resend are initial adapters, never domain dependencies. Public and partner APIs are versioned (`/api/v1`) with idempotency keys, rate limits, signatures and structured errors. Supplier mapping and external request/response payloads are stored separately from the core product model.
