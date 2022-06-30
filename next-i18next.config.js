const path = require('path');
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt', 'it', 'ro'],
    localePath: path.resolve('./public/locales'),
  },
};
