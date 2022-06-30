import {gql} from '@apollo/client';

const getApiLogs = gql`
  query GetApiLogs($searchParams: ApiLogSearchParams) {
    getApiLogs(searchParams: $searchParams) {
      response {
        message
        status
      }
      logData {
        type
        level
        functionName
        functionParams {
          paramName
          paramValue
          paramType
        }
        additionalMessage
        startLogId
        createdAt
      }
      logsCount
    }
  }
`;

const getApiLogsForAdmin = gql`
  query GetApiLogsForAdmin($searchParams: ApiLogSearchParams, $token: String!) {
    getApiLogsForAdmin(searchParams: $searchParams, token: $token) {
      response {
        message
        status
      }
      logData {
        type
        level
        functionName
        functionParams {
          paramName
          paramValue
          paramType
        }
        additionalMessage
        startLogId
        createdAt
      }
      logsCount
    }
  }
`;

const getApiLogFilter = gql`
  query GetApiLogFilter($token: String!) {
    getApiLogFilter(token: $token) {
      response {
        message
        status
      }
      types
      levels
    }
  }
`;
const queries = {getApiLogs, getApiLogsForAdmin, getApiLogFilter};

export default queries;
