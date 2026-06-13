/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdf5',
          100: '#d7fae5',
          200: '#b2f3cd',
          300: '#7be8aa',
          400: '#41d380',
          500: '#10B981', // emerald-500 (Primary color)
          600: '#0ca06e',
          700: '#0a805a',
          800: '#0b6549',
          900: '#0a533d',
          950: '#052e22',
        },
        darkBg: '#0B0F19',
        darkCard: '#1E293B',
      }
    },
  },
  plugins: [],
}
