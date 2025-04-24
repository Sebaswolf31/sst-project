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
        blueP: "#175699",
        blueLight: "#188FA3",
        greenP: "#41B495",
      },
    },
  },
  plugins: [],
};
