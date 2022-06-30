import queries from 'constants/GraphQL/Sitemap/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';

const SitemapIndex = () => {};

export const getServerSideProps = async ({res}) => {
  const baseUrl = 'https://30mins.com';

  const dataResponse = await graphqlRequestHandler(
    queries.getSitemaps,
    null,
    process.env.BACKEND_API_KEY
  );

  const sitemapindex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${dataResponse.data.data.getSitemaps.groups
        .map(group =>
          group.sitemaps
            .map(
              sitemap =>
                `
          <sitemap>
            <loc>${baseUrl}/sitemaps/${group._id}-${sitemap.index}.xml</loc>
          </sitemap>
          `
            )
            .join('')
        )
        .join('')}
    </sitemapindex>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemapindex);
  res.end();

  return {
    props: {},
  };
};

export default SitemapIndex;
