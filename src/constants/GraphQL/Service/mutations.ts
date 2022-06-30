import {gql} from '@apollo/client';

const createService = gql`
  mutation CreateService($token: String!, $serviceData: ServiceInput) {
    createService(token: $token, serviceData: $serviceData) {
      message
      status
    }
  }
`;

const editService = gql`
  mutation EditService($documentId: String!, $token: String!, $serviceData: ServiceInput) {
    editService(documentId: $documentId, token: $token, serviceData: $serviceData) {
      message
      status
    }
  }
`;

const deleteService = gql`
  mutation DeleteService($documentId: String!, $token: String!) {
    deleteService(documentId: $documentId, token: $token) {
      message
      status
    }
  }
`;

const mutations = {createService, editService, deleteService};

export default mutations;
