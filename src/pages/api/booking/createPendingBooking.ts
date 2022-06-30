import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingMutations from 'constants/GraphQL/Booking/mutations';
import domainQueries from 'constants/GraphQL/BlockedDomain/queries';

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
      bookingMutations.createPendingMeeting,
      {
        bookingData: {
          chargeID: req.body.chargeID,
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

    res.status(200).send({
      message: 'Booking Successful',
      bookingId: booking.data.createPendingMeeting.bookingId,
    });
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
