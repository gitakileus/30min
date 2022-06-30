/* eslint-disable @typescript-eslint/dot-notation */
import axios from 'axios';
import ElementsFormWrapper from 'components/PostLogin/Extensions/ElementsFormWrapper';
import {getSession, useSession} from 'next-auth/react';
import {useState} from 'react';
import Head from 'next/head';

import Layout from 'components/Layout/PostLogin';
import HeaderBar from 'components/PostLogin/Extensions/BillingHeaderBar';
import Stripe from 'stripe';
import {GetServerSideProps} from 'next/types';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userQueries from 'constants/GraphQL/User/queries';
import PaymentMethodCard from 'components/PostLogin/Extensions/PaymentMethodCard';
import useTranslation from 'next-translate/useTranslation';

const Billing = ({paymentMethods}) => {
  const {data: session} = useSession();
  const {t} = useTranslation();

  const [showMethodForm, setShowMethodForm] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [customerId, setCustomerId] = useState('');
  const existingPaymentMethod = paymentMethods.length > 0;

  const getSetupIntent = async () => {
    try {
      const {data: intentResponse} = await axios.post('/api/stripe/createSetupIntent', {
        accessToken: session?.accessToken,
      });

      setClientSecret(intentResponse.clientSecret);
      setCustomerId(intentResponse.customerId);
      setShowMethodForm(true);
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  return (
    <Layout>
      <Head>
        <title>{t('page:Extensions_Billing')}</title>
      </Head>
      <HeaderBar
        getSetupIntent={getSetupIntent}
        showMethodForm={showMethodForm}
        existingPaymentMethod={existingPaymentMethod}
      />
      <div className='mt-10'>
        {!existingPaymentMethod ? (
          <div className='w-full flex justify-center'>
            <button
              onClick={getSetupIntent}
              disabled={showMethodForm}
              className='full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-40'
            >
              {t('common:add_payment_method')}
            </button>
          </div>
        ) : null}
        {showMethodForm ? (
          <ElementsFormWrapper
            secret={clientSecret}
            setShowMethodForm={setShowMethodForm}
            customerId={customerId}
          />
        ) : (
          <div className='grid grid-cols-12 w-full h-full gap-4'>
            {paymentMethods.map((paymentMethod, index) => (
              <PaymentMethodCard paymentMethodData={paymentMethod} key={index} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

Billing.auth = true;
export default Billing;

export const getServerSideProps: GetServerSideProps = async contex => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
      apiVersion: '2020-08-27',
    });

    const session = await getSession(contex);

    const {data: userDataResponse} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      session?.accessToken
    );

    const {userData} = userDataResponse.data.getUserById;
    const customerId = userData?.billingDetails?.customerId;
    let paymentMethods: Stripe.PaymentMethod[] = [];

    if (customerId) {
      const customer = await stripe.customers.retrieve(customerId);
      const defaultPaymentMethod = customer['invoice_settings']['default_payment_method'];

      const methods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      paymentMethods = methods.data.map(method => {
        if (method.id === defaultPaymentMethod) {
          method['isDefault'] = true;
        }
        return method;
      });
    } else {
      paymentMethods = [];
    }

    paymentMethods.sort((methodA, methodB) => {
      if (methodA['isDefault']) {
        return -1;
      }

      if (methodB['isDefault']) {
        return 1;
      }

      return 0;
    });

    return {
      props: {
        paymentMethods,
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
