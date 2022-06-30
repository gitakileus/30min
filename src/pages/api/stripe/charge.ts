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

  const {amount, id, currency, email} = req.body;
  const actualAmount = amount * 100;

  const actualCurrency = cur => {
    if (cur === '$') {
      return 'usd';
    }
    if (cur === '£') {
      return 'gbp';
    }
    if (cur === '₹') {
      return 'inr';
    }
    if (cur === '€') {
      return 'eur';
    }

    return currency.toLowercase();
  };

  try {
    const params: Stripe.PaymentIntentCreateParams = {
      amount: actualAmount,
      currency: actualCurrency(currency),
      description: '30mins.com charges',
      payment_method: id,
      receipt_email: email,
      confirm: true,
    };
    const PAYMENT_INTENT: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);
    res.status(200).json(PAYMENT_INTENT);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({statusCode: 500, message: errorMessage});
  }
}
