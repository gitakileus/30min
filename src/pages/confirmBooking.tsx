import bookingMutations from 'constants/GraphQL/Booking/mutations';
import Confirmation from 'components/PreLogin/Booking/Confirmation';
import {GetServerSideProps} from 'next/types';
import React from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import axios from 'axios';
import Stripe from 'stripe';
import useTranslation from 'next-translate/useTranslation';

const ConfirmBooking = ({providerUser, serviceData, selectedDate, error, paymentInvoice}) => {
  const {t} = useTranslation();

  if (error) {
    return (
      <div className='justify-items-center px-10 py-10 bg-white rounded-b-lg shadow-2xl text-red-500'>
        {t(error)}
      </div>
    );
  }
  return (
    <div className='py-4 px-6'>
      <Confirmation
        user={providerUser}
        serviceData={serviceData}
        selectedDate={selectedDate}
        paymentInvoice={paymentInvoice}
      />
    </div>
  );
};

export default ConfirmBooking;

export const getServerSideProps: GetServerSideProps = async context => {
  if (!context?.query?.payment_intent || !context.query.payment_intent_client_secret) {
    return {
      notFound: true,
    };
  }

  try {
    const {data: bookingDataResponse} = await graphqlRequestHandler(
      bookingMutations.confirmMeeting,
      {
        documentId: context.query.bookingId,
        chargeID: context.query.payment_intent_client_secret,
      },
      process.env.BACKEND_API_KEY
    );

    const {bookingData, serviceData, providerUser, response} =
      bookingDataResponse.data.confirmMeeting;

    if (response.status === 404) {
      return {
        props: {
          error: 'common:booking_not_found',
        },
      };
    }

    const stripe =
      bookingData.paymentType === 'direct'
        ? new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
            apiVersion: '2020-08-27',
            stripeAccount: providerUser.accountDetails.stripeAccountId,
          })
        : new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
            apiVersion: '2020-08-27',
          });

    const intentResponse = await stripe.paymentIntents.retrieve(
      context.query.payment_intent.toString()
    );

    if (intentResponse.status !== 'succeeded') {
      return {
        props: {
          error: 'common:unsuccessful_payment',
        },
      };
    }

    console.log(bookingData);
    if (bookingData.confirmed !== true) {
      await axios.post(`${process.env.FRONT_END_URL}/api/booking/confirm`, {
        bookingData,
        userData: providerUser,
      });
    }

    const safeProviderData = {
      accountDetails: {
        username: providerUser.accountDetails.username,
      },
      personalDetails: {
        name: providerUser.personalDetails.name,
      },
    };

    return {
      props: {
        providerUser: safeProviderData,
        serviceData,
        selectedDate: bookingData.startTime,
        paymentInvoice: intentResponse.charges.data[0].receipt_url,
      },
    };
  } catch (err) {
    return {
      props: {
        error: 'common:unsuccessful_payment',
      },
    };
  }
};
