import axios from 'axios';
import {OTP_STATE, OTP_YUP} from 'constants/yup/otp';
import {SIGNUP_STATE, SINGUP_YUP} from 'constants/yup/signup';
import {Field, Formik} from 'formik';
import {signIn} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useRef, useState} from 'react';
import Recaptcha from 'react-google-recaptcha';

const SignUp = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [error, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  let [response] = useState<any>({});
  const recaptchaRef = useRef<Recaptcha>();

  const signUpSubmitHandler = async values => {
    try {
      const captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      setLoading(true);
      await axios.post('/api/otp/handleOtpSignUp', {
        email: values.email,
        name: values.name,
        captchaToken,
      });

      setCurrentEmail(values.email);
      setCurrentName(values.name);
      setShowOtpInput(true);
      setLoading(false);
      setErrors('');
    } catch (err) {
      if (err.response.status === 409) {
        setErrors('User with this email already exists');
      }
      if (err.response.status === 400) {
        setErrors(err.response.data.message);
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
        setErrors('Invalid OTP. Please try again');
      }
      if (response && response?.status === 200) {
        router.replace('/user/welcome');
      }
    } catch (err) {
      setErrors('Invalid OTP. Please try again');
    }
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
            {t('common:Signup_title')}
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            {t('page:Or')}{' '}
            <a
              href={`/${router.locale}/auth/login`}
              className='font-medium text-mainBlue hover:text-mainBlue'
            >
              {t('common:Signin_title')}
            </a>
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            {showOtpInput ? (
              <Formik
                initialValues={OTP_STATE}
                onSubmit={otpSubmitHandler}
                validationSchema={OTP_YUP}
              >
                {({handleSubmit, errors}) => (
                  <>
                    <div>{t('common:otp_sent_to_email')}</div>
                    <div className='text-red-600'>{t('common:otp_expire_10_minutes')}</div>
                    <br />

                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                      <Recaptcha
                        ref={recaptchaRef}
                        size='invisible'
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
                      />
                      <div className='flex flex-row'>
                        <Field
                          className='appearance-none block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                          type='text'
                          name='otpToken'
                          required
                          placeholder='OTP Token'
                        />
                        <button
                          className='ml-2 buttonBase text-center px-1 w-40 rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                          type='button'
                          onClick={() =>
                            signUpSubmitHandler({email: currentEmail, name: currentName})
                          }
                        >
                          {loading ? t('common:txt_loading') : 'Re-send OTP'}
                        </button>
                      </div>
                      {errors && (
                        <p className='font-bold text-red-500 text-xs'>{errors.otpToken}</p>
                      )}
                      {error ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'>{error}</div>
                      ) : null}
                      <button
                        className='buttonBase block text-center w-full rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                        type='submit'
                      >
                        Verify OTP Token
                      </button>
                    </form>
                  </>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={SIGNUP_STATE}
                validationSchema={SINGUP_YUP}
                onSubmit={signUpSubmitHandler}
              >
                {({handleSubmit, values, errors, touched}) => (
                  <>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                      <Recaptcha
                        ref={recaptchaRef}
                        size='invisible'
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
                      />
                      <Field
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                        type='email'
                        name='email'
                        required
                        values={values.email}
                        placeholder='Email'
                      />{' '}
                      {touched.email && errors.email ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'> {errors.email}</div>
                      ) : null}
                      <Field
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                        type='name'
                        name='name'
                        required
                        values={values.name}
                        placeholder='Full Name'
                      />{' '}
                      {touched.name && errors.name ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'> {errors.name}</div>
                      ) : null}
                      {error ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'>{error}</div>
                      ) : null}
                      <button
                        className='buttonBase block text-center w-full rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                        type='submit'
                      >
                        Sign up with One Time Password
                      </button>
                    </form>
                  </>
                )}
              </Formik>
            )}

            <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>{t('page:Or')} </span>
                </div>
              </div>
              <button
                role='button'
                onClick={() =>
                  signIn('google', {
                    callbackUrl: `/${router.locale}/user/profile`,
                  })
                }
                className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10'
              >
                <svg
                  width={19}
                  height={20}
                  viewBox='0 0 19 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z'
                    fill='#4285F4'
                  />
                  <path
                    d='M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z'
                    fill='#34A853'
                  />
                  <path
                    d='M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z'
                    fill='#EB4335'
                  />
                </svg>
                <p className='text-base font-medium ml-4 text-gray-700'>Sign up with Google</p>
              </button>
              <button
                role='button'
                onClick={() =>
                  signIn('facebook', {
                    callbackUrl: `/${router.locale}/user/profile`,
                  })
                }
                className='focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-4'
              >
                <svg
                  width={24}
                  height={24}
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                  role='img'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='#4267B2'
                    d='M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999c0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891c1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z'
                  />
                </svg>

                <p className='text-base font-medium ml-4 text-gray-700'>Sign up with Facebook</p>
              </button>
              <button
                role='button'
                onClick={() =>
                  signIn('linkedin', {
                    callbackUrl: `/${router.locale}/user/profile`,
                  })
                }
                className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-4'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                  role='img'
                  width={24}
                  height={24}
                  preserveAspectRatio='xMidYMid meet'
                  viewBox='0 0 256 256'
                >
                  <path
                    fill='#0A66C2'
                    d='M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4c-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009c-.002-12.157 9.851-22.014 22.008-22.016c12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453'
                  />
                </svg>

                <p className='text-base font-medium ml-4 text-gray-700'>Sign up with Linkedin</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;
