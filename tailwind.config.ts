import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#E9F1EB",
          dark: "#0F171E",
          soft: "#F2F7F4",
        },
        sidebar: {
          DEFAULT: "#141D26",
          hover: "#1D2834",
          card: "#19242F",
          border: "#253342",
        },
        lime: {
          accent: "#C6F432",
          neon: "#B8F018",
          glow: "#D6FA52",
          dark: "#84CC16",
        },
        category: {
          productive: "#10B981",
          necessities: "#0EA5E9",
          entertainment: "#F59E0B",
          distractions: "#F43F5E",
          personal: "#8B5CF6",
        },
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        "lime-glow": "0 0 25px -3px rgba(198, 244, 50, 0.45)",
        "card-soft": "0 4px 20px -2px rgba(0, 0, 0, 0.04)",
        "card-elevated": "0 10px 30px -5px rgba(0, 0, 0, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
