/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EFB810",
        secondary: "#BD9006",
        tertiary: "FFD557",
        background: "#000000",
        },
        height: {
          'screen-28': 'calc(100vh - 2.5rem)'
        },
        maxHeight: {
          'screen-28': 'calc(100vh - 2.5rem)'
        },
    },
  },
  plugins: [],
}