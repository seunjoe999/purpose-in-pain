/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B2A44',
          50: '#e9eef2',
          100: '#c9d6e0',
          600: '#123650',
          700: '#0B2A44',
          800: '#081f33',
          900: '#051422',
        },
        sky: {
          DEFAULT: '#1BA8DE',
          50: '#eaf8fd',
          100: '#c9edf9',
          400: '#3fbaea',
          500: '#1BA8DE',
          600: '#158fbe',
          700: '#11719a',
        },
        accent: {
          pink: '#EC1FA0',
          mustard: '#F4B71A',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'ui-rounded', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(11, 42, 68, 0.15)',
      },
    },
  },
  plugins: [],
};
