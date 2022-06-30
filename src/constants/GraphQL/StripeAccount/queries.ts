import {gql} from '@apollo/client';

const getStripeAccount = gql`
  query GetStripeAccount {
    getStripeAccount {
      response {
        message
        status
      }
      stripeAccountData {
        _id
        userId
        accountId
      }
    }
  }
`;

const queries = {getStripeAccount};

export default queries;
