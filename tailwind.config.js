/** @type {import('tailwindcss').Config} */

// tailwind.config.js
const colors = {
  main: {
    orange: '#F26749',
    lightBlue: '#B3CED4',
    background: '#F6EFDD',
    white: "#FDFBF5",
    grey: "#2C4B56",
    lightGrey: "#D9D9D9",
    pink: "#FF746B",
    nav: "#2C94B3",
    yellow: "#E4B036",
    purple: "#D1B3D4",
    blue: "#6D92E2",
    mastard: "#E2C16D",

    retroYellow: "#ffc567",
    retroRed: "#dd4136",
    retroGreen: "#00995e",
    retroBlue: "#058cd7",
    retroLightBlue: "#c5eaff",
    retroPink: "#fb7da8",
    retroPurple: "#552cb7",
    retroBeige: "#f7f1ef",
    retroWhite: "#fdfbf5",
    retroBlack: "#0e0f12",
  },
}

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./app/**/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./lib/*.js"],
  theme: {
    extend: {
      colors: colors,
      fontFamily: {
        pixel: ['var(--font-pixel)'],
      },
    },
  },
  plugins: [],
}

