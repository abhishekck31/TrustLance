// Ensuring custom transitions are handled, though primarily relying on Tailwind defaults enhanced by component logic.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom utility for subtle pulse/loading effect (if needed globally)
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
      transitionProperty: {
        'transform': 'transform',
      },
    },
  },
  plugins: [],
};

export default config;