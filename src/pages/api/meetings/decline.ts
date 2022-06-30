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
      res.status(401).json({success: false, message: 'Not authenticated'});
      return;
    }
    if (req.method !== 'POST') {
      res.status(400).json({
        success: false,
        message: 'This endpoint only accepts POST requests!',
      });
      return;
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

    if (userID !== meetingDetails.provider) {
      res.status(401).json({
        success: false,
        message: 'Not Authorized!',
      });
      return;
    }

    // Provider Declining
    const providerLanguage = userDataResults.data.getUserById?.userData?.personalDetails?.language;
    await graphqlRequestHandler(
      bookingMutations.updateBookingStatus,
      {
        statusUpdateData: {
          bookingId: meetingDetails._id,
          providerDeclined: true,
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
      TEMPLATES.POST_BOOKING.PROVIDER_DECLINED_MEETING
    );

    res.status(200).json({success: true, message: 'Meeting has been declined'});
  } catch (error) {
    res.status(400).json({message: error});
  }
};

export default handler;
