import {gql} from '@apollo/client';

const createEducationHistory = gql`
  mutation CreateEducationHistory($token: String!, $educationHistoryData: EducationHistoryInput) {
    createEducationHistory(token: $token, educationHistoryData: $educationHistoryData) {
      message
      status
    }
  }
`;

const editEducationHistory = gql`
  mutation EditEducationHistory(
    $documentId: String!
    $token: String!
    $educationHistoryData: EducationHistoryInput
  ) {
    editEducationHistory(
      documentId: $documentId
      token: $token
      educationHistoryData: $educationHistoryData
    ) {
      message
      status
    }
  }
`;

const deleteEducationHistory = gql`
  mutation DeleteEducationHistory($documentId: String!, $token: String!) {
    deleteEducationHistory(documentId: $documentId, token: $token) {
      message
      status
    }
  }
`;

const mutations = {createEducationHistory, editEducationHistory, deleteEducationHistory};

export default mutations;
