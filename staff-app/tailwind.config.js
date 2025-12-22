/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Loading content glob patterns relative to THIS file
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        prussian: {
          DEFAULT: '#034f84',
          dark: '#003153',
          light: '#0a6c9a',
        },
        yellow: {
          light: '#fef9c3', // yellow-100
          DEFAULT: 'var(--yellow)',
          dark: '#fde047', // yellow-300
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-light': 'var(--surface-light)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        border: 'var(--border-color)',
        gray: {
          DEFAULT: '#e5e7eb',
          light: '#f3f4f6',
          dark: '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}
