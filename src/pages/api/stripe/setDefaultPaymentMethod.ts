/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
  apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const {customerId, paymentMethodId} = req.body;

  try {
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    res.status(200).json({message: 'Set Payment Default Successfully'});
  } catch (err) {
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
