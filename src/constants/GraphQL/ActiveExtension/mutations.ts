import {gql} from '@apollo/client';

const createActiveExtension = gql`
  mutation CreateActiveExtension($activeExtensionData: ActiveExtensionInput!, $token: String!) {
    createActiveExtension(activeExtensionData: $activeExtensionData, token: $token) {
      message
      status
    }
  }
`;

const updateActiveExtension = gql`
  mutation updateActiveExtension(
    $activeExtensionData: ActiveExtensionInput!
    $customerId: String!
    $subscriptionId: String!
  ) {
    updateActiveExtension(
      activeExtensionData: $activeExtensionData
      customerId: $customerId
      subscriptionId: $subscriptionId
    ) {
      message
      status
    }
  }
`;

const deleteActiveExtension = gql`
  mutation deleteActiveExtension($token: String!, $documentId: String!) {
    deleteActiveExtension(token: $token, documentId: $documentId) {
      message
      status
    }
  }
`;

const adminAddGiftedExtension = gql`
  mutation AdminAddGiftedExtension(
    $extensionProductId: String!
    $extensionTitle: String!
    $userEmail: String!
  ) {
    adminAddGiftedExtension(
      extensionProductId: $extensionProductId
      extensionTitle: $extensionTitle
      userEmail: $userEmail
    ) {
      message
      status
    }
  }
`;

const adminDeleteActiveExtension = gql`
  mutation AdminDeleteActiveExtension($documentId: String!) {
    adminDeleteActiveExtension(documentId: $documentId) {
      message
      status
    }
  }
`;

const mutations = {
  createActiveExtension,
  updateActiveExtension,
  deleteActiveExtension,
  adminAddGiftedExtension,
  adminDeleteActiveExtension,
};

export default mutations;
