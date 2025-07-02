/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          white: '#FFFFFF',
          black1: '#07080A',
          black2: '#0D1013',
          black3: '#1B1C1D',
          gray1: '#C4C4C4',
          gray2: '#D9D9D9',
          white70: 'rgba(255, 255, 255, 0.7)',
        }
      }
    }

  },
  plugins: [],
}

