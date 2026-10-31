/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Orbitron-Medium', 'Orbitron', 'Arial Narrow', 'sans-serif'],
        orbitron: ['Orbitron-Medium', 'Orbitron', 'Arial Narrow', 'sans-serif'],
      },
      colors: {
        nexus: {
          950: '#050A14',
          900: '#08111F',
          800: '#0D1B2A',
          700: '#15263C',
          surface: 'rgba(255, 255, 255, 0.05)',
          surfaceStrong: 'rgba(255, 255, 255, 0.09)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderStrong: 'rgba(56, 189, 248, 0.25)',
        },
        sky: {
          400: '#38BDF8',
          500: '#0EA5E9',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
        indigo: {
          400: '#818CF8',
          500: '#6366F1',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        rose: {
          400: '#FB7185',
          500: '#F43F5E',
        }
      },
      boxShadow: {
        'nexus-glass': '0 12px 40px rgba(0, 0, 0, 0.35)',
        'nexus-deep': '0 30px 100px rgba(0, 0, 0, 0.55)',
        'glow-blue': '0 0 25px rgba(56, 189, 248, 0.25)',
        'glow-cyan': '0 0 25px rgba(34, 211, 238, 0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
};
