import {gql} from '@apollo/client';

const getGroupByID = gql`
  query GetGroupById($documentId: String!) {
    getGroupById(documentId: $documentId) {
      response {
        status
        message
      }
      groupData {
        _id
        name
        ownerID
        guestIDs {
          _id
          accountDetails {
            email
          }
        }
      }
    }
  }
`;

const getAllGroups = gql`
  query GetAllGroups {
    getAllGroups {
      response {
        message
        status
      }
      groupData {
        _id
        name
        ownerID
        guestIDs {
          _id
          accountDetails {
            email
          }
        }
      }
    }
  }
`;

const CheckUserEmailAndCalendar = gql`
  query CheckUserEmailAndCalendar($email: String!) {
    checkUserEmailAndCalendar(email: $email) {
      guestID
      userExists
      hasCalendar
      response {
        message
        status
      }
    }
  }
`;
const getCollectiveAvailability = gql`
  query GetCollectiveAvailability($emails: [String]!, $date: String!, $duration: Int!) {
    getCollectiveAvailability(emails: $emails, date: $date, duration: $duration) {
      availableTimeSlots
      response {
        message
        status
      }
    }
  }
`;

const queries = {getAllGroups, getGroupByID, CheckUserEmailAndCalendar, getCollectiveAvailability};

export default queries;
