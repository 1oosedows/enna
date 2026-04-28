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
          600: "#D04858",
          700: "#B03848",
        },
        accent: {
          400: "var(--accent-400)",
          500: "#C4A0B9",
          600: "#A88098",
        },
        caution: {
          400: "#E8A0AD",
          500: "#D8909D",
          600: "#C07888",
          700: "#A86070",
        },
        danger: {
          400: "#C4A0B9",
          500: "#A88098",
          600: "#8C6880",
          700: "#705068",
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
        mono: ["var(--font-mono)", "Fira Code", "monospace"],
      },
      animation: {
        "scan": "scan 8s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "grid-flow": "gridFlow 20s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "pop-in": "popIn 0.15s ease-out",
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
          "0%": { boxShadow: "0 0 5px rgba(255, 90, 110, 0.2), 0 0 20px rgba(255, 90, 110, 0.1)" },
          "100%": { boxShadow: "0 0 10px rgba(255, 90, 110, 0.4), 0 0 40px rgba(255, 90, 110, 0.2)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
