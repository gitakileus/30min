import {gql} from '@apollo/client';

const getCharities = gql`
  query GetCharities($token: String!) {
    getCharities(token: $token) {
      response {
        message
        status
      }
      charityData {
        _id
        name
        taxID
        description
        website
      }
    }
  }
`;

const getCharityById = gql`
  query GetCharityById($token: String!, $documentId: String!) {
    getCharityById(token: $token, documentId: $documentId) {
      response {
        message
        status
      }
      charityData {
        _id
        name
        taxID
        description
        website
      }
    }
  }
`;

const queries = {getCharities, getCharityById};

export default queries;
