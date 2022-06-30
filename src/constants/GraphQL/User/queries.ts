import {gql} from '@apollo/client';

const getUserById = gql`
  query GetUserById($token: String!) {
    getUserById(token: $token) {
      response {
        message
        status
      }
      userData {
        _id
        forTesting
        welcomeComplete
        otpToken
        orgMemberships
        services
        publications
        educationHistory
        jobHistory
        bookedMeetings
        couponCode
        accountDetails {
          profileBackground
          verifiedEmail
          credentialIDs
          privateAccount
          acceptedPaymentTypes
          isIndividual
          verifiedAccount
          accountType
          createdDate
          avatar
          password
          email
          username
          allowedConferenceTypes
          activeExtensions
          activeExtensionIDs
          paymentAccounts {
            direct
            escrow
          }
        }
        workingHours {
          startTime
          endTime
          isCustomEnabled
          monday {
            availability {
              start
              end
            }
            isActive
          }
          tuesday {
            availability {
              start
              end
            }
            isActive
          }
          wednesday {
            availability {
              start
              end
            }
            isActive
          }
          thursday {
            availability {
              start
              end
            }
            isActive
          }
          friday {
            availability {
              start
              end
            }
            isActive
          }
          saturday {
            availability {
              start
              end
            }
            isActive
          }
          sunday {
            availability {
              start
              end
            }
            isActive
          }
        }
        personalDetails {
          name
          description
          headline
          language
          phone
          website
          socials {
            facebook
            linkedin
            instagram
            twitter
            youtube
          }
          searchTags
          profileMediaLink
          profileMediaType
        }
        locationDetails {
          country
          timezone
          zipCode
          latitude
          longitude
        }
        billingDetails {
          customerId
          fname
          lname
          address
          buildingNumber
          city
          zipCode
          country
        }
      }
    }
  }
`;
const getUserForAdmin = gql`
  query GetUserForAdmin($token: String!, $documentId: String!) {
    getUserForAdmin(token: $token, documentId: $documentId) {
      response {
        message
        status
      }
      userData {
        _id
        forTesting
        welcomeComplete
        otpToken
        orgMemberships
        services
        publications
        educationHistory
        jobHistory
        bookedMeetings
        couponCode
        accountDetails {
          profileBackground
          verifiedEmail
          credentialIDs
          privateAccount
          acceptedPaymentTypes
          isIndividual
          verifiedAccount
          accountType
          createdDate
          avatar
          password
          email
          username
          allowedConferenceTypes
          activeExtensions
          activeExtensionIDs
          paymentAccounts {
            direct
            escrow
          }
        }
        workingHours {
          startTime
          endTime
          isCustomEnabled
          monday {
            availability {
              start
              end
            }
            isActive
          }
          tuesday {
            availability {
              start
              end
            }
            isActive
          }
          wednesday {
            availability {
              start
              end
            }
            isActive
          }
          thursday {
            availability {
              start
              end
            }
            isActive
          }
          friday {
            availability {
              start
              end
            }
            isActive
          }
          saturday {
            availability {
              start
              end
            }
            isActive
          }
          sunday {
            availability {
              start
              end
            }
            isActive
          }
        }
        personalDetails {
          name
          description
          headline
          phone
          website
          socials {
            facebook
            linkedin
            instagram
            twitter
            youtube
          }
          searchTags
          profileMediaLink
          profileMediaType
        }
        locationDetails {
          country
          timezone
          zipCode
          latitude
          longitude
        }
        billingDetails {
          customerId
          fname
          lname
          address
          buildingNumber
          city
          zipCode
          country
        }
      }
    }
  }
`;

const getUserByUsername = gql`
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      response {
        message
        status
      }
      userData {
        _id
        couponCode
        accountDetails {
          username
          email
          acceptedPaymentTypes
          allowedConferenceTypes
          credentialIDs
          activeExtensions
          paymentAccounts {
            direct
            escrow
          }
        }
        locationDetails {
          timezone
        }
      }
    }
  }
`;
const getUserByCode = gql`
  query GetUserByCode($code: String!) {
    getUserByCode(code: $code) {
      response {
        message
        status
      }
      emailHint
      hasAccount
    }
  }
`;

const getSentJoinInvites = gql`
  query GetSentJoinInvites($token: String!) {
    getSentJoinInvites(token: $token) {
      response {
        message
        status
      }
      pendingInvites {
        _id
        inviteeEmail
      }
    }
  }
`;

const getUserSearchResults = gql`
  query GetUserSearchResults($userSearchParams: UserSearchParams) {
    getUserSearchResults(userSearchParams: $userSearchParams) {
      response {
        message
        status
      }
      userCount
      userData {
        couponCode
        accountDetails {
          username
          email
          avatar
          isIndividual
          accountType
          verifiedAccount
          verifiedEmail
          acceptedPaymentTypes
          allowedConferenceTypes
          activeExtensions
          paymentAccounts {
            direct
            escrow
          }
        }
        personalDetails {
          name
          headline
          description
          socials {
            twitter
            instagram
            linkedin
            facebook
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
const getUsersForAdmin = gql`
  query GetUsersForAdmin($token: String!, $userSearchParams: AdminUserSearchParams) {
    getUsersForAdmin(token: $token, userSearchParams: $userSearchParams) {
      response {
        message
        status
      }
      userCount
      userData {
        couponCode
        _id
        forTesting
        welcomeComplete
        personalDetails {
          name
          description
          headline
          phone
          website
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
          searchTags
          profileMediaLink
          profileMediaType
        }
        locationDetails {
          country
          timezone
          zipCode
        }
        billingDetails {
          customerId
          fname
          lname
          address
          buildingNumber
          city
          zipCode
          country
        }
        accountDetails {
          username
          email
          avatar
          isIndividual
          accountType
          verifiedAccount
          verifiedEmail
          privateAccount
          acceptedPaymentTypes
          allowedConferenceTypes
          credentialIDs
          createdDate
          activeExtensions
          activeExtensionIDs
          paymentAccounts {
            direct
            escrow
          }
        }
      }
    }
  }
`;

const getPublicUserData = gql`
  query GetPublicUserData($username: String!) {
    getPublicUserData(username: $username) {
      response {
        message
        status
      }
      userData {
        couponCode
        accountDetails {
          username
          email
          avatar
          createdDate
          isIndividual
          accountType
          verifiedAccount
          verifiedEmail
          privateAccount
          acceptedPaymentTypes
          allowedConferenceTypes
          activeExtensions
          paymentAccounts {
            direct
            escrow
          }
          stripeAccountId
        }
        workingHours {
          startTime
          endTime
          isCustomEnabled
          monday {
            availability {
              start
              end
            }
            isActive
          }
          tuesday {
            availability {
              start
              end
            }
            isActive
          }
          wednesday {
            availability {
              start
              end
            }
            isActive
          }
          thursday {
            availability {
              start
              end
            }
            isActive
          }
          friday {
            availability {
              start
              end
            }
            isActive
          }
          saturday {
            availability {
              start
              end
            }
            isActive
          }
          sunday {
            availability {
              start
              end
            }
            isActive
          }
        }
        personalDetails {
          name
          description
          headline
          phone
          website
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
          searchTags
          profileMediaLink
          profileMediaType
        }
        publications {
          headline
          url
          type
          image
          description
        }
        jobHistory {
          position
          startDate
          company
          current
          endDate
          roleDescription
          employmentType
          location
        }
        educationHistory {
          degree
          school
          startDate
          endDate
          current
          graduated
          additionalInfo
          extracurricular
          fieldOfStudy
        }
        locationDetails {
          timezone
          country
        }
        services {
          _id
          serviceType
          emailFilter {
            type
            emails
            domains
          }
          title
          slug
          description
          duration
          isPrivate
          price
          currency
          charity
          percentDonated
          recurringInterval
          conferenceType
          media {
            type
            link
          }
          searchTags
          paymentType
          isPaid
          hasReminder
          isRecurring
          serviceWorkingHours {
            isCustomEnabled
            monday {
              availability {
                start
                end
              }
              isActive
            }
            tuesday {
              availability {
                start
                end
              }
              isActive
            }
            wednesday {
              availability {
                start
                end
              }
              isActive
            }
            thursday {
              availability {
                start
                end
              }
              isActive
            }
            friday {
              availability {
                start
                end
              }
              isActive
            }
            saturday {
              availability {
                start
                end
              }
              isActive
            }
            sunday {
              availability {
                start
                end
              }
              isActive
            }
          }
        }
      }
    }
  }
`;

const getUsersWithAdvertisingExtension = gql`
  query getUsersWithAdvertisingExtension {
    getUsersWithAdvertisingExtension {
      response {
        message
        status
      }
      userData {
        personalDetails {
          name
        }
        accountDetails {
          username
        }
      }
    }
  }
`;

const getUserAndOrganizationSearchResults = gql`
  query GetUserAndOrganizationSearchResults($searchParams: UserSearchParams) {
    getUserAndOrganizationSearchResults(searchParams: $searchParams) {
      response {
        message
        status
      }
      userData {
        couponCode
        accountDetails {
          username
          email
          avatar
          isIndividual
          accountType
          verifiedAccount
          verifiedEmail
          acceptedPaymentTypes
          allowedConferenceTypes
          activeExtensions
        }
        personalDetails {
          name
          headline
          description
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
        }
        locationDetails {
          country
        }
      }
      userCount
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
      serviceCount
      serviceData {
        _id
        organizationName
        image
        serviceType
        orgServiceCategory
        title
        slug
        duration
        description
        price
        currency
        conferenceType
        isPaid
        serviceType
        userId {
          _id
          accountDetails {
            username
            avatar
          }
          personalDetails {
            name
            headline
          }
        }
      }
    }
  }
`;

const getUsersForSeo = gql`
  query GetUsersForSeo($resultsPerBatch: Int!, $batchNumber: Int!) {
    getUsersForSeo(resultsPerBatch: $resultsPerBatch, batchNumber: $batchNumber) {
      response {
        message
        status
      }
      userCount
      userData {
        accountDetails {
          avatar
          username
        }
        personalDetails {
          description
        }
      }
    }
  }
`;

const queries = {
  getUserById,
  getUserByUsername,
  getPublicUserData,
  getUserSearchResults,
  getUsersForAdmin,
  getUserForAdmin,
  getUserByCode,
  getSentJoinInvites,
  getUsersWithAdvertisingExtension,
  getUserAndOrganizationSearchResults,
  getUsersForSeo,
};

export default queries;
