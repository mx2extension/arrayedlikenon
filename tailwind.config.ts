import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f5f2ea',
        ink: '#151515',
      },
      fontFamily: {
        'serif-aln': ['"Cormorant Garamond"', 'serif'],
        'hand-aln': ['"Caveat"', 'cursive'],
        'sans': ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;