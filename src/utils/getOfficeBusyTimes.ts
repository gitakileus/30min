import axios from 'axios';

const getOfficeBusyTimes = async (credential, startTime, endTime) => {
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

  const payload = {
    schedules: [credential.userEmail],
    startTime: {
      dateTime: startTime,
      timeZone: 'UTC',
    },
    endTime: {
      dateTime: endTime,
      timeZone: 'UTC',
    },
    availabilityViewInterval: 60,
  };

  const response = await axios.post(
    'https://graph.microsoft.com/v1.0/me/calendar/getSchedule',
    JSON.stringify(payload),
    {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
    }
  );

  // Format response data
  const busyTimes = response.data.value[0].scheduleItems.map(item => ({
    start: item.start.dateTime,
    end: item.end.dateTime,
  }));

  return busyTimes;
};

export default getOfficeBusyTimes;
