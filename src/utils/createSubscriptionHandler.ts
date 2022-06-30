import axios from 'axios';
import activeExtensionMutations from 'constants/GraphQL/ActiveExtension/mutations';
import graphqlRequestHandler from './graphqlRequestHandler';

const createSubscriptionHandler = async (
  session,
  priceObject,
  customerId,
  stripe,
  paymentMethods
) => {
  try {
    const {data: subscriptionResponse} = await axios.post('/api/stripe/createSubscription', {
      customerId,
      accessToken: session?.accessToken,
      priceId: priceObject.id,
    });

    const data = await stripe?.confirmCardPayment(subscriptionResponse.clientSecret, {
      receipt_email: session?.user?.email!,
      payment_method: paymentMethods[0].id,
    });

    if (data?.error?.message) {
      throw new Error(data.error.message);
    }

    await graphqlRequestHandler(
      activeExtensionMutations.createActiveExtension,
      {
        activeExtensionData: {
          extensionTitle: priceObject.product.name,
          extensionProductId: priceObject.id,
          paymentMethodId: paymentMethods[0].id,
          subscriptionId: subscriptionResponse.subscriptionId,
          customerId,
          status: 'paid',
        },
        token: session?.accessToken,
      },
      session?.accessToken
    );
    return {success: true};
  } catch (err) {
    if (err?.type) {
      switch (err.type) {
        case 'StripeCardError':
          return {success: false, message: err.message};
        case 'StripeRateLimitError':
          return {success: false, message: 'API Overflow, please try again'};
        case 'StripeInvalidRequestError':
          return {success: false, message: 'Invalid Input, please try again'};
        case 'StripeAPIError':
          return {success: false, message: 'Internal Stripe Error, please try again'};
        case 'StripeConnectionError':
          return {success: false, message: 'Connection Error, please try again'};
        case 'StripeAuthenticationError':
          return {
            success: false,
            message: 'Server Misconfiguration, please contact 30mins Support',
          };
        default:
          return {success: false, message: 'Unknown Error'};
      }
    }
    return {success: false, message: 'Unknown Error'};
  }
};

export default createSubscriptionHandler;
