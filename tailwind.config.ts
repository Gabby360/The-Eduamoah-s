import type { Config } from 'tailwindcss';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0907',
          50: '#0B0907', 100: '#141110', 200: '#1C1816', 300: '#26201C',
          400: '#332B25', 500: '#423831', 600: '#53483F', 700: '#655A50',
          800: '#786C61', 900: '#8A7E73', 950: '#998F85',
        },
        primary: {
          DEFAULT: '#C29845',
          50: '#FBF3DF', 100: '#F5E5C4', 200: '#EBD3A0', 300: '#DFC07C',
          400: '#D2AC5E', 500: '#C29845', 600: '#A88236', 700: '#89692B',
          800: '#6B5122', 900: '#4F3C1C', 950: '#372A14',
        },
        accent: {
          DEFAULT: '#B46F53',
          50: '#FAF1EC', 100: '#F3DFD6', 200: '#E7C4B5', 300: '#D9A48E',
          400: '#C9886D', 500: '#B46F53', 600: '#9A5B45', 700: '#7D4938',
          800: '#62382C', 900: '#482A22', 950: '#321D18',
        },
        secondary: {
          DEFAULT: '#BFAC90',
          50: '#F4EFE8', 100: '#E7DECF', 200: '#D5C6AF', 300: '#BFAC90',
          400: '#A69272', 500: '#8E7A5C', 600: '#716148', 700: '#594C39',
          800: '#43392B', 900: '#2F2820', 950: '#1E1914',
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
