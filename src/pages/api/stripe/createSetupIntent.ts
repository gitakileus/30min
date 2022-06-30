/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';
import userQueries from 'constants/GraphQL/User/queries';
import userMutations from 'constants/GraphQL/User/mutations';

import Stripe from 'stripe';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';

const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
  apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const {accessToken} = req.body;

  const {data: userDataResponse} = await graphqlRequestHandler(
    userQueries.getUserById,
    {
      token: accessToken,
    },
    accessToken
  );

  const {userData} = userDataResponse.data.getUserById;
  let customerId: string;

  try {
    if (!userData?.billingDetails?.customerId) {
      const customer = await stripe.customers.create({
        email: userData.accountDetails.email,
        name: userData.personalDetails.name,
        address: {
          city: userData?.billingDetails?.city,
          country: userData?.billingDetails?.country,
          line1: userData?.billingDetails?.address,
          line2: userData?.billingDetails?.buildingNumber,
          postal_code: userData?.billingDetails?.zipCode,
        },
      });

      // Attach customerId to User
      await graphqlRequestHandler(
        userMutations.updateUser,
        {
          userData: {
            billingDetails: {
              customerId: customer.id,
            },
          },
          token: accessToken,
        },
        accessToken
      );

      customerId = customer.id;
    } else {
      customerId = userData.billingDetails.customerId;
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: setupIntent.client_secret,
      customerId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
