import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingMutations from 'constants/GraphQL/Booking/mutations';
import queries from 'constants/GraphQL/User/queries';
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

    const {meetingDetails} = req.body;

    await graphqlRequestHandler(
      bookingMutations.updateBookingStatus,
      {
        statusUpdateData: {
          bookingId: meetingDetails._id,
          paymentReleased: true,
        },
      },
      process.env.BACKEND_API_KEY
    );
    const {data: userDataResults} = await graphqlRequestHandler(
      queries.getUserById,
      {
        _id: meetingDetails.provider,
      },
      process.env.BACKEND_API_KEY
    );
    const provideLanguage = userDataResults.data.getUserById?.userData?.personalDetails?.language;

    await sendEmail(
      {
        bookingId: meetingDetails._id,
        currency: meetingDetails.currency,
        totalAmount:
          meetingDetails.price -
          meetingDetails.price * parseInt(process.env.ESCROW_SERVICE_FEE_PERCENT!, 10),
        providerName: meetingDetails.providerName,
        [languageCode(provideLanguage)]: true,
      },
      meetingDetails.providerEmail,
      process.env.EMAIL_FROM!,
      TEMPLATES.POST_BOOKING.PAYMENT_RELEASED
    );

    return res.status(200).json({success: true, message: 'Payment Released'});
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default handler;
