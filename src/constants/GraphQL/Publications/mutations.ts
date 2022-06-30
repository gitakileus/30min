import {gql} from '@apollo/client';

const createPublication = gql`
  mutation CreatePublication($token: String!, $publicationData: PublicationInput) {
    createPublication(token: $token, publicationData: $publicationData) {
      message
      status
    }
  }
`;

const editPublication = gql`
  mutation EditPublication(
    $documentId: String!
    $token: String!
    $publicationData: PublicationInput
  ) {
    editPublication(documentId: $documentId, token: $token, publicationData: $publicationData) {
      message
      status
    }
  }
`;

const deletePublication = gql`
  mutation DeletePublication($documentId: String!, $token: String!) {
    deletePublication(documentId: $documentId, token: $token) {
      message
      status
    }
  }
`;

const mutations = {createPublication, editPublication, deletePublication};

export default mutations;
