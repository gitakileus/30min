import languageCode from 'utils/languageCode';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import TEMPLATES from '../constants/emailTemplateIDs';
import sendEmailHandler from './sendEmailHandler';

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function sendBookingEmails(req, providerTimeZone, bookId) {
  try {
    const {
      conferenceLink,
      zoomJoinUrl,
      zoomStartUrl,
      zoomPassword,
      providerLanguage,
      bookerLanguage,
    } = req.body;

    if (req.body.price > 0) {
      // TO  PAID CC
      req.body.ccRecipients.forEach(async ccEmail => {
        if (ccEmail && ccEmail !== '') {
          await sendEmailHandler(
            {
              subject: req.body.subject,
              clientName: req.body.bookerName,
              ccName: ccEmail,
              isCC: true,
              providerName: req.body.providerName,
              meetingType: req.body.translatedType || req.body.conferenceType,
              conferenceLink,
              zoomJoinUrl,
              zoomPassword,
              meetingDate: dayjs(req.body.meetingDate)
                .tz(req.body.bookerTimeZone)
                .format('dddd DD MMMM YYYY'),
              clientEmail: req.body.bookerEmail,
              meetingTime: dayjs(req.body.startTime).tz(req.body.bookerTimeZone).format('hh:mm A'),
              meetingCount: req.body.meetingCount,
              meetingDuration: req.body.meetingDuration,
              clientPhone: req.body.bookerPhone,
              currency: req.body.currency,
              totalAmount: req.body.price,
              isPaid: true,
              timeZone: req.body.bookerTimeZone,
              bookingId: bookId,
              additionalNotes: req.body.additionalNotes,
              [languageCode(bookerLanguage)]: true,
            },
            ccEmail,
            process.env.EMAIL_FROM!,
            TEMPLATES.BOOKING.TO_CLIENT
          );
        }
      });

      // To  PAID Client
      await sendEmailHandler(
        {
          subject: req.body.subject,
          clientName: req.body.bookerName,
          providerName: req.body.providerName,
          meetingType: req.body.translatedType || req.body.conferenceType,
          conferenceLink,
          zoomJoinUrl,
          zoomPassword,
          meetingDate: dayjs(req.body.meetingDate)
            .tz(req.body.bookerTimeZone)
            .format('dddd DD MMMM YYYY'),
          clientEmail: req.body.bookerEmail,
          meetingTime: dayjs(req.body.startTime).tz(req.body.bookerTimeZone).format('hh:mm A'),
          meetingCount: req.body.meetingCount,
          meetingDuration: req.body.meetingDuration,
          clientPhone: req.body.bookerPhone,
          currency: req.body.currency,
          totalAmount: req.body.price,
          isPaid: true,
          timeZone: req.body.bookerTimeZone,
          bookingId: bookId,
          additionalNotes: req.body.additionalNotes,
          [languageCode(bookerLanguage)]: true,
        },
        req.body.bookerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.TO_CLIENT
      );

      // To PAID Provider
      await sendEmailHandler(
        {
          subject: req.body.subject,
          clientName: req.body.bookerName,
          clientEmail: req.body.bookerEmail,
          clientPhone: req.body.bookerPhone,
          ccList: req.body.ccRecipients ? req.body.ccRecipients.join(', ') : '',
          providerName: req.body.providerName,
          meetingType: req.body.translatedType || req.body.conferenceType,
          conferenceLink,
          zoomJoinUrl,
          zoomPassword,
          zoomStartUrl,
          meetingDate: dayjs(req.body.meetingDate).tz(providerTimeZone).format('dddd DD MMMM YYYY'),
          meetingTime: dayjs(req.body.startTime).tz(providerTimeZone).format('hh:mm A'),
          meetingCount: req.body.meetingCount,
          meetingDuration: req.body.meetingDuration,
          currency: req.body.currency,
          totalAmount: req.body.price,
          isPaid: true,
          timeZone: req.body.bookerTimeZone,
          additionalNotes: req.body.additionalNotes,
          bookingId: bookId,
          [languageCode(providerLanguage)]: true,
        },
        req.body.providerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.TO_PROVIDER
      );
    }

    if (req.body.price === 0) {
      // TO FREE CC
      req.body.ccRecipients.forEach(async ccEmail => {
        if (ccEmail && ccEmail !== '') {
          await sendEmailHandler(
            {
              subject: req.body.subject,
              clientName: req.body.bookerName,
              ccName: ccEmail,
              isCC: true,
              providerName: req.body.providerName,
              meetingType: req.body.translatedType || req.body.conferenceType,
              conferenceLink,
              zoomJoinUrl,
              zoomPassword,
              meetingDate: dayjs(req.body.meetingDate)
                .tz(req.body.bookerTimeZone)
                .format('dddd DD MMMM YYYY'),
              clientEmail: req.body.bookerEmail,
              meetingTime: dayjs(req.body.startTime).tz(req.body.bookerTimeZone).format('hh:mm A'),
              meetingCount: req.body.meetingCount,
              meetingDuration: req.body.meetingDuration,
              clientPhone: req.body.bookerPhone,
              currency: req.body.currency,
              totalAmount: req.body.price,
              isPaid: false,
              timeZone: req.body.bookerTimeZone,
              bookingId: bookId,
              additionalNotes: req.body.additionalNotes,
              [languageCode(bookerLanguage)]: true,
            },
            ccEmail,
            process.env.EMAIL_FROM!,
            TEMPLATES.BOOKING.TO_CLIENT
          );
        }
      });
      // To FREE Client
      await sendEmailHandler(
        {
          subject: req.body.subject,
          clientName: req.body.bookerName,
          clientEmail: req.body.bookerEmail,
          providerName: req.body.providerName,
          meetingType: req.body.translatedType || req.body.conferenceType,
          conferenceLink,
          zoomJoinUrl,
          zoomPassword,
          clientPhone: req.body.bookerPhone,
          meetingDate: dayjs(req.body.meetingDate)
            .tz(req.body.bookerTimeZone)
            .format('dddd DD MMMM YYYY'),
          meetingTime: dayjs(req.body.startTime).tz(req.body.bookerTimeZone).format('hh:mm A'),
          meetingCount: req.body.meetingCount,
          meetingDuration: req.body.meetingDuration,
          currency: req.body.currency,
          totalAmount: req.body.price,
          timeZone: req.body.bookerTimeZone,
          bookingId: bookId,
          isPaid: false,
          additionalNotes: req.body.additionalNotes,
          [languageCode(bookerLanguage)]: true,
        },
        req.body.bookerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.TO_CLIENT
      );

      // To FREE Provider
      await sendEmailHandler(
        {
          subject: req.body.subject,
          clientName: req.body.bookerName,
          clientEmail: req.body.bookerEmail,
          providerName: req.body.providerName,
          ccList: req.body.ccRecipients ? req.body.ccRecipients.join(', ') : '',
          meetingType: req.body.translatedType || req.body.conferenceType,
          conferenceLink,
          zoomJoinUrl,
          zoomPassword,
          zoomStartUrl,
          meetingDate: dayjs(req.body.meetingDate).tz(providerTimeZone).format('dddd DD MMMM YYYY'),
          meetingTime: dayjs(req.body.startTime).tz(providerTimeZone).format('hh:mm A'),
          meetingCount: req.body.meetingCount,
          meetingDuration: req.body.meetingDuration,
          currency: req.body.currency,
          totalAmount: req.body.price,
          timeZone: req.body.bookerTimeZone,
          bookingId: bookId,
          clientPhone: req.body.bookerPhone,
          additionalNotes: req.body.additionalNotes,
          isPaid: false,
          [languageCode(providerLanguage)]: true,
        },
        req.body.providerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.TO_PROVIDER
      );
    }
  } catch (err) {
    console.log('error');
    throw err;
  }
}
