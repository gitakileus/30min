import axios from 'axios';
import dayjs from 'dayjs';

export default async function bookOfficeMeeting(credential, eventData) {
  try {
    const params = {
      scope: 'User.Read Calendars.Read Calendars.ReadWrite',
      client_id: process.env.MS_GRAPH_CLIENT_ID!,
      refresh_token: credential.credentials.refresh_token,
      grant_type: 'refresh_token',
      client_secret: process.env.MS_GRAPH_CLIENT_SECRET!,
    };

    const {data: tokenData} = await axios.post(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      new URLSearchParams(params),
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    );

    const accessToken = tokenData.access_token;

    const {bookingData, bookingID, startTime, endTime, attendees} = eventData;

    const convertedAttendees = attendees.map(attendee => ({
      emailAddress: {
        address: attendee.email,
        name: attendee.name,
      },
    }));
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
      conferenceLink,
    } = bookingData;

    const descriptionData = `
      <p>Meeting Title: ${title}</p>
      <p>Client Name: ${bookerName}</p>
      <p>Client Email: ${bookerEmail}</p>
      <p>Organizer Name: ${providerName}</p>
      <p>Organizer Email: ${providerEmail}</p>
      <p>Meeting Count: ${meetingCount}</p>
      <p>Meeting Type: ${conferenceType}</p>
      <p>${conferenceLink ? `Conference Link: ${conferenceLink}</p>` : ''}\n
      <p>${zoomJoinUrl ? `Zoom Join Url: ${zoomJoinUrl}</p>` : ''}\n
      <p>${zoomPassword ? `Zoom Password: ${zoomPassword}</p>` : ''}\n
      <p>${charity ? `Charity: ${charity}</p>` : ''}\n
      ${price > 0 ? `Total Price: ${currency}${price}` : ''}\n
      <p>Additional Notes: ${additionalNotes}</p>
      <p>After your meeting, be sure to mark the Meeting as Complete<br>
      You can view/manage your meeting here: <a href="https://30mins.com/user/meetingDetails/${bookingID}">https://30mins.com/user/meetingDetails/${bookingID}</a></p>
    `;

    const shouldGenerateLink = [
      'skypeForBusiness',
      'skypeForConsumer',
      'teamsForBusiness',
    ].includes(conferenceType);

    const eventPayload = {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: descriptionData,
      },
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
      attendees: convertedAttendees,
      recurrence: {
        pattern: {},
        range: {},
      },
      allowNewTimeProposals: true,
      isOnlineMeeting: shouldGenerateLink,
    };

    if (shouldGenerateLink) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      eventPayload['onlineMeetingProvider'] = conferenceType;
    }

    const dayIndex = dayjs(startTime).day();
    let dayOfWeekString = '';
    switch (dayIndex) {
      case 0:
        dayOfWeekString = 'Sunday';
        break;
      case 1:
        dayOfWeekString = 'Monday';
        break;
      case 2:
        dayOfWeekString = 'Tuesday';
        break;
      case 3:
        dayOfWeekString = 'Wednesday';
        break;
      case 4:
        dayOfWeekString = 'Thursday';
        break;
      case 5:
        dayOfWeekString = 'Friday';
        break;
      case 6:
        dayOfWeekString = 'Saturday';
        break;
      default:
        dayOfWeekString = '';
    }

    const officeDate = new Date(startTime).toISOString().split('T')[0];

    eventPayload.recurrence.pattern = {
      type: 'weekly',
      interval: 1,
      daysOfWeek: [dayOfWeekString],
    };

    eventPayload.recurrence.range = {
      type: 'numbered',
      startDate: officeDate,
      numberOfOccurrences: meetingCount,
    };

    const response = await axios.post(
      'https://graph.microsoft.com/v1.0/me/calendar/events',
      JSON.stringify(eventPayload),
      {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response?.data?.onlineMeeting?.joinUrl) {
      return response.data.onlineMeeting.joinUrl;
    }

    return '';
  } catch (err) {
    console.log(err);
    throw err;
  }
}
