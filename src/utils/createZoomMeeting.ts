/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import cuid from 'cuid';

export default async function createZoomMeeting(credential, eventData) {
  try {
    const {data: zoomTokenResponse} = await axios('https://zoom.us/oauth/token', {
      method: 'POST',
      params: {
        refresh_token: credential.credentials.refresh_token,
        grant_type: 'refresh_token',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const zoomToken = zoomTokenResponse.access_token;

    const {data: zoomUserResponse} = await axios('https://zoom.us/v2/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${zoomToken}`,
        'Content-Type': 'application/json',
      },
    });

    const {bookingData, startTime} = eventData;
    const {subject, meetingDuration, meetingCount} = bookingData;

    let zoomMeetingData = {
      start_url: '',
      join_url: '',
      password: '',
    };

    if (meetingCount > 1) {
      const {data: zoomMeetingResponse} = await axios('https://zoom.us/v2/users/me/meetings', {
        method: 'POST',
        data: {
          agenda: subject,
          duration: meetingDuration,
          password: cuid.slug(),
          schedule_for: zoomUserResponse.id,
          recurrence: {
            end_times: meetingCount,
            type: 2,
          },
          start_time: startTime,
          type: 8,
        },
        headers: {
          Authorization: `Bearer ${zoomToken}`,
          'Content-Type': 'application/json',
        },
      });

      const {start_url, join_url, password} = zoomMeetingResponse;

      zoomMeetingData = {
        start_url,
        join_url,
        password,
      };
    } else {
      const {data: zoomMeetingResponse} = await axios('https://zoom.us/v2/users/me/meetings', {
        method: 'POST',
        data: {
          agenda: subject,
          duration: meetingDuration,
          password: cuid.slug(),
          schedule_for: zoomUserResponse.id,
          start_time: startTime,
          type: 2,
        },
        headers: {
          Authorization: `Bearer ${zoomToken}`,
          'Content-Type': 'application/json',
        },
      });

      const {start_url, join_url, password} = zoomMeetingResponse;

      zoomMeetingData = {
        start_url,
        join_url,
        password,
      };
    }

    return zoomMeetingData;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
