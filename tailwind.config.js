/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,js,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        festive: {
          red: '#b80f0a',
          dark: '#7a0208',
          light: '#fdeff1',
          snow: '#f8fbff',
          pine: '#0f4c3a',
          mint: '#a2e8dd',
          gold: '#f2c94c',
        },
      },
      fontFamily: {
        display: ['"Berkshire Swash"', 'cursive'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'frosted-slope':
          'linear-gradient(135deg, rgba(243, 64, 64, 0.85), rgba(120, 6, 24, 0.95))',
        'frosted-overlay':
          'linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02))',
      },
      boxShadow: {
        glow: '0 0 25px rgba(248, 250, 255, 0.35)',
      },
      keyframes: {
        snowfall: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '20%': { opacity: '0.6' },
          '100%': { transform: 'translateY(600px)', opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        snowfall: 'snowfall 12s linear infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
