import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        anthropic: {
          bg: "#1a1a2e",
          card: "#16213e",
          cardHover: "#1a2744",
          border: "#2a3a5c",
          accent: "#D97706",
          accentLight: "#F59E0B",
          purple: "#8B5CF6",
          purpleLight: "#A78BFA",
          text: "#E2E8F0",
          textMuted: "#94A3B8",
          success: "#10B981",
          error: "#EF4444",
          warning: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
