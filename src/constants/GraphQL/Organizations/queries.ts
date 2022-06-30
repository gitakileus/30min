import {gql} from '@apollo/client';

const getOrganizationsByTitle = gql`
  query GetOrganizationsByTitle($title: String!) {
    getOrganizationsByTitle(title: $title) {
      response {
        message
        status
      }
      organizationData {
        _id
        title
        slug
        headline
        restrictionLevel
        description
        image
        website
        supportEmail
        supportPhone
        serviceCategories
        location
        socials {
          twitter
          linkedin
          facebook
          instagram
          youtube
        }
        verified
        searchTags
        media {
          type
          link
        }
        isPrivate
        services
        members
      }
    }
  }
`;
const getOrganizationBySlug = gql`
  query GetOrganizationBySlug($slug: String!) {
    getOrganizationBySlug(slug: $slug) {
      response {
        message
        status
      }
      organizationData {
        _id
        title
        slug
        headline
        restrictionLevel
        description
        image
        website
        supportEmail
        supportPhone
        serviceCategories
        location
        socials {
          twitter
          linkedin
          facebook
          instagram
          youtube
        }
        verified
        searchTags
        media {
          type
          link
        }
        isPrivate
        services
        members
      }
    }
  }
`;

const getOrganizationById = gql`
  query GetOrganizationById($organizationId: String!) {
    getOrganizationById(organizationId: $organizationId) {
      response {
        message
        status
      }
      organizationData {
        _id
        title
        slug
        headline
        restrictionLevel
        description
        image
        website
        supportEmail
        supportPhone
        serviceCategories
        location
        socials {
          twitter
          linkedin
          facebook
          instagram
          youtube
        }
        verified
        searchTags
        media {
          type
          link
        }
        isPrivate
        services
        members
      }
    }
  }
`;

const getOrganizationManagementDetails = gql`
  query GetOrganizationManagementDetails($token: String!) {
    getOrganizationManagementDetails(token: $token) {
      response {
        message
        status
      }
      membershipData {
        _id
        userId
        role
        organizationId {
          _id
          title
          headline
          slug
          description
          image
          website
          supportEmail
          supportPhone
          location
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
          verified
          searchTags
          serviceCategories
          media {
            type
            link
          }
          isPrivate
          services
          members
        }
      }
    }
  }
`;

const getOrganizationsByUserId = gql`
  query GetOrganizationsByUserId($token: String!) {
    getOrganizationsByUserId(token: $token) {
      response {
        message
        status
      }
      membershipData {
        _id
        userId
        role
        organizationId {
          _id
          title
          slug
          serviceCategories
        }
      }
    }
  }
`;

const GetOrganizationMembersById = gql`
  query GetOrganizationMembersById(
    $token: String!
    $documentId: String!
    $searchParams: OrgMemberSearchParams!
  ) {
    getOrganizationMembersById(
      token: $token
      documentId: $documentId
      searchParams: $searchParams
    ) {
      response {
        message
        status
      }
      memberCount
      members {
        _id
        userId {
          accountDetails {
            username
            avatar
          }
          personalDetails {
            description
            headline
            name
          }
          locationDetails {
            country
          }
        }
        role
        organizationId
      }
    }
  }
`;
const getOrganizationSearchResults = gql`
  query GetOrganizationSearchResults($orgSearchParams: OrgSearchParams) {
    getOrganizationSearchResults(orgSearchParams: $orgSearchParams) {
      response {
        message
        status
      }
      organizationCount
      organizationData {
        _id
        title
        slug
        headline
        description
        image
        website
        supportEmail
        supportPhone
        location
        socials {
          twitter
          instagram
          linkedin
          facebook
          youtube
        }
        verified
        searchTags
        serviceCategories
        media {
          type
          link
        }
        isPrivate
      }
    }
  }
`;

const getOrganizationsForAdmin = gql`
  query GetOrganizationsForAdmin($orgSearchParams: OrgSearchParams) {
    getOrganizationsForAdmin(orgSearchParams: $orgSearchParams) {
      response {
        message
        status
      }
      organizationCount
      organizationData {
        _id
        createdDate
        title
        slug
        headline
        description
        image
        website
        supportEmail
        supportPhone
        location
        socials {
          twitter
          instagram
          linkedin
          facebook
          youtube
        }
        verified
        searchTags
        serviceCategories
        media {
          type
          link
        }
        isPrivate
      }
    }
  }
`;

const GetOrganizationServiceResults = gql`
  query GetOrganizationServiceResults(
    $searchParams: OrgServiceSearchParams!
    $documentId: String!
  ) {
    getOrganizationServiceResults(searchParams: $searchParams, documentId: $documentId) {
      response {
        message
        status
      }
      serviceCount
      services {
        _id
        userId {
          _id
          accountDetails {
            username
            avatar
          }
          personalDetails {
            name
            headline
            description
            socials {
              facebook
              instagram
              linkedin
              twitter
              youtube
            }
          }
        }
        title
        serviceType
        slug
        image
        description
        duration
        isPrivate
        price
        currency
        percentDonated
        charity
        reminders
        recurringInterval
        conferenceType
        searchTags
        media {
          type
          link
        }
        paymentType
        isPaid
        hasReminder
        isRecurring
      }
    }
  }
`;

const getOrganizationMemberResults = gql`
  query GetOrganizationMemberResults($documentId: String!, $searchParams: OrgMemberSearchParams!) {
    getOrganizationMemberResults(documentId: $documentId, searchParams: $searchParams) {
      response {
        message
        status
      }
      userCount
      userData {
        accountDetails {
          username
          email
          avatar
          verifiedAccount
          privateAccount
          acceptedPaymentTypes
          activeExtensions
        }
        personalDetails {
          name
          description
          headline
          phone
          socials {
            facebook
            instagram
            linkedin
            twitter
            youtube
          }
        }
        locationDetails {
          country
        }
      }
    }
  }
`;

const getPendingInvitesByUserId = gql`
  query GetPendingInvitesByUserId($token: String!) {
    getPendingInvitesByUserId(token: $token) {
      response {
        message
        status
      }
      pendingInvites {
        _id
        inviteeUserId
        inviteeEmail
        organizationId {
          _id
          restrictionLevel
          title
          headline
          description
          image
          website
          supportEmail
          supportPhone
          location
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
          verified
          searchTags
          serviceCategories
          isPrivate
        }
      }
    }
  }
`;

const getPendingJoinRequestsByOrgId = gql`
  query GetPendingJoinRequestsByOrgId($token: String!, $organizationId: String!) {
    getPendingJoinRequestsByOrgId(token: $token, organizationId: $organizationId) {
      response {
        message
        status
      }
      pendingJoinRequests {
        _id
        requesterUserId {
          accountDetails {
            username
            email
            avatar
            createdDate
            isIndividual
            accountType
            verifiedAccount
            verifiedEmail
            acceptedPaymentTypes
            privateAccount
          }
          personalDetails {
            name
            description
            headline
            phone
            website
            searchTags
            profileMediaLink
            profileMediaType
            socials {
              twitter
              instagram
              linkedin
              youtube
              facebook
            }
          }
          locationDetails {
            country
            timezone
          }
        }
        organizationId
      }
    }
  }
`;

const getPendingInvitesByOrgId = gql`
  query GetPendingInvitesByOrgId($token: String!, $organizationId: String!) {
    getPendingInvitesByOrgId(token: $token, organizationId: $organizationId) {
      response {
        message
        status
      }
      pendingInvites {
        inviteeEmail
        _id
        inviteeUserId {
          accountDetails {
            email
            username
            avatar
            isIndividual
            accountType
          }
          personalDetails {
            name
          }
        }
      }
    }
  }
`;

const getOrganizationMembership = gql`
  query GetOrganizationMembership($token: String!, $organizationId: String!) {
    getOrganizationMembership(token: $token, organizationId: $organizationId) {
      response {
        message
        status
      }
      membership {
        _id
        userId
        organizationId {
          _id
          title
          slug
          headline
          restrictionLevel
          description
          image
          website
          supportEmail
          supportPhone
          serviceCategories
          location
          socials {
            twitter
            linkedin
            facebook
            instagram
            youtube
          }
          verified
          searchTags
          media {
            type
            link
          }
          isPrivate
          services
          members
        }
        role
      }
    }
  }
`;

const getOrganizationsForSeo = gql`
  query GetOrganizationsForSeo($resultsPerBatch: Int!, $batchNumber: Int!) {
    getOrganizationsForSeo(resultsPerBatch: $resultsPerBatch, batchNumber: $batchNumber) {
      response {
        message
        status
      }
      organizationData {
        title
        slug
        image
        description
      }
      organizationCount
    }
  }
`;

const queries = {
  getOrganizationsByTitle,
  getOrganizationBySlug,
  getOrganizationById,
  getOrganizationManagementDetails,
  GetOrganizationMembersById,
  getOrganizationsByUserId,
  GetOrganizationServiceResults,
  getOrganizationMemberResults,
  getPendingInvitesByUserId,
  getPendingJoinRequestsByOrgId,
  getPendingInvitesByOrgId,
  getOrganizationMembership,
  getOrganizationSearchResults,
  getOrganizationsForAdmin,
  getOrganizationsForSeo,
};

export default queries;
