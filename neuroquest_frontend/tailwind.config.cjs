module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        secondary: '#0f172a',
        accent: '#4ade80',
        // Neon palette for futuristic zones
        'emerald-300': '#6ee7b7',
        'fuchsia-400': '#e879f9',
        'rose-400': '#fb7185',
        'cyan-400': '#22d3ee',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        neon: '0 0 16px 4px #7c3aed90, 0 0 80px 8px #4ade8090'
      }
    },
  },
  plugins: [],
}
