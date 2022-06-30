/* eslint-disable @typescript-eslint/dot-notation */
import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/react';
import Stripe from 'stripe';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';

import userQueries from 'constants/GraphQL/User/queries';
import {Elements} from '@stripe/react-stripe-js';
import ExtensionsContainer from 'components/PostLogin/Extensions/ExtensionsContainer';
import getStripe from 'utils/getStripe';
import Layout from 'components/Layout/PostLogin';
import IndexHeaderBar from 'components/PostLogin/Extensions/IndexHeaderBar';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

const Extensions = ({
  prices,
  paymentMethods,
  customerId,
  hasCustomerId,
  hasPaymentMethod,
  activeExtensions,
}) => {
  const {t} = useTranslation();
  return (
    <>
      <Head>
        <title>{t('page:Extensions')}</title>
      </Head>
      <Layout>
        <IndexHeaderBar />
        <Elements stripe={getStripe()}>
          <ExtensionsContainer
            customerId={customerId}
            activeExtensions={activeExtensions}
            paymentMethods={paymentMethods}
            prices={prices}
            hasPaymentMethod={hasPaymentMethod}
            hasCustomerId={hasCustomerId}
          />
        </Elements>
      </Layout>
    </>
  );
};

Extensions.auth = true;
export default Extensions;

export const getServerSideProps: GetServerSideProps = async contex => {
  try {
    const session = await getSession(contex);
    const router = contex.resolvedUrl;

    if (!session) {
      return {
        redirect: {
          destination: `/auth/login?url=${router}`,
          permanent: false,
        },
      };
    }
    const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
      apiVersion: '2020-08-27',
    });

    const {data: userDataResponse} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      session?.accessToken
    );

    const {userData} = userDataResponse.data.getUserById;
    const customerId = userData?.billingDetails?.customerId || '';
    const hasCustomerId = customerId ? true : false;
    let hasPaymentMethod: boolean = false;

    let paymentMethods: Stripe.PaymentMethod[] = [];
    let activeExtensions: String[] = [];

    if (customerId) {
      const customer = await stripe.customers.retrieve(customerId);
      const defaultPaymentMethod = customer['invoice_settings']['default_payment_method'];

      const methods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      if (methods.data.length !== 0) {
        hasPaymentMethod = true;

        paymentMethods = methods.data.map(method => {
          if (method.id === defaultPaymentMethod) {
            method['isDefault'] = true;
          }
          return method;
        });

        paymentMethods.sort((methodA, methodB) => {
          if (methodA['isDefault']) {
            return -1;
          }

          if (methodB['isDefault']) {
            return 1;
          }

          return 0;
        });
      }
    }

    activeExtensions = userData?.accountDetails?.activeExtensions || [];
    const pricesResponse = await stripe.prices.list({
      expand: ['data.product'],
      active: true,
      limit: 100,
    });

    return {
      props: {
        prices: pricesResponse.data,
        userData,
        paymentMethods,
        customerId,
        hasCustomerId,
        hasPaymentMethod,
        activeExtensions,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: `/?error=Internal Server Error`,
        permanent: false,
      },
    };
  }
};
