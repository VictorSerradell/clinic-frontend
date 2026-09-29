/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hospital: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          500: "#64748B",
          800: "#1E293B",
          900: "#0F172A",
        },
        medical: {
          cyan: "#0284C7",
          teal: "#0D9488",
          mint: "#10B981",
          danger: "#EF4444",
          warning: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};
