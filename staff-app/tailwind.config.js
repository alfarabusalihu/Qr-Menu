/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Loading content glob patterns relative to THIS file
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
