const nextTranslate = require('next-translate');

module.exports = nextTranslate();

module.exports = nextTranslate({
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'localhost',
      's3.us-east-2.amazonaws.com',
      'expertsmeetup-public.s3.us-east-2.amazonaws.com',
      '30mins.com.s3.us-east-2.amazonaws.com',
      '30mins-com.s3.us-east-2.amazonaws.com',
    ],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt', 'it', 'ro'],
  },
});
