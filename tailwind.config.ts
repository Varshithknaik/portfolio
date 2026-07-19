import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./content/**/*.{mdx,ts}",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        panel: "var(--color-panel)",
        elevated: "var(--color-elevated)",
        line: "var(--color-line)",
        muted: "var(--color-muted)",
        subtle: "var(--color-subtle)",
        accent: "var(--color-accent)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        ui: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
