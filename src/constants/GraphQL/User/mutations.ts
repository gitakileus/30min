import {gql} from '@apollo/client';

const updateUserWelcome = gql`
  mutation UpdateUserWelcome($token: String!, $userData: WelcomeInput) {
    updateUserWelcome(token: $token, userData: $userData) {
      message
      status
    }
  }
`;

const updateUser = gql`
  mutation UpdateUser($token: String!, $userData: UserInput) {
    updateUser(token: $token, userData: $userData) {
      message
      status
    }
  }
`;

const adminUpdateUser = gql`
  mutation AdminUpdateUser($userData: AdminUserInput, $token: String!, $documentId: String!) {
    adminUpdateUser(userData: $userData, token: $token, documentId: $documentId) {
      message
      status
    }
  }
`;

const updateWorkingHours = gql`
  mutation UpdateWorkingHours($token: String!, $workingHours: WorkingHoursInput!) {
    updateWorkingHours(token: $token, workingHours: $workingHours) {
      message
      status
    }
  }
`;

const deleteUser = gql`
  mutation DeleteUser($token: String!) {
    deleteUser(token: $token) {
      message
      status
    }
  }
`;

const adminDeleteUser = gql`
  mutation AdminDeleteUser($token: String!, $documentId: String!) {
    adminDeleteUser(token: $token, documentId: $documentId) {
      message
      status
    }
  }
`;

const adminDeleteUsers = gql`
  mutation AdminDeleteUsers($userIDs: [String]!) {
    adminDeleteUsers(userIDs: $userIDs) {
      response {
        message
        status
      }
      userIDs
    }
  }
`;

const generateInviteLink = gql`
  mutation generateInviteLink($token: String!, $inviteeEmail: String!, $inviteeName: String!) {
    generateInviteLink(token: $token, inviteeEmail: $inviteeEmail, inviteeName: $inviteeName) {
      message
      status
    }
  }
`;

const handleEmailChange = gql`
  mutation HandleEmailChange($email: String!) {
    handleEmailChange(email: $email) {
      status
      message
    }
  }
`;
const mutations = {
  updateUserWelcome,
  updateUser,
  adminUpdateUser,
  updateWorkingHours,
  deleteUser,
  adminDeleteUser,
  adminDeleteUsers,
  generateInviteLink,
  handleEmailChange,
};

export default mutations;
