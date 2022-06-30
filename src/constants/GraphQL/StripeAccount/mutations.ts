import {gql} from '@apollo/client';

const createStripeAccount = gql`
  mutation CreateStripeAccount($stripeAccountData: StripeAccountInput!, $token: String!) {
    createStripeAccount(stripeAccountData: $stripeAccountData, token: $token) {
      message
      status
    }
  }
`;

const updateStripeAccount = gql`
  mutation UpdateStripeAccount($stripeAccountData: StripeAccountInput!) {
    updateStripeAccount(stripeAccountData: $stripeAccountData) {
      message
      status
    }
  }
`;

const deleteStripeAccount = gql`
  mutation DeleteStripeAccount($token: String!, $documentId: String!) {
    deleteStripeAccount(token: $token, documentId: $documentId) {
      message
      status
    }
  }
`;

const mutations = {createStripeAccount, updateStripeAccount, deleteStripeAccount};

export default mutations;
