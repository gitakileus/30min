import {gql} from '@apollo/client';

const createJobHistory = gql`
  mutation CreateJobHistory($token: String!, $jobHistoryData: JobHistoryInput) {
    createJobHistory(token: $token, jobHistoryData: $jobHistoryData) {
      message
      status
    }
  }
`;

const editJobHistory = gql`
  mutation EditJobHistory($documentId: String!, $token: String!, $jobHistoryData: JobHistoryInput) {
    editJobHistory(documentId: $documentId, token: $token, jobHistoryData: $jobHistoryData) {
      message
      status
    }
  }
`;

const deleteJobHistory = gql`
  mutation DeleteJobHistory($documentId: String!, $token: String!) {
    deleteJobHistory(documentId: $documentId, token: $token) {
      message
      status
    }
  }
`;

const mutations = {createJobHistory, editJobHistory, deleteJobHistory};

export default mutations;
