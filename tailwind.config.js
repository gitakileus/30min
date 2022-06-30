const withAnimations = require('animated-tailwindcss');
module.exports = withAnimations({
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /*  mainBlue: '#4554fb', */
        mainBlue: '#00a3fe',
        mainText: '#293241',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
});
