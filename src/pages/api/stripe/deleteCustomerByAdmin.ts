/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';

import Stripe from 'stripe';
import userQueries from 'constants/GraphQL/User/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {getSession} from 'next-auth/react';

const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
  apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const session = await getSession({req: req});

  const {customerDocumentId} = req.body;

  try {
    const {data: userDataResponse} = await graphqlRequestHandler(
      userQueries.getUserForAdmin,
      {
        token: session?.accessToken,
        documentId: customerDocumentId,
      },
      session?.accessToken
    );

    const {customerId} = userDataResponse.data.getUserForAdmin.userData.billingDetails;

    if (customerId) {
      await stripe.customers.del(customerId);
      res.status(200).json({message: 'Customer Deleted Successfully'});
      return;
    }

    res.status(200).json({message: 'No CustomerId Found, Returning'});
  } catch (err) {
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
