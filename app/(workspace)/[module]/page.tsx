import { AppShell } from "@/components/app-shell";
import { EmptyState, PageHeader } from "@/components/domain/ui";
import { EntityTable, type EntityRow } from "@/components/domain/entity-table";
import { createClient } from "@/lib/supabase/server";

const info: Record<string, { title: string; description: string; eyebrow: string; table?: string; columns?: string }> = {
  sales: { title: "Sales workspace", description: "Live quotations from Demo Travel Group.", eyebrow: "Sales", table: "quotes", columns: "reference,status,travel_start,travel_end,currency,total_sale" },
  crm: { title: "Customers & agencies", description: "Customer and agency records in the current tenant.", eyebrow: "CRM", table: "customers", columns: "first_name,last_name,email,language" },
  products: { title: "Product catalogue", description: "Live supplier products and commercial inventory.", eyebrow: "Product", table: "products", columns: "code,type,name,destination,status,default_currency" },
  operations: { title: "Operations control", description: "Tasks generated for active bookings.", eyebrow: "Operations", table: "operations_tasks", columns: "title,due_at,status,priority" },
  finance: { title: "Finance workspace", description: "Issued invoices and payment control.", eyebrow: "Finance", table: "invoices", columns: "reference,status,currency,total_amount,due_date" },
  administration: { title: "Administration", description: "Tenant members and their access foundation.", eyebrow: "Platform", table: "profiles", columns: "display_name,created_at" },
  settings: { title: "Settings", description: "Tenant configuration and integrations are managed here.", eyebrow: "Platform" }
};
export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) { const { module } = await params; const config = info[module] ?? { title: "Workspace", description: "This workspace is being configured.", eyebrow: "Voyara" }; let rows: EntityRow[] = []; if (config.table && config.columns) { const supabase = await createClient(); const { data } = await supabase.from(config.table).select(config.columns).limit(25); rows = (data ?? []) as unknown as EntityRow[]; } return <AppShell><PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description}/><div className="mt-6">{config.table ? <EntityTable title={config.title} description="Data loaded from Supabase under tenant RLS." rows={rows}/> : <EmptyState title="Module foundation is ready" detail="This intentionally scoped placeholder preserves navigation while the corresponding domain phase is implemented."/>}</div></AppShell>; }
