/** @type {import('tailwindcss').Config} */

// tailwind.config.js
const colors = {
  main: {
    orange: '#F26749',
    blue: '#214ECF',
    background: '#F6EFDD',
    white: "#FDFBF5",
    grey: "#2C4B56",
    pink: "#FF746B"
  },
}

module.exports = {
  content: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [],
}

