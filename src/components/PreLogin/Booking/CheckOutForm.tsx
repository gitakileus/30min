import React, {useRef, useState} from 'react';

import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import Recaptcha from 'react-google-recaptcha';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import dayjs from 'dayjs';
import checkEmailFilter from 'utils/checkEmailFilter';
import {useSession} from 'next-auth/react';
import {PAYMENT_ACCOUNTS} from 'constants/enums';

const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isBetween = require('dayjs/plugin/isBetween');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const CheckOutForm = ({serviceData, user, formPayload, selectedBookerTimezone, clientSecret}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const elements = useElements();
  const [paymentError, setPaymentError] = useState('');
  const [emailError, setEmailError] = useState('');
  const meetingCount = parseInt(formPayload.values.meetingCount as string, 10);
  const stripe = useStripe();
  const {t} = useTranslation();
  const recaptchaRef = useRef<Recaptcha>();
  const {data: session} = useSession();
  const [apiError, setApiError] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();

    setLoading(true);
    setApiError('');
    setPaymentError('');
    setEmailError('');

    try {
      const allowedEmail = await checkEmailFilter(
        formPayload.values.email,
        serviceData?.emailFilter?.type,
        session?.accessToken,
        serviceData?.emailFilter?.emails,
        serviceData?.emailFilter?.domains
      );

      if (!allowedEmail) {
        setApiError('This email has been blocked by the Provider');
        setLoading(false);
        return;
      }
    } catch (err) {
      setApiError('An unknown error occurred');
      setLoading(false);
      return;
    }

    try {
      if (!elements || !stripe) {
        setApiError(t('common:stripe_api_error'));
        setLoading(false);
        return;
      }

      const captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();

      const {data: bookingData} = await axios.post('/api/booking/createPendingBooking', {
        serviceID: serviceData._id,
        chargeID: clientSecret,
        providerUsername: user.accountDetails.username,
        subject: formPayload.values.subject,
        dateBooked: dayjs(formPayload.selectedTime).format(),
        bookerName: formPayload.values.name,
        bookerEmail: formPayload.values.email,
        providerName: user.personalDetails.name,
        providerEmail: user.accountDetails.email,
        bookerPhone: formPayload.values.phone,
        bookerTimeZone: selectedBookerTimezone,
        ccRecipients: formPayload.ccRecipients,
        additionalNotes: formPayload.values.notes,
        meetingCount: parseInt(formPayload.values.meetingCount, 10),
        price: serviceData.price * meetingCount,
        paymentAccount: PAYMENT_ACCOUNTS.STRIPE,
        paymentType: serviceData.paymentType,
        currency: serviceData.currency,
        meetingDate: formPayload.selectedDate,
        paymentStatus: 'PENDING',
        percentDonated: serviceData.percentDonated,
        charity: serviceData.charity,
        title: serviceData.title,
        conferenceType: formPayload.values.conferenceType,
        startTime: formPayload.selectedTime,
        endTime: formPayload.selectedTime.add(serviceData.duration, 'minute'),
        meetingDuration: serviceData.duration,
        captchaToken: captchaToken,
        status: {
          clientConfirmed: false,
          clientCanceled: false,
          providerConfirmed: false,
          providerCanceled: false,
          providerDeclined: false,
          refundRequested: false,
          refunded: false,
          hasOpenReport: false,
          reportReason: '',
          postMeetingNotes: '',
          postMeetingFeedback: '',
        },
      });

      const {error} = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_FRONT_END_URL!}/confirmBooking?bookingId=${
            bookingData.bookingId
          }&providerUsername=${user.accountDetails.username}&serviceTitle=${
            serviceData.title
          }&selectedDate=${formPayload.selectedTime}`,
          receipt_email: formPayload.values.email,
        },
      });

      if (error?.type === 'invalid_request_error') {
        setLoading(false);
        setPaymentError(t('common:processing_error'));
        return;
      }
      if (error) {
        setLoading(false);
        setPaymentError(`${error.message!} ${t('common:check_info_error')}`);
        return;
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        setEmailError(error.response.data.message);
        setLoading(false);
        return;
      }
      setPaymentError(`${t('common:payment_failed')}. ${t('common:check_info_error')}`);
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-wrap justify-center'>
        <form className='flex flex-wrap gap-3 w-full justify-center p-4' onSubmit={handleSubmit}>
          <span className='text-red-500 text-lg'>{paymentError || emailError || apiError}</span>
          <Recaptcha
            ref={recaptchaRef}
            size='invisible'
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
          />
          <div className='flex flex-col justify-center w-full'>
            <PaymentElement />
            <button
              disabled={loading}
              className='bg-mainBlue mt-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm font-bold rounded-md text-white hover:bg-blue-700'
            >
              {loading ? (
                t('common:txt_loading1')
              ) : (
                <>
                  {t('common:txt_Pay')} {serviceData.currency}
                  {serviceData.price * meetingCount}{' '}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckOutForm;
