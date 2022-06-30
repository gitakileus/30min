import {useSession} from 'next-auth/react';
import {WELCOME_STEP_ONE} from 'constants/yup/welcome';
import {Form, Formik} from 'formik';
import {useMutation} from '@apollo/client';
import Countries from 'constants/forms/country.json';
import timezones from 'constants/forms/timezones.json';
import useTranslation from 'next-translate/useTranslation';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {UserContext} from 'store/UserContext/User.context';
import {useRouter} from 'next/router';
import mutations from '../../../../constants/GraphQL/User/mutations';
import WelcomeSvg from './Svg/welcomeSvg';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const StepOne = ({handleClick, prev, User}) => {
  const {data: session} = useSession();
  const {
    state: {avatar},
    actions: {setFullname, setUsername, setCountry, setZipCode, setTimezone, setAvatar},
  } = useContext(UserContext);
  const router = useRouter();
  const {step} = router.query;
  const newStep = Number(step);

  const initialValues = {
    fullname: User?.personalDetails?.name,
    username: User?.accountDetails?.username,
    country: User?.locationDetails?.country ? User?.locationDetails?.country : 'United States',
    zipCode: User?.locationDetails?.zipCode,
    timezone: User?.locationDetails?.timezone ? User?.locationDetails?.timezone : dayjs.tz.guess(),
  };

  useEffect(() => {
    setAvatar(User?.accountDetails?.avatar);
  }, []);

  const [mutateImageUpload] = useMutation(singleUpload);
  const [mutateUpdateWelcome] = useMutation(mutations.updateUserWelcome);

  const {t} = useTranslation();
  const CountriesPicker = Countries.map(countryData => (
    <option key={countryData.label}>{countryData.label}</option>
  ));

  const TimezonesPicker = timezones.map(timezoneData => (
    <option key={timezoneData.value}>{timezoneData.value}</option>
  ));
  const [imageError, setImageError] = useState('');
  const [usernameEror, setUsernameError] = useState('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {valid} = event.target.validity;
    const image = event.target.files![0];
    try {
      if (valid) {
        const response = await mutateImageUpload({
          variables: {
            uploadType: 'USER_AVATAR',
            documentId: User._id,
            file: image,
            accessToken: session?.accessToken,
          },
        });
        if ([400, 409, 413].includes(response.data.singleUpload.status)) {
          setImageError('Image too large. Maximum size is 2 MB.');
          return;
        }
        setAvatar(response.data.singleUpload.message);
      } else console.log('not valid');
    } catch (e) {
      if ([400, 409, 413, 404].includes(e.response.status)) {
        setImageError('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);
    const response = await mutateUpdateWelcome({
      variables: {
        userData: {
          username: values.username,
          name: values.fullname,
          country: values.country,
          zipCode: values.zipCode,
          timezone: values.timezone,
        },
        token: session?.accessToken,
      },
    });

    if (response.data.updateUserWelcome.status === 409) {
      setUsernameError('Username Already Exists');
      setSubmitting(false);
    }
    setUsernameError('');

    setFullname(values.fullname);
    setCountry(values.country);
    setUsername(values.username);
    setZipCode(values.zipCode);
    setTimezone(values.timezone);
    router.push({
      pathname: '/user/welcome',
      query: {step: newStep + 1},
    });
    handleClick();
    setSubmitting(false);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-32 mx-8'>
      <div className='flex items-center justify-center self-start'>
        <WelcomeSvg
          className='w-60 h-60 sm:w-96 sm:h-96'
          skeleton='animate-animated animate-fadeInUp animate-fast animate-repeat-1'
          avatar='animate-animated animate-fadeInDown animate-fast animate-delay-1s'
        />
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={WELCOME_STEP_ONE}
        onSubmit={(values, {setSubmitting}) => {
          submitHandler(values, setSubmitting);
        }}
        enableReinitialize
      >
        {({isSubmitting, values, handleChange, handleBlur, handleSubmit, touched, errors}) => (
          <Form onSubmit={handleSubmit}>
            <div className='sm:overflow-hidden'>
              <div className='bg-white py-6 px-4 sm:p-6'>
                <div>
                  <h2
                    id='payment-details-heading'
                    className='text-lg leading-6 font-medium text-gray-900'
                  >
                    {t('profile:personal_details')}
                  </h2>
                  <p className='mt-1 text-sm text-gray-500'>{t('profile:personal_details_info')}</p>
                </div>
                <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4  gap-2'>
                  <div className='col-span-4 sm:col-span-2'>
                    <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                      {t('profile:Full_Name')}
                    </label>
                    <input
                      value={values.fullname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type='text'
                      name='fullname'
                      id='fullname'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                    />
                    {touched.fullname && errors.fullname ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.fullname}</div>
                    ) : null}
                  </div>

                  <div className='col-span-4 sm:col-span-2'>
                    <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                      {t('profile:Username')}
                    </label>
                    <input
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type='text'
                      name='username'
                      id='username'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                    />
                    <span className='text-red-600 text-sm'>{usernameEror}</span>
                    {touched.username && errors.username ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.username}</div>
                    ) : null}
                  </div>

                  <div className='col-span-4 sm:col-span-2'>
                    <label htmlFor='country' className='block text-sm font-medium text-gray-700'>
                      {t('profile:Country')}
                    </label>
                    <select
                      value={values.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id='country'
                      name='country'
                      className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                    >
                      {CountriesPicker}
                    </select>
                    {touched.country && errors.country ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {' '}
                        {t('common:desc_required')}
                      </div>
                    ) : null}
                  </div>

                  <div className='col-span-4 sm:col-span-2'>
                    <label
                      htmlFor='postal-code'
                      className='block text-sm font-medium text-gray-700'
                    >
                      {t('profile:zip_code')}
                    </label>
                    <input
                      value={values.zipCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type='text'
                      name='zipCode'
                      id='zipCode'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                    />
                    {touched.zipCode && errors.zipCode ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {values.zipCode === null ? t('profile:err_required') : errors.zipCode}
                      </div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-2'>
                    <label htmlFor='Timezone' className='block text-sm font-medium text-gray-700'>
                      {t('profile:Timezone')}
                    </label>
                    <select
                      value={values.timezone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id='timezone'
                      name='timezone'
                      className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                    >
                      {TimezonesPicker}
                    </select>
                    {touched.timezone && errors.timezone ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {' '}
                        {t('common:desc_required')}
                      </div>
                    ) : null}
                  </div>
                </div>

                <p className='text-sm font-medium text-gray-700 mt-4' aria-hidden='true'>
                  {t('profile:profile_avatar')}
                </p>
                <div className='mt-1 '>
                  <div className='flex items-center'>
                    <div
                      className='flex-shrink-0 inline-block rounded-full overflow-hidden h-20 w-20'
                      aria-hidden='true'
                    >
                      <div
                        className={`relative flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden`}
                      >
                        <img
                          className='relative rounded-full w-20 h-20 object-cover object-center'
                          src={avatar || '/assets/default-profile.jpg'}
                          alt='avatar'
                        />
                      </div>
                    </div>
                    <div className='ml-5 rounded-md shadow-sm'>
                      <div className='group relative border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500'>
                        <label
                          htmlFor='mobile-user-photo'
                          className='relative text-sm leading-4 font-medium text-gray-700 pointer-events-none'
                        >
                          <span>{t('common:btn_change')}</span>
                          <span className='sr-only'> user photo</span>
                        </label>
                        <input
                          id='mobile-user-photo'
                          name='user-photo'
                          accept='image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png,'
                          type='file'
                          onChange={event => {
                            handleFileChange(event);
                          }}
                          className='absolute w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md object-fill'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-2 flex flex-col'>
                    <span className='font-thin text-sm'>248px x 248px</span>
                    <span className='font-thin text-sm'>{t('common:max')} 2 MB</span>
                    <span className='text-red-600 text-sm'>{imageError}</span>
                  </div>
                </div>
              </div>
              <div className='px-4 text-right sm:px-6'>
                <button
                  type='button'
                  onClick={prev}
                  className='mb-4 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 mr-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('common:btn_previous')}
                </button>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={` bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
                >
                  {t('common:btn_continue')}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default StepOne;
