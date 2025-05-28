import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        greenPrimary: "#1D4D4F",
        greenSecondary: "#347766",
        goldAccent: "#D1A73F",
        lightGold: "#F3E4CA",
        lightGreen: "#D4E2DD",
      },
    },
  },
};

export default config;
