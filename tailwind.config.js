/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#141414',
        surface: '#1E1E1E',
        border: '#2A2A2A',
        'primary-text': '#E4E4E7',
        'muted-text': '#A1A1AA',
        accent: '#7C3AED',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        base: '15px',
      },
      lineHeight: {
        relaxed: '1.6',
      },
    },
  },
  plugins: [],
}