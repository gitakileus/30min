import axios from 'axios';
import activeExtensionMutations from 'constants/GraphQL/ActiveExtension/mutations';
import graphqlRequestHandler from './graphqlRequestHandler';

const chargeCardHandler = async (priceObject, customerId, session, paymentMethods) => {
  try {
    if (priceObject.product.metadata?.isFree) {
      await graphqlRequestHandler(
        activeExtensionMutations.createActiveExtension,
        {
          activeExtensionData: {
            extensionTitle: priceObject.product.name,
            extensionProductId: priceObject.id,
            paymentMethodId: 'free',
            subscriptionId: 'free',
            customerId: 'free',
            status: 'paid',
          },
          token: session?.accessToken,
        },
        session?.accessToken
      );
      return {
        success: true,
      };
    }

    const {data: chargeResponse} = await axios.post('/api/stripe/chargeCard', {
      customerId,
      priceObject,
    });

    if (!chargeResponse.success) {
      return {success: false, message: chargeResponse.message};
    }

    await graphqlRequestHandler(
      activeExtensionMutations.createActiveExtension,
      {
        activeExtensionData: {
          extensionTitle: priceObject.product.name,
          extensionProductId: priceObject.id,
          paymentMethodId: paymentMethods[0].id,
          subscriptionId: 'one_time',
          customerId,
          status: 'paid',
        },
        token: session?.accessToken,
      },
      session?.accessToken
    );

    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    return {success: false, message: 'Unknown Error'};
  }
};

export default chargeCardHandler;
