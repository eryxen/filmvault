/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'film-bg': '#0a0a0f',
        'film-card': '#111118',
        'film-blue': '#3b82f6',
        'film-purple': '#a855f7',
        'film-green': '#10b981',
        'film-gold': '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
