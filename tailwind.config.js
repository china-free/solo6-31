/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e3a5f",
          900: "#0f172a",
        },
        accent: {
          gold: "#fbbf24",
          goldLight: "#fcd34d",
        },
        success: "#10b981",
        danger: "#ef4444",
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        "glow-success": "pulse-glow 1.5s ease-in-out infinite",
        "slide-in": "slide-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "modal-in": "fade-in-scale 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
