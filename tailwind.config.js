/** @type {import('tailwindcss').Config} */

// tailwind.config.js
const colors = {
  main: {
    orange: '#F26749',
    lightBlue: '#B3CED4',
    background: '#F6EFDD',
    white: "#FDFBF5",
    grey: "#2C4B56",
    pink: "#FF746B",
    nav: "#2C94B3",
    yellow: "#E4B036",
    purple: "#D1B3D4",
    blue: "#6D92E2",
    mastard: "#E2C16D"
  },
}

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./lib/*.js"],
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [],
}

