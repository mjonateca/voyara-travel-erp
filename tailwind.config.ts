import type { Config } from "tailwindcss";
const config: Config = { darkMode: ["class"], content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "rgb(var(--ink) / <alpha-value>)", muted: "rgb(var(--muted) / <alpha-value>)", canvas: "rgb(var(--canvas) / <alpha-value>)", surface: "rgb(var(--surface) / <alpha-value>)", line: "rgb(var(--line) / <alpha-value>)", accent: "rgb(var(--accent) / <alpha-value>)" }, boxShadow: { glass: "0 16px 45px rgb(20 35 54 / .09), 0 2px 8px rgb(20 35 54 / .04)" } } }, plugins: [] };
export default config;
