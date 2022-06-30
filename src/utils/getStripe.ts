import {Stripe, loadStripe} from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = (connectedAccountId?: string) => {
  if (!stripePromise) {
    if (connectedAccountId) {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID_TEST!, {
        stripeAccount: connectedAccountId,
      });
    } else {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID_TEST!);
    }
  }
  return stripePromise;
};

export default getStripe;
