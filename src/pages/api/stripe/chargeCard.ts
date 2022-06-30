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

  const {customerId, priceObject} = req.body;

  try {
    const customer = await stripe.customers.retrieve(customerId);

    const paymentMethod = customer['invoice_settings']['default_payment_method'];

    await stripe.paymentIntents.create({
      description: priceObject.product.name,
      amount: priceObject.unit_amount!,
      currency: priceObject.currency,
      customer: customerId,
      payment_method: paymentMethod,
      off_session: true,
      confirm: true,
    });

    res.status(200).json({
      success: true,
      message: 'Transaction processed successfully.',
    });
  } catch (err) {
    console.log(err);
    if (err?.type) {
      switch (err.type) {
        case 'StripeCardError':
          res.status(500).json({success: false, message: err.message});
          break;
        case 'StripeRateLimitError':
          res.status(500).json({success: false, message: 'API Overflow, please try again'});
          break;
        case 'StripeInvalidRequestError':
          res.status(500).json({success: false, message: 'Invalid Input, please try again'});
          break;
        case 'StripeAPIError':
          res
            .status(500)
            .json({success: false, message: 'Internal Stripe Error, please try again'});
          break;
        case 'StripeConnectionError':
          res.status(500).json({success: false, message: 'Connection Error, please try again'});
          break;
        case 'StripeAuthenticationError':
          res.status(500).json({
            success: false,
            message: 'Server Misconfiguration, please contact 30mins Support',
          });
          break;
        default:
          res.status(500).json({success: false, message: 'Unknown Error'});
          break;
      }
    } else {
      res.status(500).json({success: false, message: 'Unknown Error'});
    }
  }
}
