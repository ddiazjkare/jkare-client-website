/** @type {import('tailwindcss').Config} */

import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette.js';

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([k, v]) => [`--${k}`, v]),
  );

  addBase({ ':root': newVars });
}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      montserrat: ['"montserrat"', 'sans-serif'],
    },
    extend: {
      /* ---------- brand colours ---------- */
      colors: {
        customPink: '#f03385',
        customBlue: '#00b0f0',
        customBaseBlue: '#7fd6f5',
        customDarkGray: '#343637',
        customLightBlue: '#DDF2FF',
        customPurple: '#5B22B8',
      },

      /* ---------- background presets ---------- */
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      /* ---------- ✨ fade‑in animation ---------- */
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease forwards',
      },
    },
  },
  plugins: [addVariablesForColors],
};
