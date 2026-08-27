# Domain model

Platform owns Tenant, Company, Office, Department, Profile, Role, Permission and AuditLog. Product & Contracting owns Supplier, Product, Contract, ContractPeriod, Rate, Promotion and Inventory. Sales owns Agency, Customer, Quote, QuoteVersion and Itinerary. Reservations owns Booking, BookingService, Passenger and Rooming. Operations, Finance, Distribution, Connectivity and Analytics are separate bounded contexts.

Initial ERD: `Tenant 1—* Company 1—* Office 1—* Department`; `Tenant 1—* Profile`; `Profile *—* Role *—* Permission`. Every future commercial aggregate has `tenant_id`; company and office scope are explicit where operationally meaningful.
