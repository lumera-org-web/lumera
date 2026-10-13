import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          950: '#0D0705',
          900: '#140C09',
          850: '#1A100C',
          800: '#241611',
          700: '#331E17',
          600: '#4A2D23',
        },
        ivory: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F3ECE2',
          300: '#E7DDCE',
          400: '#D8C7B2',
        },
        gold: {
          300: '#F0DDBE',
          400: '#DEC197',
          500: '#C8A265',
          600: '#A88143',
          700: '#7E5F2B',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
