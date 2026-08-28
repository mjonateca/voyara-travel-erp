import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = { title: "Voyara | Operaciones de viajes", description: "ERP y plataforma de distribución para operaciones de viaje." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es" suppressHydrationWarning><body><ThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</ThemeProvider></body></html>; }
