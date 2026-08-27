"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
export function ThemeToggle() { const { resolvedTheme, setTheme } = useTheme(); return <button aria-label="Toggle theme" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-ink/5">{resolvedTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>; }
