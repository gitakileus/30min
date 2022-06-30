import {gql} from '@apollo/client';

const getSitemap = gql`
  query GetSitemap($sitemapType: String!, $sitemapIndex: String!) {
    getSitemap(sitemapType: $sitemapType, sitemapIndex: $sitemapIndex) {
      response {
        message
        status
      }
      sitemap {
        content
      }
    }
  }
`;

const getSitemaps = gql`
  query GetSitemaps {
    getSitemaps {
      response {
        message
        status
      }
      groups {
        _id
        sitemaps {
          index
        }
      }
    }
  }
`;

const queries = {getSitemap, getSitemaps};

export default queries;
