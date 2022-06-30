import {gql} from '@apollo/client';

const createCharity = gql`
  mutation CreateCharity($charityData: CharityInput!, $token: String!) {
    createCharity(charityData: $charityData, token: $token) {
      message
      status
    }
  }
`;

const updateCharity = gql`
  mutation UpdateCharity($charityData: CharityInput!, $token: String!, $documentId: String!) {
    updateCharity(charityData: $charityData, token: $token, documentId: $documentId) {
      message
      status
    }
  }
`;

const deleteCharity = gql`
  mutation DeleteCharity($token: String!, $documentId: String!) {
    deleteCharity(token: $token, documentId: $documentId) {
      message
      status
    }
  }
`;

const mutations = {createCharity, updateCharity, deleteCharity};

export default mutations;
