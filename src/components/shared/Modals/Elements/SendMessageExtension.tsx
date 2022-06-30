import {useRef} from 'react';
import {PlusIcon} from '@heroicons/react/solid';
import {SEND_MESSAGE_STATE, SEND_MESSAGE_YUP} from 'constants/yup/sendMessage';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Recaptcha from 'react-google-recaptcha';
import axios from 'axios';
import Modal from '../Modal';

const SendMessageExtension = () => {
  const {t} = useTranslation();
  const {store, hideModal} = ModalContextProvider();
  const {modalProps} = store || {};
  const {providerName, providerEmail} = modalProps || {};

  const recaptchaRef = useRef<Recaptcha>();
  const SendMessage = async (values, setSubmitting) => {
    setSubmitting(true);

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    await axios.post('/api/sendMessageExtension/sendMessageExtension', {
      name: values.name,
      subject: values.subject,
      description: values.description,
      email: values.email,
      phone: values.phone,
      providerName,
      providerEmail,
      captcha: captchaToken,
    });
    setSubmitting(false);
    hideModal();
  };

  const submitHandler = async (values, setSubmitting) => {
    SendMessage(values, setSubmitting);
  };

  return (
    <Modal
      title={`${`${t('page:contact')} ${providerName}`}`}
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
      small
    >
      <Formik
        initialValues={SEND_MESSAGE_STATE}
        validationSchema={SEND_MESSAGE_YUP}
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
              <div className='px-4 mt-5 sm:mb-4 text-right sm:px-6'>
                <button
                  type='button'
                  onClick={hideModal}
                  className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('common:btn_cancel')}
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {isSubmitting ? t('common:txt_loading1') : t('common:btn_submit')}
                </button>
              </div>

              <div className='mt-10 sm:mt-0'>
                <div className='md:grid md:grid-cols-1 md:gap-6'>
                  <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='overflow-hidden sm:rounded-md'>
                      <div className='grid grid-cols-6 gap-6'>
                        <div className='col-span-6 sm:col-span-3'>
                          <label
                            htmlFor='first-name'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('profile:Full_Name')}
                          </label>
                          <input
                            value={values.name}
                            onChange={handleChange}
                            maxLength={100}
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
                          <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
                            {t('page:Subject')}
                          </label>
                          <input
                            value={values.subject}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type='text'
                            name='subject'
                            id='subject'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                          {touched.subject && errors.subject ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.subject}
                            </div>
                          ) : null}
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <label
                            htmlFor='mediaLink'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('profile:Email')}
                          </label>
                          <input
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={100}
                            type='email'
                            name='email'
                            id='email'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                          {touched.email && errors.email ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.email}
                            </div>
                          ) : null}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label
                            htmlFor='mediaLink'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('common:txt_phone')}
                          </label>
                          <input
                            value={values.phone}
                            maxLength={100}
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
                        <div className=' col-span-6'>
                          {t('common:Description')}
                          <textarea
                            rows={4}
                            name='description'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id='description'
                            value={values.description}
                            className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          />
                          {touched.description && errors.description ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.description}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default SendMessageExtension;
