import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { GlassPanel, PageHeader } from "@/components/domain/ui";
import { SubmitButton } from "@/components/domain/submit-button";
import { createAgencyRate, createCatalogProduct, createSupplier } from "@/app/actions";
import { getTenantContext } from "@/lib/tenant";

const input = "mt-1.5 w-full rounded-lg border bg-surface/70 px-3 py-2 text-sm outline-none ring-accent/30 focus:ring-2";
const label = "text-xs font-medium text-muted";
const tab = (active: boolean) => `rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-accent text-white" : "border text-muted"}`;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ agency?: string; view?: string }> }) {
  const { agency: selectedAgency, view = "catalog" } = await searchParams;
  const { supabase } = await getTenantContext();
  const [{ data: agencies }, { data: suppliers }, { data: products }, { data: rates }, { data: costs }] = await Promise.all([
    supabase.from("agencies").select("id,name,code,currency").eq("status", "ACTIVE").order("name"),
    supabase.from("suppliers").select("id,code,legal_name,default_currency").eq("status", "ACTIVE").order("legal_name"),
    supabase.from("products").select("id,name,code,type,destination,default_currency,suppliers(legal_name)").eq("status", "ACTIVE").order("name"),
    supabase.from("agency_product_rates").select("id,agency_id,product_id,valid_from,valid_to,sale_amount,currency,unit,agencies(name),products(name)").order("valid_from", { ascending: false }),
    supabase.from("contract_rates").select("product_id,cost_amount,currency,valid_from,valid_to,unit").order("valid_from", { ascending: false }),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const nextYear = `${new Date().getFullYear() + 1}-12-31`;

  return <AppShell>
    <PageHeader eyebrow="Producto y contratación" title="Catálogo, costes y tarifas" description="Registra el coste real del proveedor, define precios por agencia y controla el beneficio antes de vender."/>
    <nav className="mt-5 flex gap-2"><Link href="/products?view=catalog" className={tab(view === "catalog")}>Catálogo y costes</Link><Link href="/products?view=agency-rates" className={tab(view === "agency-rates")}>Precios por agencia</Link></nav>
    {view === "catalog" ? <>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <GlassPanel className="p-5"><h2 className="font-semibold">Nuevo proveedor</h2><p className="mt-1 text-xs text-muted">Operador que presta el hotel, traslado o excursión.</p><form action={createSupplier} className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className={label}>Código<input name="code" placeholder="SUP-004" required className={input}/></label><label className={label}>Nombre fiscal<input name="legal_name" placeholder="Caribe Adventures SRL" required className={input}/></label>
          <label className={label}>Tipo<select name="supplier_type" className={input}><option value="ACTIVITY">Excursiones</option><option value="TRANSFER">Traslados</option><option value="HOTEL">Hotel</option></select></label><label className={label}>Moneda<input name="currency" defaultValue="USD" maxLength={3} required className={input}/></label>
          <label className={label}>País<input name="country" defaultValue="República Dominicana" required className={input}/></label><label className={label}>Ciudad<input name="city" defaultValue="Punta Cana" required className={input}/></label>
          <SubmitButton className="sm:col-span-2">Registrar proveedor</SubmitButton>
        </form></GlassPanel>
        <GlassPanel className="p-5"><h2 className="font-semibold">Nuevo producto con coste base</h2><p className="mt-1 text-xs text-muted">El contrato de compra y su primera tarifa se crean juntos.</p><form action={createCatalogProduct} className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className={`${label} sm:col-span-2`}>Proveedor<select name="supplier_id" required className={input}><option value="">Seleccionar proveedor</option>{suppliers?.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.code} · {supplier.legal_name}</option>)}</select></label>
          <label className={label}>Código<input name="code" placeholder="EXC-SAONA" required className={input}/></label><label className={label}>Nombre comercial<input name="name" placeholder="Isla Saona Premium" required className={input}/></label>
          <label className={label}>Tipo<select name="type" className={input}><option value="ACTIVITY">Excursión</option><option value="TRANSFER">Traslado</option><option value="HOTEL">Alojamiento</option></select></label><label className={label}>Destino<input name="destination" defaultValue="Punta Cana" required className={input}/></label>
          <label className={label}>Coste base<input name="cost_amount" type="number" min="0" step="0.01" required className={input}/></label><label className={label}>Moneda<input name="currency" defaultValue="USD" maxLength={3} required className={input}/></label>
          <label className={label}>Válido desde<input name="valid_from" type="date" defaultValue={today} required className={input}/></label><label className={label}>Válido hasta<input name="valid_to" type="date" defaultValue={nextYear} required className={input}/></label>
          <label className={`${label} sm:col-span-2`}>Unidad<select name="unit" defaultValue="PER_PERSON" className={input}><option value="PER_PERSON">Por persona</option><option value="PER_GROUP">Por grupo</option><option value="PER_SERVICE">Por servicio</option><option value="PER_NIGHT">Por noche</option></select></label>
          <SubmitButton className="sm:col-span-2">Crear producto y coste</SubmitButton>
        </form>{!suppliers?.length ? <p className="mt-3 text-xs text-amber-700">Primero registra un proveedor.</p> : null}</GlassPanel>
      </div>
      <GlassPanel className="mt-5 overflow-hidden"><div className="p-5"><h2 className="font-semibold">Rentabilidad del catálogo</h2><p className="mt-1 text-xs text-muted">Compara el coste de compra con las tarifas de venta configuradas para agencias.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-y bg-ink/[.025] text-xs text-muted"><tr><th className="px-5 py-3">Producto</th><th>Proveedor</th><th>Coste base</th><th>Venta mínima</th><th>Beneficio / margen</th></tr></thead><tbody>{products?.map((product) => {
        const supplier = Array.isArray(product.suppliers) ? product.suppliers[0] : product.suppliers; const cost = costs?.find((item) => item.product_id === product.id); const sales = rates?.filter((item) => item.product_id === product.id).map((item) => Number(item.sale_amount)) ?? [];
        const minSale = sales.length ? Math.min(...sales) : null; const baseCost = Number(cost?.cost_amount ?? 0); const benefit = minSale === null ? null : minSale - baseCost; const margin = minSale && benefit !== null ? benefit / minSale * 100 : null;
        return <tr key={product.id} className="border-b last:border-0"><td className="px-5 py-3"><p className="font-medium">{product.name}</p><p className="text-xs text-muted">{product.code} · {product.destination}</p></td><td>{supplier?.legal_name ?? "—"}</td><td>{cost?.currency ?? product.default_currency} {baseCost.toFixed(2)}</td><td>{minSale === null ? <span className="text-amber-700">Sin tarifa</span> : `${cost?.currency ?? product.default_currency} ${minSale.toFixed(2)}`}</td><td className={benefit !== null && benefit < 0 ? "font-semibold text-rose-700" : "font-semibold text-emerald-700"}>{benefit === null ? "—" : `${cost?.currency ?? product.default_currency} ${benefit.toFixed(2)} · ${margin?.toFixed(1)}%`}</td></tr>;
      })}</tbody></table></div></GlassPanel>
    </> : <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.45fr]">
      <GlassPanel className="p-5"><h2 className="font-semibold">Asignar precio a una agencia</h2><p className="mt-1 text-xs text-muted">La tarifa se aplicará automáticamente a nuevas cotizaciones dentro de su vigencia.</p><form action={createAgencyRate} className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>Agencia<select name="agency_id" defaultValue={selectedAgency ?? ""} required className={input}><option value="">Seleccionar agencia</option>{agencies?.map((agency) => <option key={agency.id} value={agency.id}>{agency.code} · {agency.name}</option>)}</select></label>
        <label className={`${label} sm:col-span-2`}>Excursión / producto<select name="product_id" required className={input}><option value="">Seleccionar producto</option>{products?.map((product) => <option key={product.id} value={product.id}>{product.code} · {product.name}</option>)}</select></label>
        <label className={label}>Válida desde<input name="valid_from" type="date" defaultValue={today} required className={input}/></label><label className={label}>Válida hasta<input name="valid_to" type="date" defaultValue={nextYear} required className={input}/></label>
        <label className={label}>Precio de venta<input name="sale_amount" type="number" min="0" step="0.01" required className={input}/></label><label className={label}>Moneda<input name="currency" defaultValue="USD" maxLength={3} required className={input}/></label>
        <label className={`${label} sm:col-span-2`}>Unidad<select name="unit" defaultValue="PER_PERSON" className={input}><option value="PER_PERSON">Por persona</option><option value="PER_GROUP">Por grupo</option><option value="PER_SERVICE">Por servicio</option></select></label>
        <SubmitButton className="sm:col-span-2">Guardar tarifa negociada</SubmitButton>
      </form></GlassPanel>
      <GlassPanel className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Matriz de precios comerciales</h2><p className="mt-1 text-xs text-muted">Una misma excursión puede tener un precio distinto para cada agencia.</p></div><div className="divide-y">{rates?.map((rate) => { const agency = Array.isArray(rate.agencies) ? rate.agencies[0] : rate.agencies; const product = Array.isArray(rate.products) ? rate.products[0] : rate.products; const cost = costs?.find((item) => item.product_id === rate.product_id); const benefit = Number(rate.sale_amount) - Number(cost?.cost_amount ?? 0); return <div key={rate.id} className="grid gap-1 p-4 sm:grid-cols-[1.1fr_1.2fr_auto]"><p className="font-medium">{agency?.name}</p><p className="text-sm text-muted">{product?.name}<br/><span className="text-xs">{rate.valid_from} → {rate.valid_to}</span></p><div className="text-right"><p className="font-semibold text-accent">{rate.currency} {Number(rate.sale_amount).toFixed(2)}</p><p className={`text-xs ${benefit < 0 ? "text-rose-700" : "text-emerald-700"}`}>Beneficio {rate.currency} {benefit.toFixed(2)}</p></div></div>; })}</div></GlassPanel>
    </div>}
  </AppShell>;
}
