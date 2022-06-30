import {gql} from '@apollo/client';

const getPublicationById = gql`
  query GetPublicationById($token: String!, $documentId: String!) {
    getPublicationById(token: $token, documentId: $documentId) {
      response {
        message
        status
      }
      publicationData {
        _id
        userId
        headline
        url
        type
        image
        description
      }
    }
  }
`;

const getPublicationsByUserId = gql`
  query GetPublicationsByUserId($token: String!) {
    getPublicationsByUserId(token: $token) {
      response {
        message
        status
      }
      publicationData {
        _id
        userId
        headline
        url
        type
        image
        description
      }
    }
  }
`;

const queries = {getPublicationById, getPublicationsByUserId};

export default queries;
