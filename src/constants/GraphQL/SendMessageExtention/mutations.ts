import {gql} from '@apollo/client';

const createMessage = gql`
  mutation CreateMessage($messageData: SendMessageInput) {
    createMessage(messageData: $messageData) {
      status
      message
    }
  }
`;

const mutations = {createMessage};

export default mutations;
