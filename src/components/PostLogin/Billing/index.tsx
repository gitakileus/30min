import {BILLING_INFO_YUP} from 'constants/yup/billingInfo';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import Countries from 'constants/forms/country.json';
import {useSession} from 'next-auth/react';
import mutations from 'constants/GraphQL/User/mutations';
import {useContext, useEffect, useState} from 'react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';

const BilingEdit = ({userData}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();

  const router = useRouter();

  const User = userData?.billingDetails;
  const [updateUser] = useMutation(mutations.updateUser);

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const [initialValues, setInitialValues] = useState({
    fname: '',
    lname: '',
    address: '',
    buildingNumber: '',
    country: '',
    zipCode: '',
    city: '',
  });

  useEffect(() => {
    setInitialValues({
      fname: User?.fname,
      lname: User?.lname,
      address: User?.address,
      buildingNumber: User?.buildingNumber,
      country: User?.country === null ? 'United States' : User?.country,
      zipCode: User?.zipCode,
      city: User?.city,
    });
  }, [
    User?.address,
    User?.buildingNumber,
    User?.city,
    User?.country,
    User?.lname,
    User?.zipCode,
    User?.fname,
  ]);

  const CountriesPicker = Countries.map(countryData => (
    <option key={countryData.label}>{countryData.label}</option>
  ));

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);
    await updateUser({
      variables: {
        userData: {
          billingDetails: {
            fname: values.fname,
            lname: values.lname,
            address: values.address,
            buildingNumber: values.buildingNumber,
            country: values.country,
            city: values.city,
            zipCode: values.zipCode,
          },
        },
        token: session?.accessToken,
      },
    });
    showNotification(NOTIFICATION_TYPES.success, 'Billing information Saved', false);
    router.reload();
    setSubmitting(false);
  };

  return (
    <>
      <div className='col-span-8 sm:col-span-4 shadow-lg py-5 px-5'>
        <Formik
          initialValues={initialValues}
          validationSchema={BILLING_INFO_YUP}
          onSubmit={(values, {setSubmitting}) => {
            submitHandler(values, setSubmitting);
          }}
          enableReinitialize
        >
          {({isSubmitting, values, handleChange, handleBlur, handleSubmit, touched, errors}) => (
            <Form onSubmit={handleSubmit}>
              <span className='font-medium text-gray-500 paymentOptionDesc'>
                {t('setting:billing_info')}
              </span>
              <div className='row'>
                <div className='col-sm-6 my-3'>
                  <label htmlFor='fname' className='block text-sm font-medium text-gray-700'>
                    {t('profile:first_name')}*
                  </label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.fname}
                    maxLength={100}
                    name='fname'
                    id='fname'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                  {touched.fname && errors.fname ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {values.fname === null ? 'Required' : errors.fname}
                    </div>
                  ) : null}
                </div>
                <div className='col-sm-6 my-3'>
                  <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                    {t('profile:last_name')}*
                  </label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lname}
                    maxLength={100}
                    name='lname'
                    id='lname'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                  {touched.lname && errors.lname ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {values.lname === null ? 'Required' : errors.lname}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className='row'>
                <div className='col-sm-6 my-3'>
                  <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                    {t('profile:address')}*
                  </label>

                  <input
                    type='text'
                    value={values.address}
                    name='address'
                    onChange={handleChange}
                    maxLength={100}
                    onBlur={handleBlur}
                    id='address'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                  {touched.address && errors.address ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {values.address === null ? 'Required' : errors.address}
                    </div>
                  ) : null}
                </div>
                <div className='col-sm-6 my-3'>
                  <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                    {t('profile:building_number')}
                  </label>

                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type='text'
                    value={values.buildingNumber}
                    name='buildingNumber'
                    maxLength={15}
                    id='buildingNumber'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                  {touched.buildingNumber && errors.buildingNumber ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {errors.buildingNumber}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className='flex flex-wrap -mx-2 overflow-hidden sm:-mx-3 md:-mx-1 lg:-mx-1 xl:-mx-2'>
                <div className='my-2 px-2 w-full overflow-hidden sm:my-3 sm:px-3 sm:w-full md:my-1 md:px-1 md:w-1/3 lg:my-1 lg:px-1 lg:w-1/3 xl:my-2 xl:px-2 xl:w-1/3'>
                  <div className='row ml-1'>
                    <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                      {t('profile:country')}*
                    </label>
                  </div>
                  <select
                    value={values.country}
                    id='country'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name='country'
                    className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                  >
                    {CountriesPicker}
                  </select>
                  {touched.country && errors.country ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {t('common:desc_required')}
                    </div>
                  ) : null}
                </div>
                <div className='my-2 px-2 w-full overflow-hidden sm:my-3 sm:px-3 sm:w-full md:my-1 md:px-1 md:w-1/3 lg:my-1 lg:px-1 lg:w-1/3 xl:my-2 xl:px-2 xl:w-1/3'>
                  <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                    {t('profile:city')}*
                  </label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.city}
                    maxLength={50}
                    name='city'
                    id='city'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                  {touched.city && errors.city ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {values.city === null ? 'Required' : errors.city}
                    </div>
                  ) : null}
                </div>
                <div className='my-2 px-2 w-full overflow-hidden sm:my-3 sm:px-3 sm:w-full md:my-1 md:px-1 md:w-1/3 lg:my-1 lg:px-1 lg:w-1/3 xl:my-2 xl:px-2 xl:w-1/3'>
                  <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                    {t('profile:zip_code')}*
                  </label>

                  <input
                    type='text'
                    value={values.zipCode}
                    name='zipCode'
                    onChange={handleChange}
                    maxLength={15}
                    onBlur={handleBlur}
                    id='zipCode'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                  {touched.zipCode && errors.zipCode ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {values.zipCode === null ? 'Required' : errors.zipCode}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className='flex flex-row-reverse mb-6 '>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('common:btn_save')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default BilingEdit;
