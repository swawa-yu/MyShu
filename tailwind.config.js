/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-700': '#2c5282',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
