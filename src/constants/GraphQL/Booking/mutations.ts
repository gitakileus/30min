import {gql} from '@apollo/client';

const bookMeeting = gql`
  mutation BookMeeting($bookingData: BookingDataInput) {
    bookMeeting(bookingData: $bookingData) {
      response {
        message
        status
      }
      bookingId
      providerLanguage
      bookerLanguage
    }
  }
`;

const createPendingMeeting = gql`
  mutation CreatePendingMeeting($bookingData: BookingDataInput) {
    createPendingMeeting(bookingData: $bookingData) {
      response {
        message
        status
      }
      bookingId
      providerLanguage
      bookerLanguage
    }
  }
`;

const confirmMeeting = gql`
  mutation ConfirmMeeting($documentId: String!, $chargeID: String!) {
    confirmMeeting(documentId: $documentId, chargeID: $chargeID) {
      response {
        message
        status
      }
      providerUser {
        _id
        accountDetails {
          username
          email
          stripeAccountId
        }
        personalDetails {
          name
        }
        locationDetails {
          timezone
        }
      }
      serviceData {
        title
        duration
        description
      }
      bookingData {
        _id
        confirmed
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

const updateBookingStatus = gql`
  mutation UpdateBookingStatus($statusUpdateData: StatusUpdateInput) {
    updateBookingStatus(statusUpdateData: $statusUpdateData) {
      message
      status
    }
  }
`;

const mutations = {bookMeeting, updateBookingStatus, createPendingMeeting, confirmMeeting};

export default mutations;
