/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        /**
         * The console's greys resolve through CSS variables so one class on
         * <html> can repaint the whole surface. `src/index.css` defines the
         * dark values as the default and swaps them under `.console.light`.
         *
         * The scale stays semantic in both themes: 950 is always the deepest
         * background and 50 the brightest text, so `bg-ink-950 text-ink-100`
         * reads correctly either way and no component needs a `dark:` variant.
         *
         * The values are space-separated RGB channels wrapped in
         * `rgb(... / <alpha-value>)` rather than hexes, which is what keeps
         * `bg-ink-950/70` and friends working: Tailwind cannot compute an alpha
         * against an opaque `var()` and drops the class outright when it tries.
         *
         * The fallbacks are the original dark channels, so the marketing site --
         * which never sets these variables -- is untouched by this.
         */
        ink: {
          950: 'rgb(var(--ink-950, 10 10 11) / <alpha-value>)',
          900: 'rgb(var(--ink-900, 16 16 18) / <alpha-value>)',
          850: 'rgb(var(--ink-850, 21 21 23) / <alpha-value>)',
          800: 'rgb(var(--ink-800, 26 26 29) / <alpha-value>)',
          750: 'rgb(var(--ink-750, 31 31 35) / <alpha-value>)',
          700: 'rgb(var(--ink-700, 38 38 43) / <alpha-value>)',
          600: 'rgb(var(--ink-600, 51 51 57) / <alpha-value>)',
          500: 'rgb(var(--ink-500, 68 68 76) / <alpha-value>)',
          400: 'rgb(var(--ink-400, 98 98 108) / <alpha-value>)',
          300: 'rgb(var(--ink-300, 138 138 150) / <alpha-value>)',
          200: 'rgb(var(--ink-200, 180 180 190) / <alpha-value>)',
          100: 'rgb(var(--ink-100, 216 216 222) / <alpha-value>)',
          50: 'rgb(var(--ink-50, 236 236 240) / <alpha-value>)',
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
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'marquee': 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'marquee-reverse': 'marqueeReverse 50s linear infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'grow-bar': 'growBar 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        growBar: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
};
