/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';

import Stripe from 'stripe';
import CURRENCY_MAP from 'constants/currencyMap';

const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
  apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const {connectedAccountId, price, currency, isEscrow, meetingCount, percentDonated, bookerEmail} =
    req.body;

  try {
    const totalPrice = price * meetingCount * 100;
    let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;

    if (!isEscrow) {
      paymentIntent = await stripe.paymentIntents.create(
        {
          amount: totalPrice,
          currency: CURRENCY_MAP[currency],
          receipt_email: bookerEmail,
          automatic_payment_methods: {
            enabled: true,
          },
          application_fee_amount: percentDonated
            ? Math.ceil((parseInt(percentDonated, 10) / 100) * totalPrice)
            : 0,
        },
        {stripeAccount: connectedAccountId}
      );
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice,
        receipt_email: bookerEmail,
        currency: CURRENCY_MAP[currency],
        automatic_payment_methods: {
          enabled: true,
        },
      });
    }

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
