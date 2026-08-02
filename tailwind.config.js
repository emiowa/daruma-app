/** @type {import('tailwindcss').Config} */

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
    mastard: "#E2C16D"
  },
}

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/*.js"
  ],
  // ⭕️ 追加：Supabaseから動的に取得する可能性のある背景色をここに登録する
  safelist: [
    'bg-main-pink',
    'bg-main-yellow',
    'bg-main-orange',
    'bg-main-blue',
    'bg-main-purple',
    'bg-main-mastard',
    // 今後増えるかもしれない色もここに書いておけば絶対に消えなくなります！
  ],
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [],
}