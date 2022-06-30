import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';
import bookingMutations from 'constants/GraphQL/Booking/mutations';
import languageCode from 'utils/languageCode';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({req: req});
    if (!session) {
      return res.status(401).json({success: false, message: 'Not authenticated'});
    }
    if (req.method !== 'POST') {
      return res.status(400).json({
        success: false,
        message: 'This endpoint only accepts POST requests!',
      });
    }

    const {meetingDetails, reason} = req.body;

    const {data: userDataResults} = await graphqlRequestHandler(
      queries.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );
    const userID = userDataResults.data.getUserById?.userData?._id;

    // Provider Canceling
    if (userID === meetingDetails.provider) {
      const providerLanguage =
        userDataResults.data.getUserById?.userData?.personalDetails?.language;
      await graphqlRequestHandler(
        bookingMutations.updateBookingStatus,
        {
          statusUpdateData: {
            bookingId: meetingDetails._id,
            providerCanceled: true,
            refundRequested: true,
            reportReason: reason,
          },
        },
        process.env.BACKEND_API_KEY
      );
      await sendEmail(
        {
          clientName: meetingDetails.bookerName,
          bookingId: meetingDetails._id,
          providerName: meetingDetails.providerName || 'Account Deleted',
          reason: reason,
          isPaid: meetingDetails.price > 0,
          [languageCode(providerLanguage)]: true,
        },
        meetingDetails.bookerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.POST_BOOKING.PROVIDER_CANCELED_MEETING
      );
    }

    // Client Canceling
    if (userID === meetingDetails.booker) {
      const bookerLanguage = userDataResults.data.getUserById?.userData?.personalDetails?.language;
      await graphqlRequestHandler(
        bookingMutations.updateBookingStatus,
        {
          statusUpdateData: {
            bookingId: meetingDetails._id,
            clientCanceled: true,
            reportReason: reason,
          },
        },
        process.env.BACKEND_API_KEY
      );
      if (meetingDetails.booker !== null) {
        await sendEmail(
          {
            clientName: meetingDetails.bookerName,
            providerName: meetingDetails.providerName,
            bookingId: meetingDetails._id,
            reason: reason,
            isPaid: meetingDetails.price > 0,
            [languageCode(bookerLanguage)]: true,
          },
          meetingDetails.providerEmail,
          process.env.EMAIL_FROM!,
          TEMPLATES.POST_BOOKING.CLIENT_CANCELED_MEETING
        );
      }
    }
    return res.status(200).json({success: true, message: 'Meeting has been canceled'});
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default handler;
