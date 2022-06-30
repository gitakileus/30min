import {gql} from '@apollo/client';

const getJobHistoryById = gql`
  query GetJobHistoryById($documentId: String!, $token: String!) {
    getJobHistoryById(documentId: $documentId, token: $token) {
      response {
        message
        status
      }
      jobHistoryData {
        _id
        userId
        position
        company
        startDate
        endDate
        current
        roleDescription
        employmentType
        location
      }
    }
  }
`;

const getJobHistoryByUserId = gql`
  query GetJobHistoryByUserId($token: String!) {
    getJobHistoryByUserId(token: $token) {
      response {
        message
        status
      }
      jobHistoryData {
        _id
        userId
        position
        company
        startDate
        endDate
        current
        roleDescription
        employmentType
        location
      }
    }
  }
`;

const queries = {getJobHistoryById, getJobHistoryByUserId};

export default queries;
