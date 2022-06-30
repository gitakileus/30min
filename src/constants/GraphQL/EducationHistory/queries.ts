import {gql} from '@apollo/client';

const getEducationHistoryById = gql`
  query GetEducationHistoryById($documentId: String!, $token: String!) {
    getEducationHistoryById(documentId: $documentId, token: $token) {
      response {
        message
        status
      }
      educationHistoryData {
        _id
        userId
        degree
        school
        startDate
        endDate
        current
        graduated
        additionalInfo
        extracurricular
        fieldOfStudy
      }
    }
  }
`;

const getEducationHistoryByUserId = gql`
  query GetEducationHistoryByUserId($token: String!) {
    getEducationHistoryByUserId(token: $token) {
      response {
        message
        status
      }
      educationHistoryData {
        _id
        userId
        degree
        school
        startDate
        endDate
        current
        graduated
        additionalInfo
        extracurricular
        fieldOfStudy
      }
    }
  }
`;

const queries = {getEducationHistoryById, getEducationHistoryByUserId};

export default queries;
