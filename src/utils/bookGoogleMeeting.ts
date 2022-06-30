/* eslint-disable @typescript-eslint/dot-notation */
import cuid from 'cuid';
import {google} from 'googleapis';

export default async function bookGoogleMeeting(credential, eventData) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    oauth2Client.setCredentials(credential.credentials);

    const googleCalendar = google.calendar({
      version: 'v3',
      auth: oauth2Client,
    });

    const {bookingData, bookingID, startTime, endTime, attendees} = eventData;
    const {
      bookerName,
      bookerEmail,
      providerName,
      providerEmail,
      title,
      price,
      subject,
      currency,
      charity,
      meetingCount,
      conferenceType,
      additionalNotes,
      zoomJoinUrl,
      zoomPassword,
    } = bookingData;

    const descriptionData = `
      <p>Meeting Title: ${title}</p>
      <p>Client Name: ${bookerName}</p>
      <p>Client Email: ${bookerEmail}</p>
      <p>Organizer Name: ${providerName}</p>
      <p>Organizer Email: ${providerEmail}</p>
      <p>Meeting Count: ${meetingCount}</p>
      <p>Meeting Type: ${conferenceType}</p>
      <p>${zoomJoinUrl ? `Zoom Join Url: ${zoomJoinUrl}</p>` : ''}\n
      <p>${zoomPassword ? `Zoom Password: ${zoomPassword}</p>` : ''}\n
      <p>${charity ? `Charity: ${charity}</p>` : ''}\n
      ${price > 0 ? `Total Price: ${currency}${price}` : ''}\n
      <p>Additional Notes: ${additionalNotes}</p>
      <p>After your meeting, be sure to mark the Meeting as Complete<br>
      You can view/manage your meeting here: <a href="https://30mins.com/user/meetingDetails/${bookingID}">https://30mins.com/user/meetingDetails/${bookingID}</a></p>
    `;

    const eventPayload = {
      calendarId: 'primary',
      requestBody: {
        summary: subject,
        description: descriptionData,
        start: {
          dateTime: startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: endTime,
          timeZone: 'UTC',
        },
        attendees,
      },
    };

    if (meetingCount > 1) {
      eventPayload.requestBody['recurrence'] = [`RRULE:FREQ=WEEKLY;COUNT=${meetingCount}`];
    }

    // Generate and Attach Google Meet Link
    if (conferenceType === 'googleMeet') {
      eventPayload.requestBody['conferenceData'] = {
        createRequest: {
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
          requestId: cuid(),
        },
      };

      eventPayload['conferenceDataVersion'] = 1;
    }

    const event = await googleCalendar.events.insert(eventPayload);

    return event.data.hangoutLink;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
