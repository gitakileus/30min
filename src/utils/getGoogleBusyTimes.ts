import {google} from 'googleapis';

export default async function getGoogleBusyTimes(credential, startTime, endTime) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  oauth2Client.setCredentials(credential);

  const googleCalendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });

  const googleStartTime = `${startTime}Z`;
  const googleEndTime = `${endTime}Z`;

  const busyTimes = await googleCalendar.freebusy.query({
    requestBody: {
      timeMin: googleStartTime,
      timeMax: googleEndTime,
      items: [
        {
          id: 'primary',
        },
      ],
    },
  });

  return busyTimes;
}
