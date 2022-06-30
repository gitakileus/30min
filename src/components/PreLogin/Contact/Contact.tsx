import {MailIcon, PhoneIcon, LocationMarkerIcon} from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import {Form, Formik} from 'formik';
import {ContactState, CONTACT_YUP} from 'constants/yup/contact';
import axios from 'axios';
import {useEffect, useState} from 'react';

const Contact = () => {
  const {t} = useTranslation();

  const [emailSent, setEmailsent] = useState(false);
  const submitHandler = async (values, setSubmitting) => {
    try {
      setSubmitting(true);
      await axios.post('/api/contact', {
        senderEmail: values.email,
        senderName: values.fullname,
        message: values.message,
        subject: values.subject,
      });
      setSubmitting(false);
      setEmailsent(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (emailSent) {
      setTimeout(() => {
        setEmailsent(false);
      }, 5000);
    }
  }, [emailSent]);
  return (
    <div className='bg-white'>
      <main className='overflow-hidden'>
        <div className='bg-warm-gray-50'>
          <div className='py-24 lg:py-32'>
            <div className='relative z-10 max-w-7xl mx-auto pl-4 pr-8 sm:px-6 lg:px-8'>
              <h1 className='text-mainBlue text-4xl font-extrabold tracking-tight text-warm-gray-900 sm:text-4xl lg:text-6xl'>
                {t('page:GET_IN_TOUCH')}
              </h1>
            </div>
          </div>
        </div>

        <section className='relative bg-white'>
          <div className='absolute w-full h-1/2 bg-warm-gray-50' aria-hidden='true' />
          <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <svg
              className='absolute z-0 top-0 right-0 transform -translate-y-16 translate-x-1/2 sm:translate-x-1/4 md:-translate-y-24 lg:-translate-y-72'
              width={404}
              height={384}
              fill='none'
              viewBox='0 0 404 384'
              aria-hidden='true'
            >
              <defs>
                <pattern
                  id='64e643ad-2176-4f86-b3d7-f2c5da3b6a6d'
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits='userSpaceOnUse'
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className='text-warm-gray-200'
                    fill='currentColor'
                  />
                </pattern>
              </defs>
              <rect width={404} height={384} fill='url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)' />
            </svg>
          </div>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='relative bg-white shadow-xl'>
              <h2 id='contact-heading' className='sr-only'>
                {t('common:Contact_Us')}
              </h2>

              <div className='grid grid-cols-1 lg:grid-cols-3'>
                <div className='relative overflow-hidden py-10 px-6 bg-gradient-to-b from-mainBlue to-blue-600 sm:px-10 xl:p-12'>
                  <div
                    className='hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none lg:block'
                    aria-hidden='true'
                  >
                    <svg
                      className='absolute inset-0 w-full h-full'
                      width={160}
                      height={678}
                      viewBox='0 0 160 678'
                      fill='none'
                      preserveAspectRatio='xMidYMid slice'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z'
                        fill='url(#linear3)'
                        fillOpacity='.1'
                      />
                      <defs>
                        <linearGradient
                          id='linear3'
                          x1='192.553'
                          y1='325.553'
                          x2='899.66'
                          y2='1032.66'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stopColor='#fff' />
                          <stop offset={1} stopColor='#fff' stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3 className='text-lg font-medium text-white'>
                    {t('page:contact_information')}
                  </h3>

                  <dl className='mt-8 space-y-6'>
                    <dt>
                      <span className='sr-only'>Phone number</span>
                    </dt>
                    <dd className='flex text-base text-white'>
                      <PhoneIcon className='flex-shrink-0 w-6 h-6 text-white' aria-hidden='true' />
                      <span className='ml-3'>+1 323-207-1652</span>
                    </dd>
                    <dt>
                      <span className='sr-only'>Email</span>
                    </dt>
                    <dd className='flex text-base text-white'>
                      <MailIcon className='flex-shrink-0 w-6 h-6 text-white' aria-hidden='true' />
                      <span className='ml-3'>hello@30mins.com</span>
                    </dd>
                    <dd className='flex text-base text-white'>
                      <LocationMarkerIcon
                        className='flex-shrink-0 w-6 h-6 text-white'
                        aria-hidden='true'
                      />
                      <span className='ml-3'>1267 Willis St. Ste 200, Redding, CA 96001</span>
                    </dd>
                  </dl>
                  <ul role='list' className='mt-8 flex space-x-12'>
                    <li>
                      <a
                        className='text-white'
                        href='https://www.facebook.com/30-Mins-101256465504872'
                      >
                        <span className='sr-only'>Facebook</span>
                        <svg
                          className='w-7 h-7'
                          aria-hidden='true'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            fillRule='evenodd'
                            d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a className='text-white' href='https://www.linkedin.com/company/30mins-com/'>
                        <span className='sr-only'>Linkedin</span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='25'
                          height='25'
                          viewBox='0 0 50 50'
                          fill='currentColor'
                        >
                          <path d='M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z'>
                            {' '}
                          </path>
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a className='text-white' href='https://twitter.com/30Mins_com'>
                        <span className='sr-only'>Twitter</span>
                        <svg fill='currentColor' viewBox='0 0 24 24' className='h-6 w-6'>
                          <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a className='text-white' href='https://www.instagram.com/30mins_com/'>
                        <span className='sr-only'>Instagram</span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          aria-hidden='true'
                          role='img'
                          className='h-6 w-6'
                          width='1em'
                          height='1em'
                          preserveAspectRatio='xMidYMid meet'
                          viewBox='0 0 24 24'
                        >
                          <path
                            fill='currentColor'
                            fillRule='evenodd'
                            d='M7.465 1.066C8.638 1.012 9.012 1 12 1c2.988 0 3.362.013 4.534.066c1.172.053 1.972.24 2.672.511c.733.277 1.398.71 1.948 1.27c.56.549.992 1.213 1.268 1.947c.272.7.458 1.5.512 2.67C22.988 8.639 23 9.013 23 12c0 2.988-.013 3.362-.066 4.535c-.053 1.17-.24 1.97-.512 2.67a5.396 5.396 0 0 1-1.268 1.949c-.55.56-1.215.992-1.948 1.268c-.7.272-1.5.458-2.67.512c-1.174.054-1.548.066-4.536.066c-2.988 0-3.362-.013-4.535-.066c-1.17-.053-1.97-.24-2.67-.512a5.397 5.397 0 0 1-1.949-1.268a5.392 5.392 0 0 1-1.269-1.948c-.271-.7-.457-1.5-.511-2.67C1.012 15.361 1 14.987 1 12c0-2.988.013-3.362.066-4.534c.053-1.172.24-1.972.511-2.672a5.396 5.396 0 0 1 1.27-1.948a5.392 5.392 0 0 1 1.947-1.269c.7-.271 1.5-.457 2.67-.511Zm8.98 1.98c-1.16-.053-1.508-.064-4.445-.064c-2.937 0-3.285.011-4.445.064c-1.073.049-1.655.228-2.043.379c-.513.2-.88.437-1.265.822a3.412 3.412 0 0 0-.822 1.265c-.151.388-.33.97-.379 2.043c-.053 1.16-.064 1.508-.064 4.445c0 2.937.011 3.285.064 4.445c.049 1.073.228 1.655.379 2.043c.176.477.457.91.822 1.265c.355.365.788.646 1.265.822c.388.151.97.33 2.043.379c1.16.053 1.507.064 4.445.064c2.938 0 3.285-.011 4.445-.064c1.073-.049 1.655-.228 2.043-.379c.513-.2.88-.437 1.265-.822c.365-.355.646-.788.822-1.265c.151-.388.33-.97.379-2.043c.053-1.16.064-1.508.064-4.445c0-2.937-.011-3.285-.064-4.445c-.049-1.073-.228-1.655-.379-2.043c-.2-.513-.437-.88-.822-1.265a3.413 3.413 0 0 0-1.265-.822c-.388-.151-.97-.33-2.043-.379Zm-5.85 12.345a3.669 3.669 0 0 0 4-5.986a3.67 3.67 0 1 0-4 5.986ZM8.002 8.002a5.654 5.654 0 1 1 7.996 7.996a5.654 5.654 0 0 1-7.996-7.996Zm10.906-.814a1.337 1.337 0 1 0-1.89-1.89a1.337 1.337 0 0 0 1.89 1.89Z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className='py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12'>
                  <Formik
                    initialValues={ContactState}
                    validationSchema={CONTACT_YUP}
                    onSubmit={(values, {setSubmitting}) => {
                      submitHandler(values, setSubmitting);
                    }}
                  >
                    {({
                      isSubmitting,
                      values,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      touched,
                      errors,
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <h3 className='text-lg font-medium text-warm-gray-900'>
                          {t('page:send_us_a_message')}
                        </h3>
                        <div className='mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8'>
                          <div>
                            <label
                              htmlFor='first-name'
                              className='block text-sm font-medium text-warm-gray-900'
                            >
                              {t('profile:Full_Name')}*
                            </label>
                            <div className='mt-1'>
                              <input
                                type='text'
                                value={values.fullname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name='fullname'
                                id='text'
                                className='py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-blue-500 focus:border-blue-500 border-warm-gray-300 rounded-md'
                              />
                              {touched.fullname && errors.fullname ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.fullname}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor='email'
                              className='block text-sm font-medium text-warm-gray-900'
                            >
                              {t('profile:Email')}*
                            </label>
                            <div className='mt-1'>
                              <input
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                id='email'
                                name='email'
                                type='email'
                                autoComplete='email'
                                className='py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-blue-500 focus:border-blue-500 border-warm-gray-300 rounded-md'
                              />
                              {touched.email && errors.email ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.email}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className='sm:col-span-2'>
                            <label
                              htmlFor='subject'
                              className='block text-sm font-medium text-warm-gray-900'
                            >
                              {t('page:Subject')}*
                            </label>
                            <div className='mt-1'>
                              <input
                                value={values.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type='text'
                                name='subject'
                                id='subject'
                                className='py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-blue-500 focus:border-blue-500 border-warm-gray-300 rounded-md'
                              />
                              {touched.subject && errors.subject ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.subject}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className='sm:col-span-2'>
                            <div className='flex justify-between'>
                              <label
                                htmlFor='message'
                                className='block text-sm font-medium text-warm-gray-900'
                              >
                                {t('page:Message')}*
                              </label>
                              <span id='message-max' className='text-sm text-warm-gray-500'>
                                Max. 500 characters
                              </span>
                            </div>
                            <div className='mt-1'>
                              <textarea
                                value={values.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                id='message'
                                name='message'
                                rows={4}
                                maxLength={500}
                                className='py-3 px-4 block w-full shadow-sm text-warm-gray-900 focus:ring-blue-500 focus:border-blue-500 border-warm-gray-300 rounded-md'
                                aria-describedby='message-max'
                              />
                              {touched.message && errors.message ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.message}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className='sm:col-span-2 sm:flex sm:justify-end'>
                            <button
                              type='submit'
                              disabled={isSubmitting}
                              className='mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto'
                            >
                              {isSubmitting
                                ? t('common:txt_loading1')
                                : emailSent
                                ? t('common:email_sent')
                                : t('common:send_email')}
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Contact;
