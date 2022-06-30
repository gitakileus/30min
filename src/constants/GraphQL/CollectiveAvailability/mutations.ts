import {gql} from '@apollo/client';

const CreateGroup = gql`
  mutation CreateGroup($groupData: GroupInput!) {
    createGroup(groupData: $groupData) {
      message
      status
    }
  }
`;

const EditGroup = gql`
  mutation EditGroup($groupData: EditGroupInput!, $documentId: String!) {
    editGroup(groupData: $groupData, documentId: $documentId) {
      message
      status
    }
  }
`;

const DeleteGroup = gql`
  mutation DeleteGroup($documentId: String!) {
    deleteGroup(documentId: $documentId) {
      message
      status
    }
  }
`;

const mutations = {CreateGroup, EditGroup, DeleteGroup};

export default mutations;
