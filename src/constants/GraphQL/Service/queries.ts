import {gql} from '@apollo/client';

const getServiceById = gql`
  query GetServiceById($documentId: String!, $token: String!) {
    getServiceById(documentId: $documentId, token: $token) {
      response {
        message
        status
      }
      serviceData {
        _id
        serviceType
        title
        slug
        image
        description
        duration
        isPrivate
        orgServiceCategory
        organizationName
        price
        currency
        percentDonated
        charity
        reminders
        recurringInterval
        conferenceType
        searchTags
        paymentType
        isRecurring
        isPaid
        isOrgService
        emailFilter {
          type
          emails
          domains
        }
        media {
          type
          link
        }
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
`;

const getServicesByUserId = gql`
  query GetServicesByUserId($token: String!) {
    getServicesByUserId(token: $token) {
      response {
        message
        status
      }
      serviceData {
        _id
        serviceType
        title
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
        orgServiceCategory
        organizationName
        recurringInterval
        conferenceType
        isRecurring
        searchTags
        isOrgService
        emailFilter {
          type
          emails
          domains
        }
        media {
          type
          link
        }
        paymentType
        isPaid
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
`;

const getServicesForAdmin = gql`
  query GetServicesForAdmin($token: String!, $serviceSearchParams: AdminServiceSearchParams) {
    getServicesForAdmin(token: $token, serviceSearchParams: $serviceSearchParams) {
      response {
        status
        message
      }
      serviceCount
      serviceData {
        userId {
          personalDetails {
            name
          }
          accountDetails {
            username
          }
        }
        organizationName
        serviceType
        title
        image
        slug
        duration
        price
        currency
      }
    }
  }
`;

const getServicesForSeo = gql`
  query GetServicesForSeo($resultsPerBatch: Int!, $batchNumber: Int!) {
    getServicesForSeo(resultsPerBatch: $resultsPerBatch, batchNumber: $batchNumber) {
      serviceData {
        title
        slug
        description
        userId {
          accountDetails {
            username
          }
        }
      }
      serviceCount
      response {
        message
        status
      }
    }
  }
`;

const queries = {getServiceById, getServicesByUserId, getServicesForAdmin, getServicesForSeo};

export default queries;
