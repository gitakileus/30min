import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import bookGoogleMeeting from 'utils/bookGoogleMeeting';
import bookOfficeMeeting from 'utils/bookOfficeMeeting';
import bookingEmailHandler from 'utils/bookingEmailHandler';
import createZoomMeeting from 'utils/createZoomMeeting';
import scheduleBookingReminders from 'utils/scheduleBookingReminders';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {userData, bookingData} = req.body;

    const {data: credentialsResponse} = await graphqlRequestHandler(
      integrationQueries.getCredentialsByUserId,
      {
        userId: userData._id,
      },
      process.env.BACKEND_API_KEY
    );

    const credentialResponse = credentialsResponse.data.getCredentialsByUserId;
    const {googleCredentials, officeCredentials, zoomCredentials} = credentialResponse;

    const attendees = [{email: bookingData.bookerEmail, name: bookingData.bookerName}];

    bookingData.ccRecipients.forEach((recipient: any, index: number) => {
      if (recipient) {
        attendees.push({
          email: recipient,
          name: `CC:${index}`,
        });
      }
    });

    const eventData = {
      bookingData: bookingData,
      bookingID: bookingData._id,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      attendees,
    };

    const emailData = {
      body: {
        ...bookingData,
      },
    };

    if (googleCredentials[0]) {
      const googleMeetLink = await bookGoogleMeeting(googleCredentials[0], eventData);

      if (bookingData.conferenceType === 'googleMeet') {
        emailData.body.conferenceLink = googleMeetLink;
      }
    }

    if (officeCredentials[0]) {
      const microsoftMeetingLink = await bookOfficeMeeting(officeCredentials[0], eventData);

      if (microsoftMeetingLink) {
        emailData.body.conferenceLink = microsoftMeetingLink;
      }
    }

    if (bookingData.conferenceType === 'zoom') {
      const zoomMeetingData = await createZoomMeeting(zoomCredentials[0], eventData);
      emailData.body.zoomJoinUrl = zoomMeetingData.join_url;
      emailData.body.zoomStartUrl = zoomMeetingData.start_url;
      emailData.body.zoomPassword = zoomMeetingData.password;
    }

    const providerTimeZone = userData.locationDetails.timezone;

    const reminderPayload = {
      bookingId: bookingData._id,
      bookerLanguage: req.body.bookerLanguage,
      providerLanguage: req.body.providerLanguage,
      providerTimeZone,
      providerId: userData._id,
      ...bookingData,
    };

    await scheduleBookingReminders(reminderPayload);

    await bookingEmailHandler(emailData, providerTimeZone, bookingData._id);
    res.status(200).send({message: 'Booking Confirmed'});
  } catch (err) {
    console.log(err);
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
