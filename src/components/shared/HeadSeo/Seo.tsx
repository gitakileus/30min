import Head from 'next/head';

const HeadSeo = ({title, description, canonicalUrl, ogTwitterImage, ogType}) => (
  <Head>
    <title>{title}</title>
    <link rel='icon' href='/assets/favicon.ico' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <meta name='title' content={title} key='title' />
    <meta name='description' content={description} key='description' />
    <meta name='twitter:card' content='summary' key='twitter_card' />
    <meta name='twitter:title' content={title} key='twitter_title' />
    <meta name='twitter:description' content={description} key='twitter_description' />
    <meta name='twitter:image' content={ogTwitterImage} key='twitter_image' />
    <link rel='canonical' href={canonicalUrl} />
    <meta property='og:locale' content='en_US' />
    <meta property='og:site_name' content={'https://30mins.com'} key='site_name' />
    <meta property='og:type' content={ogType} />
    <meta name='title' property='og:title' content={title} />
    <meta name='description' property='og:description' content={description} />
    <meta name='image' property='og:image' content={ogTwitterImage} />
    <meta name='author' content={title} />
    <meta property='og:url' content={canonicalUrl} key='url' />
  </Head>
);

export default HeadSeo;
