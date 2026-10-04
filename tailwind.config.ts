import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Tahoma", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--ink-soft) / <alpha-value>)",
        "ink-faint": "rgb(var(--ink-faint) / <alpha-value>)",
        hairline: "rgb(var(--hairline) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
