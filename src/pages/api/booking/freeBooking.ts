/* eslint-disable @typescript-eslint/dot-notation */
import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingMutations from 'constants/GraphQL/Booking/mutations';
import domainQueries from 'constants/GraphQL/BlockedDomain/queries';
import userQueries from 'constants/GraphQL/User/queries';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import bookGoogleMeeting from 'utils/bookGoogleMeeting';
import bookOfficeMeeting from 'utils/bookOfficeMeeting';
import bookingEmailHandler from 'utils/bookingEmailHandler';
import createZoomMeeting from 'utils/createZoomMeeting';
import scheduleBookingReminders from 'utils/scheduleBookingReminders';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const bookerEmailDomain = req.body.bookerEmail.split('@')[1];

    const {data: domainResponse} = await graphqlRequestHandler(
      domainQueries.validateDomain,
      {domain: bookerEmailDomain},
      process.env.BACKEND_API_KEY
    );

    if (domainResponse.data.validateDomain.status !== 200) {
      res.status(400).send({message: 'Invalid Email Provided', error: 'Invalid Email Provided'});
      return;
    }

    const validateRecaptcha = async (token: string): Promise<boolean> => {
      const secret = process.env.RECAPTCHA_SECRET_KEY;
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();
      return data.success;
    };

    const human = await validateRecaptcha(req.body.captchaToken);
    if (!human) {
      res.status(400);
      res.json({errors: ['Recaptca validation failed']});
      return;
    }

    const {data: booking} = await graphqlRequestHandler(
      bookingMutations.bookMeeting,
      {
        bookingData: {
          serviceID: req.body.serviceID,
          providerUsername: req.body.providerUsername,
          dateBooked: req.body.dateBooked,
          subject: req.body.subject,
          bookerName: req.body.bookerName,
          bookerEmail: req.body.bookerEmail,
          providerName: req.body.providerName,
          providerEmail: req.body.providerEmail,
          bookerPhone: req.body.bookerPhone,
          bookerTimeZone: req.body.bookerTimeZone,
          ccRecipients: req.body.ccRecipients,
          additionalNotes: req.body.additionalNotes,
          meetingCount: req.body.meetingCount,
          price: req.body.price,
          paymentAccount: req.body.paymentAccount,
          paymentType: req.body.paymentType,
          currency: req.body.currency,
          meetingDate: req.body.meetingDate,
          paymentStatus: req.body.paymentStatus,
          percentDonated: req.body.percentDonated,
          charity: req.body.charity,
          title: req.body.title,
          conferenceType: req.body.conferenceType,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          meetingDuration: req.body.meetingDuration,
          reminders: req.body.reminders,
          captchaToken: req.body.captchaToken,
          status: {
            clientConfirmed: req.body.clientConfirmed,
            clientCanceled: req.body.clientCanceled,
            providerConfirmed: req.body.providerConfirmed,
            providerCanceled: req.body.providerCanceled,
            providerDeclined: req.body.providerDeclined,
            refundRequested: req.body.refundRequested,
            refunded: req.body.refunded,
            hasOpenReport: req.body.hasOpenReport,
            reportReason: req.body.reportReason,
            postMeetingNotes: req.body.postMeetingNotes,
            postMeetingFeedback: req.body.postMeetingFeedback,
          },
        },
      },
      process.env.BACKEND_API_KEY
    );
    // Add events to linked calendars
    const {data: userData} = await graphqlRequestHandler(
      userQueries.getUserByUsername,
      {
        username: req.body.providerUsername,
      },
      process.env.BACKEND_API_KEY
    );

    const providerUserId = userData.data.getUserByUsername.userData._id;

    const {data} = await graphqlRequestHandler(
      integrationQueries.getCredentialsByUserId,
      {
        userId: providerUserId,
      },
      process.env.BACKEND_API_KEY
    );

    const credentialResponse = data.data.getCredentialsByUserId;
    const {googleCredentials, officeCredentials, zoomCredentials} = credentialResponse;

    const attendees = [{email: req.body.bookerEmail, name: req.body.bookerName}];

    req.body.ccRecipients.forEach((recipient: any, index: number) => {
      if (recipient) {
        attendees.push({
          email: recipient,
          name: `CC:${index}`,
        });
      }
    });
    const eventData = {
      bookingData: req.body,
      bookingID: booking.data.bookMeeting.bookingId,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      attendees,
    };

    if (req.body.conferenceType === 'zoom') {
      const zoomMeetingData = await createZoomMeeting(zoomCredentials[0], eventData);
      req.body.zoomJoinUrl = zoomMeetingData.join_url;
      req.body.zoomStartUrl = zoomMeetingData.start_url;
      req.body.zoomPassword = zoomMeetingData.password;

      eventData['zoomJoinUrl'] = zoomMeetingData.join_url;
      eventData['zoomPassword'] = zoomMeetingData.password;
    }

    if (googleCredentials[0]) {
      const googleMeetLink = await bookGoogleMeeting(googleCredentials[0], eventData);

      if (req.body.conferenceType === 'googleMeet') {
        req.body.conferenceLink = googleMeetLink;
        eventData['conferenceLink'] = googleMeetLink;
      }
    }

    if (officeCredentials[0]) {
      const microsoftMeetingLink = await bookOfficeMeeting(officeCredentials[0], eventData);

      if (microsoftMeetingLink) {
        req.body.conferenceLink = microsoftMeetingLink;
      }
    }

    const providerTimeZone = userData.data.getUserByUsername.userData.locationDetails.timezone;

    req.body.providerLanguage = booking.data.bookMeeting.providerLanguage;
    req.body.bookerLanguage = booking.data.bookMeeting.bookerLanguage;

    const reminderPayload = {
      bookingId: booking.data.bookMeeting.bookingId,
      bookerLanguage: req.body.bookerLanguage,
      providerLanguage: req.body.providerLanguage,
      providerTimeZone,
      providerId: providerUserId,
      ...booking.data.bookMeeting,
      ...req.body,
    };

    await scheduleBookingReminders(reminderPayload);

    await bookingEmailHandler(req, providerTimeZone, booking.data.bookMeeting.bookingId);
    res.status(200).send({message: 'Query Successful', booking});
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
