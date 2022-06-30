import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import mutations from 'constants/GraphQL/User/mutations';
import {useContext, useEffect, useState} from 'react';
import {SOCIAL_YUP} from 'constants/yup';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';

const SocialLinks = ({userData}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();

  const User = userData?.data?.getUserById?.userData?.personalDetails?.socials;
  const [initialValues, setInitialValues] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
  });
  const [updateUser] = useMutation(mutations.updateUser);
  const router = useRouter();
  useEffect(() => {
    setInitialValues({
      facebook: User?.facebook,
      instagram: User?.instagram,
      twitter: User?.twitter,
      linkedin: User?.linkedin,
      youtube: User?.youtube,
    });
  }, [User?.facebook, User?.instagram, User?.linkedin, User?.twitter, User?.youtube]);

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);

    await updateUser({
      variables: {
        userData: {
          personalDetails: {
            socials: {
              facebook: values.facebook,
              linkedin: values.linkedin,
              twitter: values.twitter,
              instagram: values.instagram,
              youtube: values.youtube,
            },
          },
        },
        token: session?.accessToken,
      },
    });
    showNotification(NOTIFICATION_TYPES.success, 'Socials Saved', false);
    router.reload();
    setSubmitting(false);
  };

  return (
    <>
      <div className='col-span-8 sm:col-span-4 shadow-lg py-5 px-5'>
        <Formik
          initialValues={initialValues}
          validationSchema={SOCIAL_YUP}
          onSubmit={(values, {setSubmitting}) => {
            submitHandler(values, setSubmitting);
          }}
          enableReinitialize
        >
          {({isSubmitting, values, handleChange, handleBlur, handleSubmit, touched, errors}) => (
            <Form onSubmit={handleSubmit}>
              <div className='row'>
                <div className='col-sm-6 my-3'>
                  <label htmlFor='facebook' className='block text-sm font-medium text-gray-700'>
                    {t('profile:txt_facebook')}
                  </label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.facebook}
                    name='facebook'
                    id='facebook'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                  {touched.facebook && errors.facebook ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {`${t('setting:invalid_url')} ${errors.facebook}`}
                    </div>
                  ) : null}
                </div>
                <div className='col-sm-6 my-3'>
                  <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                    {t('profile:txt_instagram')}
                  </label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.instagram}
                    name='instagram'
                    id='instagram'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />{' '}
                  {touched.instagram && errors.instagram ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {`${t('setting:invalid_url')} ${errors.instagram}`}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-6 my-3'>
                  <label htmlFor='twitter' className='block text-sm font-medium text-gray-700'>
                    {t('profile:txt_twitter')}
                  </label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.twitter}
                    name='twitter'
                    id='twitter'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />{' '}
                  {touched.twitter && errors.twitter ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {`${t('setting:invalid_url')} ${errors.twitter}`}
                    </div>
                  ) : null}
                </div>
                <div className='col-sm-6 my-3'>
                  <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                    {t('profile:txt_linkedin')}
                  </label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.linkedin}
                    name='linkedin'
                    id='linkedin'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />{' '}
                  {touched.linkedin && errors.linkedin ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {`${t('setting:invalid_url')} ${errors.linkedin}`}
                    </div>
                  ) : null}
                </div>
                <div className='col-sm-6 my-3'>
                  <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                    {t('profile:txt_youtube')}
                  </label>
                  <input
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.youtube}
                    name='youtube'
                    id='youtube'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />{' '}
                  {touched.youtube && errors.youtube ? (
                    <div className='text-red-500 mt-2 text-sm font-normal'>
                      {`${t('setting:invalid_url')} ${errors.youtube}`}
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

export default SocialLinks;
