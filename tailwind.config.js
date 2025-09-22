/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#333333',
        'secondary-color': '#3e3e3e',
        'text-color': '#ddd',
        'dark-bg': '#161616fd',
        'red-brand': '#c9302c',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
        'header-gradient': 'linear-gradient(90deg, rgb(75, 71, 71) 0%, #1a1919 60%)',
      },
      boxShadow: {
        'inset-header': '0px 0px 15px 5px rgba(0, 0, 0, 1) inset',
        'inset-hero': '0px 0px 10px 5px rgba(0, 0, 0, 1) inset',
      },
    },
  },
  plugins: [],
}