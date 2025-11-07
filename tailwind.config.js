/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#22c55e', // green-500
        'primary-dark': '#16a34a', // green-600
        'secondary': '#f97316', // orange-500
        'background': '#f1f5f9', // slate-100
        'surface': '#ffffff',
        'text-primary': '#1e293b', // slate-800
        'text-secondary': '#64748b', // slate-500
        'border': '#cbd5e1' // slate-300
      }
    },
  },
  plugins: [],
}