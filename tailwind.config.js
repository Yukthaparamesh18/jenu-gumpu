/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#D97706',
        secondary: '#78350F',
        accent: '#F59E0B',
        background: {
          light: '#FFFBEB',
          dark: '#1C1917',
        },
        success: '#10B981',
      },
      fontFamily: {
        heading: ['Playfair Display', 'Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        kannada: ['Noto Sans Kannada', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
