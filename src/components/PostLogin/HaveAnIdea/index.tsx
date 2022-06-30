import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {HAVE_AN_IDEA_STATE, HAVE_AN_IDEA_YUP} from 'constants/yup/haveAnIdea';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/HaveAnIdea/mutations';
import {useSession} from 'next-auth/react';
import {useState} from 'react';

const HaveAnIdea = () => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const [messageSent, setMessageSent] = useState(false);

  const [mutation] = useMutation(mutations.createHaveAnIdeaMessage);

  const submitHandler = async (values, {setSubmitting, resetForm}) => {
    setMessageSent(false);
    try {
      await mutation({
        variables: {
          messageData: {
            headline: values.headline,
            description: values.description,
          },
          token: session?.accessToken,
        },
      });
      setSubmitting(false);
      setMessageSent(true);
      resetForm({});
      setTimeout(() => {
        setMessageSent(false);
      }, 4000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-32 mx-8'>
        <div className='flex items-center justify-center self-start'>
          <img src='/assets/idea.svg' alt='ideaSvg' />
        </div>
        <div className='bg-white py-6 px-4 sm:p-6'>
          <div>
            <h2 className='text-2xl font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-3xl'>
              {t('page:Have_an_idea_headline')}
            </h2>
            <p className='mt-6 max-w-xl text-md text-gray-500'>
              {t('page:Have_an_idea_description')}
            </p>
          </div>

          <Formik
            initialValues={HAVE_AN_IDEA_STATE}
            validationSchema={HAVE_AN_IDEA_YUP}
            onSubmit={submitHandler}
            enableReinitialize
          >
            {({isSubmitting, values, handleChange, handleBlur, handleSubmit, touched, errors}) => (
              <Form onSubmit={handleSubmit}>
                <div className='bg-white py-6'>
                  <div className='col-span-4 sm:col-span-2'>
                    <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                      {t('profile:Headline')}
                    </label>
                    <input
                      value={values.headline}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type='text'
                      name='headline'
                      id='headline'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                    />
                    {touched.headline && errors.headline ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.headline}</div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-2 py-1'>
                    <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                      {t('common:Description')}
                    </label>
                    <textarea
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='description'
                      id='description'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                    />
                    {touched.description && errors.description ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {errors.description}
                      </div>
                    ) : null}
                  </div>
                  <div className='flex flex-row-reverse'>
                    <button
                      type='submit'
                      className='bg-mainBlue flex mt-2 mr-2  justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
                    >
                      {isSubmitting
                        ? t('common:txt_loading')
                        : messageSent
                        ? t('page:Have_an_idea_thanks')
                        : t('common:btn_submit')}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          <p className='mt-6 max-w-xl text-md text-gray-900'>{t('page:Have_an_idea_footer')}</p>
          <p className='mt-6 max-w-xl text-md text-gray-900'>
            <a href='/user/extensions/write' target='_blank' rel='noopener noreferrer'>
              <span className='text-mainBlue font-bold'>{t('page:Learn_more')}</span>{' '}
            </a>
            {t('page:Have_an_idea_footer_learn_more')}.
          </p>
        </div>
      </div>
    </>
  );
};
export default HaveAnIdea;
