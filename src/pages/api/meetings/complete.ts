import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingMutations from 'constants/GraphQL/Booking/mutations';

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

    const {meetingDetails, notes} = req.body;

    await graphqlRequestHandler(
      bookingMutations.updateBookingStatus,
      {
        statusUpdateData: {
          bookingId: meetingDetails._id,
          providerConfirmed: true,
          postMeetingNotes: notes,
        },
      },
      process.env.BACKEND_API_KEY
    );

    await sendEmail(
      {
        clientName: meetingDetails.bookerName,
        bookingId: meetingDetails._id,
        providerName: meetingDetails.providerName || 'Account Deleted',
        postMeetingNotes: notes,
        isPaid: meetingDetails.price > 0,
      },
      meetingDetails.bookerEmail,
      process.env.EMAIL_FROM!,
      TEMPLATES.POST_BOOKING.PROVIDER_COMPLETED_MEETING
    );

    return res.status(200).json({success: true, message: 'Meeting has been canceled'});
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default handler;
