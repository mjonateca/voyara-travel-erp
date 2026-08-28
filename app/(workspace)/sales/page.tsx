import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { GlassPanel, PageHeader } from "@/components/domain/ui";
import { SubmitButton } from "@/components/domain/submit-button";
import { convertQuoteToBooking, createQuote } from "@/app/actions";
import { getTenantContext } from "@/lib/tenant";

const input = "mt-1.5 w-full rounded-lg border bg-surface/70 px-3 py-2 text-sm outline-none ring-accent/30 focus:ring-2";
const label = "text-xs font-medium text-muted";
const status: Record<string, string> = { DRAFT: "Borrador", SENT: "Enviada", ACCEPTED: "Aceptada", CONVERTED: "Convertida", REJECTED: "Rechazada", EXPIRED: "Vencida" };

export default async function SalesPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const { created } = await searchParams;
  const { supabase } = await getTenantContext();
  const [{ data: agencies }, { data: customers }, { data: products }, { data: quotes }] = await Promise.all([
    supabase.from("agencies").select("id,name,code").eq("status", "ACTIVE").order("name"),
    supabase.from("customers").select("id,first_name,last_name").order("last_name"),
    supabase.from("products").select("id,name,code,destination").eq("status", "ACTIVE").order("name"),
    supabase.from("quotes").select("id,reference,status,travel_start,currency,total_sale,notes,agencies(name),customers(first_name,last_name)").order("created_at", { ascending: false }).limit(30)
  ]);
  const today = new Date().toISOString().slice(0, 10);
  return <AppShell>
    <PageHeader eyebrow="Ventas" title="Cotizaciones y reservas" description="Crea una propuesta con el precio negociado de la agencia y conviértela en reserva sin volver a cargar datos."/>
    {created ? <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800">Cotización {created} creada correctamente.</div> : null}
    <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.45fr]">
      <GlassPanel className="p-5"><h2 className="font-semibold">Crear cotización</h2><p className="mt-1 text-xs text-muted">El sistema busca primero la tarifa específica de la agencia; si no existe, aplica el margen general.</p><form action={createQuote} className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className={label}>Agencia<select name="agency_id" className={input}><option value="">Venta directa</option>{agencies?.map((agency) => <option key={agency.id} value={agency.id}>{agency.code} · {agency.name}</option>)}</select></label>
        <label className={label}>Cliente<select name="customer_id" className={input}><option value="">Seleccionar cliente</option>{customers?.map((customer) => <option key={customer.id} value={customer.id}>{customer.first_name} {customer.last_name}</option>)}</select></label>
        <label className={`${label} sm:col-span-2`}>Excursión o servicio<select name="product_id" required className={input}><option value="">Seleccionar producto</option>{products?.map((product) => <option key={product.id} value={product.id}>{product.code} · {product.name} · {product.destination}</option>)}</select></label>
        <label className={label}>Fecha de servicio<input name="service_date" type="date" min={today} defaultValue={today} required className={input}/></label><label className={label}>Cantidad / pasajeros<input name="quantity" type="number" min="1" defaultValue="2" required className={input}/></label>
        <label className={`${label} sm:col-span-2`}>Notas<textarea name="notes" rows={3} placeholder="Preferencias, hotel, horario, observaciones…" className={input}/></label>
        <SubmitButton className="sm:col-span-2">Calcular y crear cotización</SubmitButton>
      </form></GlassPanel>
      <GlassPanel className="overflow-hidden"><div className="flex items-center justify-between p-5"><div><h2 className="font-semibold">Pipeline comercial</h2><p className="mt-1 text-xs text-muted">Cotización → aceptación → reserva → operación → factura.</p></div><span className="text-xs text-muted">{quotes?.length ?? 0} expedientes</span></div><div className="divide-y">{quotes?.map((quote) => {
        const agency = Array.isArray(quote.agencies) ? quote.agencies[0] : quote.agencies;
        const customer = Array.isArray(quote.customers) ? quote.customers[0] : quote.customers;
        return <div key={quote.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex items-center gap-2"><Link href={`/documents/quote/${quote.id}`} className="font-mono text-sm font-semibold text-accent">{quote.reference}</Link><span className="rounded-md bg-ink/5 px-2 py-0.5 text-[11px] font-semibold">{status[quote.status] ?? quote.status}</span></div><p className="mt-1 text-sm">{agency?.name ?? (customer ? `${customer.first_name} ${customer.last_name}` : "Sin titular")}</p><p className="text-xs text-muted">Viaje: {quote.travel_start} · Total: {quote.currency} {Number(quote.total_sale).toFixed(2)}</p></div><div className="flex items-center gap-2"><Link href={`/documents/quote/${quote.id}`} className="rounded-lg border px-3 py-2 text-xs font-semibold">Ver / imprimir</Link>{quote.status !== "CONVERTED" ? <form action={convertQuoteToBooking}><input type="hidden" name="quote_id" value={quote.id}/><SubmitButton>Convertir en reserva</SubmitButton></form> : <Link href="/operations" className="text-xs font-semibold text-accent">Ver operación →</Link>}</div></div>;
      })}</div></GlassPanel>
    </div>
  </AppShell>;
}
