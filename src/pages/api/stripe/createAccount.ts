/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';

import Stripe from 'stripe';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import stripeQueries from 'constants/GraphQL/StripeAccount/queries';
import stripeMutations from 'constants/GraphQL/StripeAccount/mutations';

const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
  apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const session = await getSession({req: req});

    if (!session) {
      res.status(401).send({message: 'You must be signed in to perform this action.'});
      return;
    }

    const {data: response} = await graphqlRequestHandler(
      stripeQueries.getStripeAccount,
      {},
      session?.accessToken
    );

    if (response?.data?.getStripeAccount?.stripeAccountData) {
      const accountLink = await stripe.accountLinks.create({
        account: response?.data?.getStripeAccount?.stripeAccountData.accountId,
        refresh_url: process.env.STRIPE_RETURN_URL,
        return_url: process.env.STRIPE_REFRESH_URL,
        type: 'account_onboarding',
      });

      res.redirect(307, accountLink.url);
      return;
    }

    const account = await stripe.accounts.create({type: 'standard'});

    const accountId = account?.id;

    await graphqlRequestHandler(
      stripeMutations.createStripeAccount,
      {
        stripeAccountData: {
          accountId,
        },
        token: session?.accessToken,
      },
      session?.accessToken
    );

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: process.env.STRIPE_REFRESH_URL,
      return_url: process.env.STRIPE_RETURN_URL,
      type: 'account_onboarding',
    });

    res.redirect(307, accountLink.url);
  } catch (err) {
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
