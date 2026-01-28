/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wall': '#1f2937',        // Dark Grey/Black
        'visited': '#dbeafe',     // Light Blue
        'frontier': '#86efac',    // Green
        'current': '#fde047',     // Bright Yellow
        'path': '#f59e0b',        // Gold/Orange
      }
    },
  },
  plugins: [],
}
