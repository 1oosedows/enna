import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          base: "#0f1117",
          secondary: "#161924",
          elevated: "#1c2030",
          overlay: "#232838",
        },
        brand: {
          400: "#f25c6e",
          500: "#e63950",
          600: "#d42040",
          700: "#b01830",
        },
        accent: {
          400: "#c084b8",
          500: "#a855a0",
          600: "#8b3d85",
        },
        text: {
          primary: "#e8eaed",
          secondary: "#9ca3af",
          muted: "#6b7280",
        },
        border: {
          DEFAULT: "#2a2f3e",
          bright: "#3a4055",
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
