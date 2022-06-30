import {gql} from '@apollo/client';

const createOrganization = gql`
  mutation CreateOrganization($token: String!, $organizationData: OrganizationInput) {
    createOrganization(token: $token, organizationData: $organizationData) {
      message
      status
    }
  }
`;

const editOrganization = gql`
  mutation EditOrganization(
    $documentId: String!
    $token: String!
    $organizationData: OrganizationInput
  ) {
    editOrganization(documentId: $documentId, token: $token, organizationData: $organizationData) {
      message
      status
    }
  }
`;

const deleteOrganization = gql`
  mutation DeleteOrganization($documentId: String!, $token: String!) {
    deleteOrganization(documentId: $documentId, token: $token) {
      message
      status
    }
  }
`;

const adminDeleteOrganization = gql`
  mutation AdminDeleteOrganization($documentId: String!) {
    adminDeleteOrganization(documentId: $documentId) {
      message
      status
    }
  }
`;

const addOrganizationMember = gql`
  mutation AddOrganizationMember($token: String!, $organizationId: String!) {
    addOrganizationMember(token: $token, organizationId: $organizationId) {
      message
      status
    }
  }
`;
const kickOrganizationMember = gql`
  mutation KickOrganizationMember(
    $token: String!
    $organizationMembershipId: String!
    $organizationId: String!
    $kickReason: String!
  ) {
    kickOrganizationMember(
      token: $token
      organizationMembershipId: $organizationMembershipId
      organizationId: $organizationId
      kickReason: $kickReason
    ) {
      message
      status
    }
  }
`;

const handleLeave = gql`
  mutation leaveOrganization($token: String!, $organizationId: String!) {
    leaveOrganization(token: $token, organizationId: $organizationId) {
      message
      status
    }
  }
`;

const editOrganizationMemberRole = gql`
  mutation EditOrganizationMember(
    $token: String!
    $organizationId: String!
    $organizationMembershipId: String!
    $role: AllowedRoles!
  ) {
    editOrganizationMemberRole(
      token: $token
      organizationId: $organizationId
      organizationMembershipId: $organizationMembershipId
      role: $role
    ) {
      message
      status
    }
  }
`;

const addOrganizationServiceCategory = gql`
  mutation AddOrganizationServiceCategory(
    $token: String!
    $organizationId: String!
    $categoryData: String!
  ) {
    addOrganizationServiceCategory(
      token: $token
      organizationId: $organizationId
      categoryData: $categoryData
    ) {
      message
      status
    }
  }
`;

const removeOrganizationServiceCategory = gql`
  mutation RemoveOrganizationServiceCategory(
    $token: String!
    $organizationId: String!
    $categoryData: String!
  ) {
    removeOrganizationServiceCategory(
      token: $token
      organizationId: $organizationId
      categoryData: $categoryData
    ) {
      message
      status
    }
  }
`;

const createOrganizationService = gql`
  mutation CreateOrganizationService(
    $token: String!
    $organizationServiceData: OrganizationServiceInput
  ) {
    createOrganizationService(token: $token, organizationServiceData: $organizationServiceData) {
      message
      status
    }
  }
`;

const EditOrganizationService = gql`
  mutation EditOrganizationService(
    $documentId: String!
    $token: String!
    $organizationServiceData: OrganizationServiceInput
  ) {
    editOrganizationService(
      documentId: $documentId
      token: $token
      organizationServiceData: $organizationServiceData
    ) {
      message
      status
    }
  }
`;
const DeleteOrganizationService = gql`
  mutation DeleteOrganizationService($documentId: String!, $token: String!) {
    deleteOrganizationService(documentId: $documentId, token: $token) {
      message
      status
    }
  }
`;

const createPendingJoinRequest = gql`
  mutation CreatePendingJoinRequest($token: String!, $organizationId: String!) {
    createPendingJoinRequest(token: $token, organizationId: $organizationId) {
      message
      status
    }
  }
`;

const acceptPendingJoinRequest = gql`
  mutation AcceptPendingJoinRequest($token: String!, $pendingRequestId: String!) {
    acceptPendingJoinRequest(token: $token, pendingRequestId: $pendingRequestId) {
      message
      status
    }
  }
`;

const declinePendingJoinRequest = gql`
  mutation DeclinePendingJoinRequest($token: String!, $pendingRequestId: String!) {
    declinePendingJoinRequest(token: $token, pendingRequestId: $pendingRequestId) {
      message
      status
    }
  }
`;

const createPendingInvite = gql`
  mutation CreatePendingInvite(
    $token: String!
    $inviteeEmail: String!
    $organizationId: String!
    $organizationTitle: String!
  ) {
    createPendingInvite(
      token: $token
      inviteeEmail: $inviteeEmail
      organizationId: $organizationId
      organizationTitle: $organizationTitle
    ) {
      message
      status
    }
  }
`;

const deletePendingInvite = gql`
  mutation DeletePendingInvite($token: String!, $documentId: String!, $organizationId: String!) {
    deletePendingInvite(token: $token, documentId: $documentId, organizationId: $organizationId) {
      message
      status
    }
  }
`;

const acceptPendingInvite = gql`
  mutation AcceptPendingInvite(
    $token: String!
    $organizationId: String!
    $pendingInviteId: String!
  ) {
    acceptPendingInvite(
      token: $token
      organizationId: $organizationId
      pendingInviteId: $pendingInviteId
    ) {
      message
      status
    }
  }
`;

const declinePendingInvite = gql`
  mutation DeclinePendingInvite(
    $token: String!
    $organizationId: String!
    $pendingInviteId: String!
  ) {
    declinePendingInvite(
      token: $token
      organizationId: $organizationId
      pendingInviteId: $pendingInviteId
    ) {
      message
      status
    }
  }
`;

const adminCreateOrganization = gql`
  mutation AdminCreateOrganization($ownerEmail: String!, $organizationData: OrganizationInput) {
    adminCreateOrganization(ownerEmail: $ownerEmail, organizationData: $organizationData) {
      message
      status
    }
  }
`;

const adminEditOrganization = gql`
  mutation AdminEditOrganization($organizationData: OrganizationInput, $documentId: String!) {
    adminEditOrganization(organizationData: $organizationData, documentId: $documentId) {
      message
      status
    }
  }
`;

const mutations = {
  createOrganization,
  editOrganization,
  deleteOrganization,
  addOrganizationMember,
  editOrganizationMemberRole,
  kickOrganizationMember,
  addOrganizationServiceCategory,
  removeOrganizationServiceCategory,
  createOrganizationService,
  EditOrganizationService,
  handleLeave,
  DeleteOrganizationService,
  createPendingJoinRequest,
  acceptPendingJoinRequest,
  declinePendingJoinRequest,
  createPendingInvite,
  deletePendingInvite,
  acceptPendingInvite,
  declinePendingInvite,
  adminDeleteOrganization,
  adminCreateOrganization,
  adminEditOrganization,
};

export default mutations;
