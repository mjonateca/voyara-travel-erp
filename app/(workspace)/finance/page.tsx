import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { GlassPanel, PageHeader } from "@/components/domain/ui";
import { SubmitButton } from "@/components/domain/submit-button";
import { createInvoice } from "@/app/actions";
import { getTenantContext } from "@/lib/tenant";
import { statusLabels } from "@/lib/labels";

export default async function FinancePage() {
  const { supabase } = await getTenantContext();
  const [{ data: bookings }, { data: invoices }, { data: payments }] = await Promise.all([
    supabase.from("bookings").select("id,reference,total_sale,currency,status,agencies(name),customers(first_name,last_name)").not("status", "eq", "CANCELLED").order("created_at", { ascending: false }),
    supabase.from("invoices").select("id,reference,status,currency,total_amount,due_date,bookings(reference)").order("due_date", { ascending: false }),
    supabase.from("payments").select("amount,currency")
  ]);
  const invoiced = new Set(invoices?.map((invoice) => { const booking = Array.isArray(invoice.bookings) ? invoice.bookings[0] : invoice.bookings; return booking?.reference; }));
  const totalReceivable = invoices?.filter((invoice) => !["PAID", "VOID"].includes(invoice.status)).reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) ?? 0;
  const totalCollected = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) ?? 0;
  return <AppShell>
    <PageHeader eyebrow="Finanzas" title="Facturación y cobros" description="Emite documentos desde la reserva y conserva el vínculo con el expediente operativo."/>
    <section className="mt-5 grid gap-3 sm:grid-cols-3"><GlassPanel className="p-4"><p className="text-xs text-muted">Cuentas por cobrar</p><p className="mt-3 text-2xl font-semibold">USD {totalReceivable.toFixed(2)}</p></GlassPanel><GlassPanel className="p-4"><p className="text-xs text-muted">Cobrado</p><p className="mt-3 text-2xl font-semibold">USD {totalCollected.toFixed(2)}</p></GlassPanel><GlassPanel className="p-4"><p className="text-xs text-muted">Documentos emitidos</p><p className="mt-3 text-2xl font-semibold">{invoices?.length ?? 0}</p></GlassPanel></section>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
      <GlassPanel className="p-5"><h2 className="font-semibold">Emitir factura / comprobante</h2><p className="mt-1 text-xs text-muted">El importe se toma del precio congelado en la reserva.</p><form action={createInvoice} className="mt-5 space-y-3"><label className="text-xs font-medium text-muted">Reserva<select name="booking_id" required className="mt-1.5 w-full rounded-lg border bg-surface px-3 py-2.5 text-sm"><option value="">Seleccionar reserva</option>{bookings?.filter((booking) => !invoiced.has(booking.reference)).map((booking) => { const agency = Array.isArray(booking.agencies) ? booking.agencies[0] : booking.agencies; const customer = Array.isArray(booking.customers) ? booking.customers[0] : booking.customers; return <option key={booking.id} value={booking.id}>{booking.reference} · {agency?.name ?? (customer ? `${customer.first_name} ${customer.last_name}` : "Sin titular")} · {booking.currency} {Number(booking.total_sale).toFixed(2)}</option>; })}</select></label><label className="block text-xs font-medium text-muted">Condiciones de pago<select name="terms" defaultValue="15" className="mt-1.5 w-full rounded-lg border bg-surface px-3 py-2.5 text-sm"><option value="0">Pago inmediato</option><option value="7">7 días</option><option value="15">15 días</option><option value="30">30 días</option></select></label><SubmitButton className="w-full">Emitir documento</SubmitButton></form></GlassPanel>
      <GlassPanel className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Documentos financieros</h2></div><div className="divide-y">{invoices?.map((invoice) => { const booking = Array.isArray(invoice.bookings) ? invoice.bookings[0] : invoice.bookings; return <div key={invoice.id} className="flex items-center justify-between gap-4 p-4"><div><Link href={`/documents/invoice/${invoice.id}`} className="font-mono font-semibold text-accent">{invoice.reference}</Link><p className="mt-1 text-xs text-muted">Reserva {booking?.reference} · vence {invoice.due_date} · {statusLabels[invoice.status] ?? invoice.status}</p></div><div className="text-right"><p className="font-semibold">{invoice.currency} {Number(invoice.total_amount).toFixed(2)}</p><Link href={`/documents/invoice/${invoice.id}`} className="text-xs font-semibold text-accent">Abrir / imprimir →</Link></div></div>; })}</div></GlassPanel>
    </div>
  </AppShell>;
}
