"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className={`rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60 ${className}`}>{pending ? "Procesando…" : children}</button>;
}
