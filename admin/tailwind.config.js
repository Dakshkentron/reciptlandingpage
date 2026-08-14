/**
 * The console shares Receipt's palette so the two read as one product.
 *
 * Only the tokens this app actually uses are carried over — the marketing
 * site's animations and light-mode scales have no place in an internal tool.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0a0a0b',
          900: '#101012',
          850: '#151517',
          800: '#1a1a1d',
          750: '#1f1f23',
          700: '#26262b',
          600: '#333339',
          500: '#44444c',
          400: '#62626c',
          300: '#8a8a96',
          200: '#b4b4be',
          100: '#d8d8de',
          50: '#ececf0',
        },
        brand: {
          50: '#eefcf5',
          100: '#d4f5e3',
          200: '#a9eac8',
          300: '#71d8a6',
          400: '#38c082',
          500: '#16a86a',
          600: '#0a8554',
          700: '#076744',
          800: '#08523a',
          900: '#06432f',
        },
        accent: {
          50: '#fef3e8',
          100: '#fde0c0',
          200: '#fbc27e',
          300: '#f99e3c',
          400: '#f57e16',
          500: '#e36209',
          600: '#bf4c08',
          700: '#97390c',
        },
        sky: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcddff',
          300: '#8ec8ff',
          400: '#59a8ff',
          500: '#3385fc',
          600: '#1d63f0',
          700: '#194fd6',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
