import {gql} from '@apollo/client';

const getBookings = gql`
  query GetBookings($token: String!, $searchParams: BookingSearchParams) {
    getBookings(token: $token, searchParams: $searchParams) {
      response {
        message
        status
      }
      bookingData {
        _id
        serviceID
        provider
        booker
        dateBooked
        meetingCount
        bookerEmail
        bookerName
        providerEmail
        providerName
        bookerPhone
        bookerTimeZone
        ccRecipients
        additionalNotes
        price
        currency
        paymentType
        paymentAccount
        paymentStatus
        meetingDate
        percentDonated
        charity
        title
        subject
        conferenceType
        startTime
        endTime
        meetingDuration
        status {
          clientConfirmed
          clientCanceled
          providerConfirmed
          providerCanceled
          providerDeclined
        }
      }
    }
  }
`;
const getBookingById = gql`
  query GetBookingById($token: String!, $documentId: String!) {
    getBookingById(token: $token, documentId: $documentId) {
      response {
        message
        status
      }
      bookingData {
        _id
        serviceID
        provider
        booker
        dateBooked
        meetingCount
        providerEmail
        providerName
        bookerEmail
        bookerName
        bookerPhone
        bookerTimeZone
        ccRecipients
        additionalNotes
        price
        currency
        paymentType
        paymentAccount
        paymentStatus
        meetingDate
        percentDonated
        charity
        title
        subject
        conferenceType
        startTime
        endTime
        meetingDuration
        status {
          clientConfirmed
          clientCanceled
          providerConfirmed
          providerCanceled
          providerDeclined
          refunded
          refundRequested
          refundRequestReason
          hasOpenReport
          postMeetingNotes
          postMeetingFeedback
          reportReason
          paymentReleased
        }
      }
    }
  }
`;

const getBookingsForAdmin = gql`
  query GetBookingsForAdmin($token: String!, $searchParams: AdminBookingParams) {
    getBookingsForAdmin(token: $token, searchParams: $searchParams) {
      response {
        message
        status
      }
      bookingCount
      bookingData {
        _id
        serviceID
        provider
        booker
        dateBooked
        meetingCount
        bookerName
        bookerEmail
        providerName
        providerEmail
        bookerPhone
        bookerTimeZone
        ccRecipients
        additionalNotes
        price
        currency
        paymentType
        paymentAccount
        paymentStatus
        meetingDate
        percentDonated
        charity
        title
        subject
        conferenceType
        startTime
        endTime
        meetingDuration
      }
    }
  }
`;

const checkEmailFilter = gql`
  query CheckEmailFilter($serviceId: String!, $providerId: String!, $bookerEmail: String!) {
    checkEmailFilter(serviceID: $serviceId, providerID: $providerId, bookerEmail: $bookerEmail) {
      message
      status
    }
  }
`;

const queries = {
  getBookings,
  getBookingById,
  getBookingsForAdmin,
  checkEmailFilter,
};

export default queries;
