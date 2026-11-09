export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#15803D',        // green-700
        brandDark: '#14532D',    // green-900
        gold: '#FFC72C',
        charcoal: '#171717',
        cream: '#FFFDF8'
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
};