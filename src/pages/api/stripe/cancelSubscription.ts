/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';

import Stripe from 'stripe';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import activeExtensionsQueries from 'constants/GraphQL/ActiveExtension/queries';
import activeExtensionsMutations from 'constants/GraphQL/ActiveExtension/mutations';
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
  const {productId} = req.body;

  try {
    const {data: extensionDataResponse} = await graphqlRequestHandler(
      activeExtensionsQueries.getActiveExtensionByProductId,
      {
        token: session?.accessToken,
        productId,
      },
      session?.accessToken
    );

    const {subscriptionId, _id: documentId} =
      extensionDataResponse.data.getActiveExtensionByProductId.activeExtensionData;

    await stripe.subscriptions.del(subscriptionId);

    await graphqlRequestHandler(
      activeExtensionsMutations.deleteActiveExtension,
      {
        token: session?.accessToken,
        documentId,
      },
      session?.accessToken
    );

    res.status(200).json({message: 'Canceled Subscription Successfully'});
  } catch (err) {
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
