import {gql} from '@apollo/client';

const getActiveExtensions = gql`
  query GetActiveExtensions($token: String!) {
    getActiveExtensions(token: $token) {
      response {
        message
        status
      }
      activeExtensionData {
        _id
        userId
        extensionTitle
        extensionProductId
        paymentMethodId
        subscriptionId
        customerId
        status
      }
    }
  }
`;

const getActiveExtensionsForAdmin = gql`
  query GetActiveExtensionsForAdmin($searchParams: ExtensionSearchParams!) {
    getActiveExtensionsForAdmin(searchParams: $searchParams) {
      response {
        message
        status
      }
      activeExtensionData {
        _id
        createdDate
        userId {
          _id
          accountDetails {
            username
          }
        }
        extensionTitle
        extensionProductId
        paymentMethodId
        subscriptionId
        customerId
        status
      }
      extensionsCount
    }
  }
`;

const getActiveExtensionById = gql`
  query GetActiveExtensionById($token: String!, $documentId: String!) {
    getActiveExtensionById(token: $token, documentId: $documentId) {
      response {
        message
        status
      }
      activeExtensionData {
        _id
        userId
        extensionTitle
        extensionProductId
        paymentMethodId
        subscriptionId
        customerId
        status
      }
    }
  }
`;

const getActiveExtensionByProductId = gql`
  query GetActiveExtensionByProductId($token: String!, $productId: String!) {
    getActiveExtensionByProductId(token: $token, productId: $productId) {
      response {
        message
        status
      }
      activeExtensionData {
        _id
        userId
        extensionTitle
        extensionProductId
        paymentMethodId
        subscriptionId
        customerId
        status
      }
    }
  }
`;

const checkExtensionStatus = gql`
  query CheckExtensionStatus($productId: String!) {
    checkExtensionStatus(productId: $productId) {
      status
      isActive
      response {
        message
        status
      }
    }
  }
`;

const queries = {
  getActiveExtensions,
  getActiveExtensionById,
  getActiveExtensionByProductId,
  getActiveExtensionsForAdmin,
  checkExtensionStatus,
};

export default queries;
