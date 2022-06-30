import {gql} from '@apollo/client';

const createHaveAnIdeaMessage = gql`
  mutation CreateHaveAnIdeaMessage($token: String!, $messageData: haveAnIdeaInput) {
    createHaveAnIdeaMessage(token: $token, messageData: $messageData) {
      message
      status
    }
  }
`;

const mutations = {createHaveAnIdeaMessage};

export default mutations;
