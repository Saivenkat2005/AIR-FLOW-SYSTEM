/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Manrope', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Deep Sky Blue
          600: '#0284c7', // Electric Blue
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e', // Royal Blue
        },
        secondary: {
          cyan: '#06b6d4',
          indigo: '#6366f1',
          emerald: '#10b981',
        },
        accent: {
          orange: '#f97316',
          gold: '#fbbf24',
          purple: '#a855f7',
        },
        neutral: {
          white: '#ffffff',
          slate: '#64748b',
          zinc: '#71717a',
          charcoal: '#3f3f46',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aurora': 'linear-gradient(to right top, #0ea5e9, #0284c7, #6366f1, #a855f7)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
