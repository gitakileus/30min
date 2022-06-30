import {BOOKING_STATE, BOOKING_YUP} from 'constants/yup/booking';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import DropDownComponent from 'components/shared/DropDownComponent';
import Recaptcha from 'react-google-recaptcha';
import checkEmailFilter from 'utils/checkEmailFilter';
import {useSession} from 'next-auth/react';
import validateProviderReceivingCapabilities from 'utils/validatePaidBookingStatus';
import {PAYMENT_TYPE} from 'constants/enums';
import CheckoutWrapper from './CheckoutWrapper';

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isBetween = require('dayjs/plugin/isBetween');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const BookingForm = ({
  user,
  serviceData,
  selectedDate,
  selectedTime,
  setConfirmBooking,
  selectedBookerTimezone,
}) => {
  const {t} = useTranslation();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [currentUrl, setCurrentURL] = useState('');
  const [emailError, setEmailError] = useState('');
  const recaptchaRef = useRef<Recaptcha>();
  const [apiError, setApiError] = useState('');
  const {data: session} = useSession();

  useEffect(() => {
    setCurrentURL(window.location.href);
  }, []);

  const selectConferenceType = serviceData?.conferenceType.map(type => ({
    key: t(`event:${type}`),
    value: type,
  }));

  const baseOption = [
    {
      key: 'Select',
      value: '',
    },
  ];

  const options = baseOption.concat(selectConferenceType);

  const [formPayload, setFormPayload] = useState({
    values: {},
    selectedDate: '',
    selectedTime: '',
    ccRecipients: [],
  });

  const meetingCount = [
    {key: 1, value: 1},
    {key: 2, value: 2},
    {key: 3, value: 3},
    {key: 4, value: 4},
  ];

  const SelectMeetingCount = meetingCount.map(count => (
    <option key={count.key}>{count.value}</option>
  ));

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);
    setApiError('');
    try {
      const allowedEmail = await checkEmailFilter(
        values.email,
        serviceData?.emailFilter?.type,
        session?.accessToken,
        serviceData?.emailFilter?.emails,
        serviceData?.emailFilter?.domains
      );

      if (!allowedEmail) {
        setApiError(t('common:email_blocked'));
        setSubmitting(false);
        return;
      }
    } catch (err) {
      setApiError(t('common:general_api_error'));
      setSubmitting(false);
      return;
    }

    const ccRecipients = values.ccRecipients.replaceAll(' ', '').split(';');

    const translatedType = t(`event:${values.conferenceType}`);
    setFormPayload({
      values: values,
      selectedDate: dayjs(selectedDate),
      selectedTime: dayjs(selectedTime),
      ccRecipients: ccRecipients,
    });

    if (serviceData.price !== 0 && ['direct', 'escrow'].includes(serviceData.paymentType)) {
      try {
        const {data} = await axios.post('/api/stripe/createBookingIntent', {
          connectedAccountId: user.accountDetails.stripeAccountId,
          price: serviceData.price,
          currency: serviceData.currency,
          isEscrow: serviceData.paymentType === 'escrow',
          meetingCount: parseInt(values.meetingCount, 10),
          bookerEmail: values.email,
          percentDonated: serviceData.percentDonated,
        });
        setClientSecret(data.clientSecret);
        setShowCheckoutForm(true);
      } catch (err) {
        setApiError(t('common:general_api_error'));
      }
    } else {
      try {
        const captchaToken = await recaptchaRef.current.executeAsync();
        recaptchaRef.current.reset();

        await axios.post('/api/booking/freeBooking', {
          serviceID: serviceData._id,
          providerUsername: user.accountDetails.username,
          subject: values.subject,
          dateBooked: dayjs(selectedTime).format(),
          bookerName: values.name,
          bookerEmail: values.email,
          providerName: user.personalDetails.name,
          providerEmail: user.accountDetails.email,
          bookerPhone: values.phone,
          bookerTimeZone: selectedBookerTimezone,
          ccRecipients: ccRecipients,
          additionalNotes: values.notes,
          meetingCount: parseInt(values.meetingCount, 10),
          price: serviceData.price * values.meetingCount,
          paymentAccount: 'Manual',
          paymentType: serviceData.paymentType,
          currency: serviceData.currency,
          meetingDate: dayjs(selectedDate),
          paymentStatus: 'UNPAID',
          percentDonated: serviceData.percentDonated,
          charity: serviceData.charity,
          title: serviceData.title,
          conferenceType: values.conferenceType,
          translatedType: translatedType,
          startTime: dayjs(selectedTime),
          endTime: dayjs(selectedTime).add(serviceData.duration, 'minute'),
          meetingDuration: serviceData.duration,
          reminders: '',
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
        setConfirmBooking(true);
        setSubmitting(false);
      } catch (err) {
        if (err?.response?.status === 400) {
          setEmailError(err.response.data.message);
        }
        setSubmitting(false);
      }
    }
  };

  if (!validateProviderReceivingCapabilities(user, serviceData)) {
    return <div className='py-6 px-4 text-red-500'>{t('common:stripe_inactive_account')}</div>;
  }

  const isRecurring = serviceData !== null && serviceData.isRecurring;
  return (
    <>
      {!showCheckoutForm ? (
        <Formik
          initialValues={{...BOOKING_STATE, subject: serviceData.title}}
          validationSchema={BOOKING_YUP}
          enableReinitialize
          onSubmit={(values, {setSubmitting}) => {
            submitHandler(values, setSubmitting);
          }}
        >
          {({isSubmitting, values, handleChange, handleBlur, handleSubmit, touched, errors}) => (
            <Form onSubmit={handleSubmit}>
              <>
                <Recaptcha
                  ref={recaptchaRef}
                  size='invisible'
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
                />
                <div className='mt-10 sm:mt-0'>
                  <div className='md:grid md:grid-cols-1 md:gap-6'>
                    <div className='mt-5 md:mt-0 md:col-span-2'>
                      <div className='overflow-hidden sm:rounded-md'>
                        <div className='px-4 py-5 bg-white sm:p-6'>
                          <div className='grid grid-cols-6 gap-6'>
                            <div className='col-span-6 sm:col-span-3'>
                              <label
                                htmlFor='first-name'
                                className='block text-sm font-medium text-gray-700'
                              >
                                {t('page:Your_name')} *
                              </label>
                              <input
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type='text'
                                name='name'
                                id='name'
                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                              />
                              {touched.name && errors.name ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.name}
                                </div>
                              ) : null}
                            </div>
                            <div className='col-span-6 sm:col-span-3'>
                              <label
                                htmlFor='mediaLink'
                                className='block text-sm font-medium text-gray-700'
                              >
                                {t('profile:email_address')}*
                              </label>
                              <input
                                value={values.email}
                                onChange={handleChange}
                                maxLength={254}
                                onBlur={handleBlur}
                                type='email'
                                name='email'
                                className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                              />
                              {(touched.email && errors.email) || emailError ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.email || emailError}
                                </div>
                              ) : null}
                            </div>

                            <div className='col-span-6 sm:col-span-3'>
                              <label
                                htmlFor='first-name'
                                className='block text-sm font-medium text-gray-700'
                              >
                                {t('page:Subject')} *
                              </label>
                              <input
                                value={values.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type='text'
                                name='subject'
                                id='subject'
                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                              />
                              {touched.subject && errors.subject ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.subject}
                                </div>
                              ) : null}
                            </div>

                            <div className='col-span-6 sm:col-span-3'>
                              <label
                                htmlFor='type'
                                className='block text-sm font-medium text-gray-700'
                              >
                                {t('common:txt_phone_num')}*
                              </label>
                              <input
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type='text'
                                name='phone'
                                id='phone'
                                className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                              />
                              {touched.phone && errors.phone ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.phone}
                                </div>
                              ) : null}
                            </div>
                            <div className='col-span-6 sm:col-span-3'>
                              <label
                                htmlFor='type'
                                className='block text-sm font-medium text-gray-700'
                              >
                                {t('event:booking_conference_type')}
                              </label>
                              <DropDownComponent
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.conferenceType}
                                name='conferenceType'
                                options={options}
                              />
                              {touched.conferenceType && errors.conferenceType ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.conferenceType}
                                </div>
                              ) : null}
                            </div>
                            {isRecurring && (
                              <div className='col-span-6 sm:col-span-3'>
                                <label
                                  htmlFor='type'
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  {t('event:Service_reccuring_desc')}
                                </label>
                                <select
                                  value={values.meetingCount}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  id='meetingCount'
                                  name='meetingCount'
                                  className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                >
                                  {SelectMeetingCount}
                                </select>

                                {touched.meetingCount && errors.meetingCount ? (
                                  <div className='text-red-500 mt-2 text-sm font-normal'>
                                    {errors.meetingCount}
                                  </div>
                                ) : null}
                              </div>
                            )}
                            <div className='col-span-6 sm:col-span-3'>
                              <label
                                htmlFor='ccRecipients'
                                className='block text-sm font-medium text-gray-700'
                              >
                                {t('page:ccRecipients')}
                              </label>
                              <input
                                value={values.ccRecipients}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type='text'
                                name='ccRecipients'
                                placeholder='one@example.com; two@example.com'
                                id='ccRecipients'
                                className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                              />
                              {touched.ccRecipients && errors.ccRecipients ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.ccRecipients}
                                </div>
                              ) : null}
                            </div>
                            <div className='col-span-6 sm:col-span-6'>
                              <label
                                htmlFor='type'
                                className='block text-sm font-medium text-gray-700'
                              >
                                {t('common:txt_add_note')}
                              </label>
                              <textarea
                                rows={4}
                                onChange={handleChange}
                                name='notes'
                                value={values.notes}
                                id='notes'
                                className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                              />
                              {touched.notes && errors.notes ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.notes}
                                </div>
                              ) : null}
                            </div>
                            <div className='text-sm'>* {t('common:desc_required')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='px-4 mt-5 sm:mb-4 text-right sm:px-6'>
                    <span className='text-red-500 mr-2'>{apiError}</span>
                    <button
                      type='button'
                      className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    >
                      <a href={currentUrl}>{t('common:btn_cancel')}</a>
                    </button>
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    >
                      {isSubmitting ? t('common:txt_loading1') : t('profile:Book')}
                    </button>
                  </div>
                  {serviceData.paymentType === PAYMENT_TYPE.MANUAL && (
                    <div className='px-4 mt-5 sm:mb-4 sm:px-6 text-sm text-red-500'>
                      {t('setting:manual_payment_warning2')}
                    </div>
                  )}
                </div>
              </>
            </Form>
          )}
        </Formik>
      ) : (
        <CheckoutWrapper
          selectedBookerTimezone={selectedBookerTimezone}
          serviceData={serviceData}
          user={user}
          formPayload={formPayload}
          clientSecret={clientSecret}
        />
      )}
    </>
  );
};
export default BookingForm;
