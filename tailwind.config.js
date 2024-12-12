/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        dark: {
          DEFAULT: '#1a1a1a',
          paper: '#2d2d2d',
          hover: '#333333',
        },
      },
      textColor: {
        dark: {
          primary: '#ffffff',
          secondary: '#a0aec0',
          disabled: '#4a5568',
        },
      },
      borderColor: {
        dark: {
          DEFAULT: '#333333',
          hover: '#404040',
        },
      },
    },
  },
  plugins: [],
};