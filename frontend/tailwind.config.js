/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        eco: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        emerald: {
          450: '#1db954',
        },
        sage: {
          50:  '#f8faf8',
          100: '#eef3ee',
          200: '#d5e8d5',
        },
      },
      fontFamily: {
        display: ['"Nunito"', 'system-ui', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'eco-gradient':  'linear-gradient(135deg, #16a34a 0%, #15803d 40%, #14532d 100%)',
        'eco-gradient2': 'linear-gradient(135deg, #22c55e 0%, #16a34a 60%, #15803d 100%)',
        'eco-gradient3': 'linear-gradient(160deg, #1a7a3a 0%, #0f5c2a 100%)',
        'card-glass':    'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'eco':      '0 4px 20px rgba(22, 163, 74, 0.25)',
        'eco-lg':   '0 8px 40px rgba(22, 163, 74, 0.35)',
        'glass':    '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card':     '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
        'sidebar':  '4px 0 24px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
