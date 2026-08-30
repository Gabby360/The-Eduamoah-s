import type { Config } from 'tailwindcss';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0a1713',
          50: '#0a1713', 100: '#11221c', 200: '#192e27', 300: '#223b32',
          400: '#2d4a40', 500: '#395a4f', 600: '#476b5e', 700: '#577c6e',
          800: '#6a8f80', 900: '#80a495', 950: '#99b9ab',
        },
        primary: {
          DEFAULT: '#e2b324',
          50: '#fdf8e7', 100: '#faeebe', 200: '#f7e390', 300: '#f4d762',
          400: '#f1c65a', 500: '#e2b324', 600: '#b88d18', 700: '#8e6a11',
          800: '#66490a', 900: '#422e05', 950: '#2b1d02',
        },
        accent: {
          DEFAULT: '#f1c65a',
          50: '#fdf8e7', 100: '#faeebe', 200: '#f7e390', 300: '#f4d762',
          400: '#f1c65a', 500: '#e2b324', 600: '#b88d18', 700: '#8e6a11',
          800: '#66490a', 900: '#422e05', 950: '#2b1d02',
        },
        secondary: {
          DEFAULT: '#d6c4a5',
          50: '#faf7f2', 100: '#f2ece2', 200: '#e5dbcb', 300: '#d6c4a5',
          400: '#c2ab84', 500: '#ad9163', 600: '#8f744b', 700: '#705a39',
          800: '#524129', 900: '#372a1a', 950: '#231b10',
        },
        foreground: {
          DEFAULT: '#FBF7EF',
          50: '#FFFFFF', 100: '#FBF7EF', 200: '#ECE4D3', 300: '#DACFB8',
          400: '#C2B49B', 500: '#A6967D', 600: '#8A7A64', 700: '#6E6150',
          800: '#554A3D', 900: '#3D352C', 950: '#26211C',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'line-draw': 'lineDraw 1.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        lineDraw: { '0%': { width: '0%', opacity: '0' }, '100%': { width: '100%', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'pulse-glow': { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
} satisfies Config;
