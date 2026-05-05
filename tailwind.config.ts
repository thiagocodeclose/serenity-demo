import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'Cormorant Garamond', 'serif'],
        body: ['var(--font-body)', 'DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#FAF8F5',
        cream: '#F0EBE3',
        primary: '#8B7355',
        accent: '#C4A882',
        sage: '#7C9070',
        ink: '#2C2C2C',
        muted: '#6B6B6B',
        border: '#E5DDD5',
      },
      animation: {
        'slow-zoom': 'slowZoom 22s ease-in-out infinite alternate',
        'grain': 'grain 0.8s steps(1) infinite',
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.07)' },
        },
        grain: {
          '0%, 100%': { backgroundPosition: '0 0' },
          '10%': { backgroundPosition: '-5% -10%' },
          '20%': { backgroundPosition: '-15% 5%' },
          '30%': { backgroundPosition: '7% -25%' },
          '40%': { backgroundPosition: '20% 25%' },
          '50%': { backgroundPosition: '-25% 10%' },
          '60%': { backgroundPosition: '15% 5%' },
          '70%': { backgroundPosition: '0 15%' },
          '80%': { backgroundPosition: '25% 35%' },
          '90%': { backgroundPosition: '-10% 10%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
