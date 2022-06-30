import axios from 'axios';
import {Field, Formik} from 'formik';
import {signIn} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useRef, useState} from 'react';
import {JOIN_STATE, JOIN_HAS_ACCOUNT_YUP, JOIN_NO_ACCOUNT_YUP} from 'constants/yup/join';
import {OTP_STATE, OTP_YUP} from 'constants/yup/otp';
import Recaptcha from 'react-google-recaptcha';

const VerifyEmail = ({emailHint, hasAccount, queryError}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const [showOtpInput, setShowOTP] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [emailError, setEmailErrors] = useState('');
  let [response] = useState<any>({});
  const [otpError, setOTPError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<Recaptcha>();

  const signInSubmitHandler = async values => {
    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    if (hasAccount) {
      try {
        setLoading(true);
        await axios.post('/api/otp/handleOtpSignIn', {
          email: values.email,
          captchaToken,
        });

        setCurrentEmail(values.email);
        setShowOTP(true);
        setEmailErrors('');
        setLoading(false);
      } catch (err) {
        if (err.response.status === 404) {
          setEmailErrors('Email not found');
        }
      }
    } else {
      try {
        setLoading(true);
        await axios.post('/api/otp/handleOtpSignUp', {
          email: values.email,
          name: values.name,
          captchaToken,
        });

        setCurrentEmail(values.email);
        setCurrentName(values.name);
        setShowOTP(true);
        setEmailErrors('');
        setLoading(false);
      } catch (err) {
        if (err.response.status === 404) {
          setEmailErrors('Email not found');
        }

        if (err.response.status === 409) {
          setEmailErrors('Email already in use');
        }
      }
    }
  };

  const otpSubmitHandler = async values => {
    try {
      response = await signIn('credentials', {
        email: currentEmail,
        otpToken: values.otpToken,
        callbackUrl: '/user/profile',
        redirect: false,
      });
      if (response && response?.error === ('CredentialsSignin' as string)) {
        setOTPError(t('common:invalid_otp'));
      }
      if (response && response?.status === 200) {
        router.push('/user/welcome');
      }
    } catch (err) {
      setOTPError(t('common:invalid_otp'));
    }
  };

  const validateEmail = value => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  };

  return (
    <>
      <div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
          <Image
            className='mx-auto h-12 w-auto '
            src='/assets/logo.svg'
            alt='30mins'
            height={50}
            width={50}
          />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            {t('profile:txt_VerifyEmail')}
          </h2>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-xl'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            {!queryError ? (
              <>
                <p className='mt-2 text-left text-md text-mainBlue'>{t('page:get_otp_code')}</p>
                <p className='mt-2 text-left text-sm text-gray-600'>
                  {t('page:get_otp_code_desc')}
                </p>
                <p className='mt-2 text-left text-sm text-gray-600 mb-4'>
                  {t('page:get_otp_code_delay')}
                </p>
                {showOtpInput ? (
                  <Formik
                    initialValues={OTP_STATE}
                    onSubmit={otpSubmitHandler}
                    validationSchema={OTP_YUP}
                  >
                    {({handleSubmit, isSubmitting, errors}) => (
                      <>
                        <div className='mt-2 text-left text-sm text-mainBlue font-bold'>
                          {t('common:otp_sent_to_email')}
                        </div>
                        <div className='mt-2 text-left text-sm text-red-600 font-bold'>
                          {t('common:otp_expire_10_minutes')}
                        </div>
                        <br />
                        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                          {errors && (
                            <p className='font-bold text-red-500 text-xs'>{errors.otpToken}</p>
                          )}
                          <div className='flex flex-row'>
                            <Field
                              className='appearance-none block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                              type='text'
                              name='otpToken'
                              placeholder='OTP Token'
                            />
                            <button
                              className='ml-2 buttonBase text-center px-1 w-40 rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                              type='button'
                              onClick={() =>
                                signInSubmitHandler({email: currentEmail, name: currentName})
                              }
                            >
                              {loading ? t('common:txt_loading') : 'Re-send OTP'}
                            </button>
                          </div>
                          {otpError && (
                            <span className='mt-2 text-left text-sm text-red-600 font-bold'>
                              {otpError}
                            </span>
                          )}
                          <button
                            className='buttonBase block text-center w-full rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                            type='submit'
                          >
                            {isSubmitting ? t('common:txt_loading') : 'Verify OTP Token'}
                          </button>
                        </form>
                      </>
                    )}
                  </Formik>
                ) : (
                  <Formik
                    initialValues={JOIN_STATE}
                    onSubmit={signInSubmitHandler}
                    validationSchema={hasAccount ? JOIN_HAS_ACCOUNT_YUP : JOIN_NO_ACCOUNT_YUP}
                  >
                    {({handleSubmit, errors, touched, isSubmitting}) => (
                      <>
                        <p className='mt-2 text-left text-sm text-gray-600 mb-4'>
                          Hint: {emailHint}
                        </p>
                        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                          <Recaptcha
                            ref={recaptchaRef}
                            size='invisible'
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
                          />
                          <Field
                            className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                            type='email'
                            validate={validateEmail}
                            name='email'
                            placeholder='Email'
                          />
                          {errors.email && touched.email && (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.email}
                            </div>
                          )}{' '}
                          {emailError && (
                            <span className='text-red-500 mt-2 text-sm font-normal'>
                              {emailError}
                            </span>
                          )}
                          {!hasAccount && (
                            <Field
                              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                              type='name'
                              name='name'
                              placeholder='Name'
                            />
                          )}
                          {!hasAccount && errors.name && touched.name && (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.name}
                            </div>
                          )}
                          <button
                            className='buttonBase block text-center w-full rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                            type='submit'
                          >
                            {isSubmitting ? t('common:txt_loading') : 'Send me One Time Password'}
                          </button>
                        </form>
                      </>
                    )}
                  </Formik>
                )}
              </>
            ) : (
              <p className='text-center text-red-600 font-bold'>Error: {queryError}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default VerifyEmail;
