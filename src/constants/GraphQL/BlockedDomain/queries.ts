import {gql} from '@apollo/client';

const validateDomain = gql`
  query ValidateDomain($domain: String!) {
    validateDomain(domain: $domain) {
      message
      status
    }
  }
`;

const queries = {validateDomain};

export default queries;
