import { type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function GlassPanel({ children, className }: { children: ReactNode; className?: string }) { return <section className={cn("glass rounded-xl", className)}>{children}</section>; }
export function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) { return <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-accent">{eyebrow}</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted">{description}</p></div>{actions}</header>; }
const statusMap = { confirmed: [CheckCircle2, "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"], requested: [Clock3, "bg-amber-500/12 text-amber-700 dark:text-amber-300"], pending: [AlertCircle, "bg-sky-500/12 text-sky-700 dark:text-sky-300"], cancelled: [XCircle, "bg-rose-500/12 text-rose-700 dark:text-rose-300"] } as const;
export function StatusBadge({ status }: { status: keyof typeof statusMap }) { const [Icon, tone] = statusMap[status]; return <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold capitalize", tone)}><Icon size={12} />{status}</span>; }
export function EmptyState({ title, detail }: { title: string; detail: string }) { return <GlassPanel className="p-8 text-center"><p className="font-medium">{title}</p><p className="mt-1 text-sm text-muted">{detail}</p></GlassPanel>; }
export function Skeleton({ className }: { className?: string }) { return <div className={cn("animate-pulse rounded bg-ink/8", className)} />; }
export function ErrorState({ reference }: { reference: string }) { return <GlassPanel className="border-rose-500/30 p-5"><p className="font-medium">We could not load this section.</p><p className="mt-1 text-sm text-muted">Try again shortly. Reference: {reference}</p></GlassPanel>; }
