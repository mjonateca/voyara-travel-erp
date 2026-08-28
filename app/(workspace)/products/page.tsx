import { AppShell } from "@/components/app-shell";
import { GlassPanel, PageHeader } from "@/components/domain/ui";
import { SubmitButton } from "@/components/domain/submit-button";
import { createAgencyRate } from "@/app/actions";
import { getTenantContext } from "@/lib/tenant";

const input = "mt-1.5 w-full rounded-lg border bg-surface/70 px-3 py-2 text-sm outline-none ring-accent/30 focus:ring-2";
const label = "text-xs font-medium text-muted";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ agency?: string }> }) {
  const { agency: selectedAgency } = await searchParams;
  const { supabase } = await getTenantContext();
  const [{ data: agencies }, { data: products }, { data: rates }, { data: costs }] = await Promise.all([
    supabase.from("agencies").select("id,name,code,currency").eq("status", "ACTIVE").order("name"),
    supabase.from("products").select("id,name,code,destination,default_currency,suppliers(legal_name)").eq("status", "ACTIVE").order("name"),
    supabase.from("agency_product_rates").select("id,agency_id,product_id,valid_from,valid_to,sale_amount,currency,unit,agencies(name),products(name)").order("valid_from", { ascending: false }),
    supabase.from("contract_rates").select("product_id,cost_amount,currency,valid_from,valid_to")
  ]);
  const today = new Date().toISOString().slice(0, 10); const nextYear = `${new Date().getFullYear() + 1}-12-31`;
  return <AppShell>
    <PageHeader eyebrow="Producto y contratación" title="Excursiones y tarifarios por agencia" description="Mantén separado el coste del proveedor y el precio de venta negociado para cada agencia."/>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.45fr]">
      <GlassPanel className="p-5"><h2 className="font-semibold">Asignar precio a una agencia</h2><p className="mt-1 text-xs text-muted">La tarifa se aplicará automáticamente a nuevas cotizaciones dentro de su vigencia.</p><form action={createAgencyRate} className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>Agencia<select name="agency_id" defaultValue={selectedAgency ?? ""} required className={input}><option value="">Seleccionar agencia</option>{agencies?.map((agency) => <option key={agency.id} value={agency.id}>{agency.code} · {agency.name}</option>)}</select></label>
        <label className={`${label} sm:col-span-2`}>Excursión / producto<select name="product_id" required className={input}><option value="">Seleccionar producto</option>{products?.map((product) => <option key={product.id} value={product.id}>{product.code} · {product.name}</option>)}</select></label>
        <label className={label}>Válida desde<input name="valid_from" type="date" defaultValue={today} required className={input}/></label><label className={label}>Válida hasta<input name="valid_to" type="date" defaultValue={nextYear} required className={input}/></label>
        <label className={label}>Precio de venta<input name="sale_amount" type="number" min="0" step="0.01" required className={input}/></label><label className={label}>Moneda<input name="currency" defaultValue="USD" maxLength={3} required className={input}/></label>
        <label className={`${label} sm:col-span-2`}>Unidad<select name="unit" defaultValue="PER_PERSON" className={input}><option value="PER_PERSON">Por persona</option><option value="PER_GROUP">Por grupo</option><option value="PER_SERVICE">Por servicio</option></select></label>
        <SubmitButton className="sm:col-span-2">Guardar tarifa negociada</SubmitButton>
      </form></GlassPanel>
      <div className="space-y-5"><GlassPanel className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Matriz de precios comerciales</h2><p className="mt-1 text-xs text-muted">Una misma excursión puede mostrar precios distintos para Luna Travel, Caribbean Connect u otra agencia.</p></div><div className="divide-y">{rates?.map((rate) => { const agency = Array.isArray(rate.agencies) ? rate.agencies[0] : rate.agencies; const product = Array.isArray(rate.products) ? rate.products[0] : rate.products; return <div key={rate.id} className="grid gap-1 p-4 sm:grid-cols-[1.2fr_1.2fr_auto]"><p className="font-medium">{agency?.name}</p><p className="text-sm text-muted">{product?.name}<br/><span className="text-xs">{rate.valid_from} → {rate.valid_to}</span></p><p className="font-semibold text-accent">{rate.currency} {Number(rate.sale_amount).toFixed(2)}</p></div>; })}</div></GlassPanel>
      <GlassPanel className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Catálogo y coste base</h2></div><div className="divide-y">{products?.map((product) => { const supplier = Array.isArray(product.suppliers) ? product.suppliers[0] : product.suppliers; const cost = costs?.find((item) => item.product_id === product.id); return <div key={product.id} className="flex justify-between gap-4 p-4"><div><p className="font-medium">{product.name}</p><p className="text-xs text-muted">{product.code} · {product.destination} · {supplier?.legal_name}</p></div><p className="whitespace-nowrap text-sm">Coste {cost?.currency ?? product.default_currency} {Number(cost?.cost_amount ?? 0).toFixed(2)}</p></div>; })}</div></GlassPanel></div>
    </div>
  </AppShell>;
}
