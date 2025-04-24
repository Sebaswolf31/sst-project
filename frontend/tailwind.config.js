/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Nunito'", "sans-serif"],
      },
      colors: {
        blueP: "#123D67",
        blueLight: "#3A4971",
        greenP: "#74BE8B",
      },
    },
  },
  plugins: [],
};
