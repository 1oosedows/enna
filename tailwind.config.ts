import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          base: "var(--surface-base)",
          secondary: "var(--surface-secondary)",
          elevated: "var(--surface-elevated)",
          overlay: "var(--surface-overlay)",
        },
        brand: {
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "#d42040",
          700: "#b01830",
        },
        accent: {
          400: "var(--accent-400)",
          500: "#a855a0",
          600: "#8b3d85",
        },
        caution: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        danger: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          bright: "var(--border-bright)",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "scan": "scan 8s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "grid-flow": "gridFlow 20s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        gridFlow: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-50px, -50px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(230, 57, 80, 0.2), 0 0 20px rgba(230, 57, 80, 0.1)" },
          "100%": { boxShadow: "0 0 10px rgba(230, 57, 80, 0.4), 0 0 40px rgba(230, 57, 80, 0.2)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
