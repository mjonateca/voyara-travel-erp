"use client";

import { Printer } from "lucide-react";

export function PrintButton() { return <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white print:hidden"><Printer size={16}/>Imprimir / guardar PDF</button>; }
