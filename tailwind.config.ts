/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e8ebf8",
          100: "#d1d7f1",
          200: "#a3afe3",
          300: "#7587d5",
          400: "#475fc7",
          500: "#2a3fb9",
          600: "#0d1f6e",
          700: "#0a1845",
          800: "#07112c",
          900: "#040a13",
        },
        orange: {
          50: "#fff9f1",
        },
      },
    },
  },
  plugins: [],
};
