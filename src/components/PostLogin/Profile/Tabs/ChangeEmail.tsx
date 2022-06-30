import axios from 'axios';
import {Field, Form, Formik} from 'formik';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useState} from 'react';
import {OTP_STATE, OTP_YUP} from 'constants/yup/otp';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';
import {CHANGE_EMAIL_STATE, CHANGE_EMAIL_YUP} from 'constants/yup/changeEmail';
import {useRouter} from 'next/router';

const ChangeEmail = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const router = useRouter();
  const [showOtpInput, setShowOTP] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [showError, setShowError] = useState('');
  const [loading, setLoading] = useState<Boolean>(false);

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const [updateUser] = useMutation(mutations.updateUser);

  const changeEmailHandler = async values => {
    try {
      setShowError('');
      setLoading(true);
      const response = await axios.post('/api/otp/handleEmailChange', {
        email: values.email,
      });
      if (response.data?.emailChangeData.data?.handleEmailChange.status === 409) {
        setShowError(response.data?.emailChangeData.data?.handleEmailChange.message);
        setLoading(false);
        return;
      }
      setCurrentEmail(values.email);
      setLoading(false);
      setShowOTP(true);
    } catch (err) {
      if (err.response.status === 409) {
        setShowError(err.response.message);
      }
    }
  };

  const otpSubmitHandler = async values => {
    try {
      setShowError('');
      const response = await axios.post('/api/otp/validateOtp', {
        email: currentEmail,
        otpToken: values.otpToken,
      });
      if (response.data?.validateData?.data?.validateOtp?.response?.status === 400) {
        setShowError(response.data?.validateData?.data?.validateOtp?.response?.message);
        return;
      }
      await updateUser({
        variables: {
          userData: {
            accountDetails: {
              email: currentEmail,
            },
          },
          token: session?.accessToken,
        },
      });
      setShowOTP(false);
      showNotification(NOTIFICATION_TYPES.success, 'Email Updated', false);
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='bg-white py-8 shadow sm:rounded-lg px-4'>
        <div className='max-w-lg'>
          {showOtpInput ? (
            <Formik
              initialValues={OTP_STATE}
              onSubmit={otpSubmitHandler}
              validationSchema={OTP_YUP}
            >
              {({handleSubmit, errors: formErrors}) => (
                <>
                  <div>{t('common:otp_sent_to_email')}</div>
                  <div className='text-red-600'>{t('common:otp_expire_10_minutes')}</div>
                  <br />
                  <Form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    {formErrors && (
                      <p className='font-bold text-red-500 text-xs'>{formErrors.otpToken}</p>
                    )}
                    <div className='flex flex-row'>
                      <Field
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                        type='text'
                        name='otpToken'
                        placeholder='OTP Token'
                      />
                      <button
                        className='w-80 ml-2 buttonBase text-center px-1 rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                        type='submit'
                      >
                        {loading ? t('common:txt_loading') : t('Verify OTP Token')}
                      </button>
                    </div>
                    {showError && <span className='text-sm text-red-600'>{showError}</span>}
                  </Form>
                </>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={CHANGE_EMAIL_STATE}
              validationSchema={CHANGE_EMAIL_YUP}
              onSubmit={changeEmailHandler}
            >
              {({values, handleSubmit}) => (
                <Form onSubmit={handleSubmit}>
                  <span className='font-medium text-gray-500'>Change Email</span>
                  <div className='flex flex-row py-2'>
                    <Field
                      className='appearance-none block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                      value={values.email}
                      type='email'
                      name='email'
                      required={true}
                      placeholder='Enter new email'
                    />
                    <button
                      className='ml-2 buttonBase text-center px-1 w-40 rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                      type='submit'
                    >
                      {loading ? t('common:txt_loading') : t('common:Change Email')}
                    </button>
                  </div>
                  {showError && <span className='text-sm text-red-600'>{showError}</span>}
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </>
  );
};
export default ChangeEmail;
