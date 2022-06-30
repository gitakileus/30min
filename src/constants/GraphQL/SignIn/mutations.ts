import {gql} from '@apollo/client';

const handleSignIn = gql`
  mutation Mutation($email: String!, $name: String!) {
    handleSignIn(email: $email, name: $name) {
      message
      status
    }
  }
`;

const handleOtpSignUp = gql`
  mutation Mutation($email: String!, $name: String!) {
    handleOtpSignUp(email: $email, name: $name) {
      message
      status
    }
  }
`;

const handleOtpSignIn = gql`
  mutation Mutation($email: String!) {
    handleOtpSignIn(email: $email) {
      message
      status
    }
  }
`;

const validateOtp = gql`
  mutation Mutation($email: String!, $otpToken: String!) {
    validateOtp(email: $email, otpToken: $otpToken) {
      email
      name
      response {
        message
        status
      }
    }
  }
`;

const mutations = {handleSignIn, handleOtpSignUp, validateOtp, handleOtpSignIn};

export default mutations;
