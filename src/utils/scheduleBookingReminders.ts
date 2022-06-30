import agendaJobsMutations from 'constants/GraphQL/AgendaJobs/mutations';
import dayjs from 'dayjs';
import graphqlRequestHandler from './graphqlRequestHandler';

export default async function scheduleBookingReminders(bookingData: any) {
  const {
    startTime,
    bookingId,
    bookerName,
    bookerEmail,
    bookerTimeZone,
    bookerLanguage,
    providerTimeZone,
    providerName,
    providerEmail,
    providerLanguage,
    bookerPhone,
    additionalNotes,
    meetingCount,
    price,
    currency,
    paymentType,
    meetingDate,
    percentDonated,
    charity,
    conferenceType,
    conferenceLink,
    zoomJoinUrl,
    zoomStartUrl,
    zoomPassword,
    endTime,
    meetingDuration,
    ccRecipients,
    providerId,
  } = bookingData;

  const mutationPayload = {
    bookingId,
    bookerName,
    bookerEmail,
    bookerTimeZone,
    bookerLanguage,
    providerTimeZone,
    providerName,
    providerEmail,
    providerLanguage,
    bookerPhone,
    additionalNotes,
    meetingCount,
    price,
    currency,
    paymentType,
    meetingDate,
    percentDonated,
    charity,
    conferenceType,
    conferenceLink,
    zoomJoinUrl,
    zoomStartUrl,
    zoomPassword,
    startTime,
    endTime,
    meetingDuration,
    ccRecipients,
    providerId,
  };

  const reminder15minTime = dayjs(startTime).subtract(15, 'minute').toDate();

  await graphqlRequestHandler(
    agendaJobsMutations.scheduleAgendaJob,
    {
      agendaJobData: {
        jobName: 'send15MinReminder',
        scheduledDate: reminder15minTime,
        jobData: mutationPayload,
      },
    },
    process.env.BACKEND_API_KEY
  );

  if (dayjs(startTime).diff(dayjs(), 'hour') >= 24) {
    const reminder24HrTime = dayjs(startTime).subtract(1, 'day').toDate();
    await graphqlRequestHandler(
      agendaJobsMutations.scheduleAgendaJob,
      {
        agendaJobData: {
          jobName: 'send24HrReminder',
          scheduledDate: reminder24HrTime,
          jobData: mutationPayload,
        },
      },
      process.env.BACKEND_API_KEY
    );
  }
}
