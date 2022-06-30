import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userQuery from 'constants/GraphQL/User/queries';
import mutation from 'constants/GraphQL/User/mutations';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Layout from 'components/Layout/PostLogin';
import Loader from 'components/shared/Loader/Loader';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {ChevronRightIcon} from '@heroicons/react/solid';
import {useEffect, useState} from 'react';
import Countries from 'constants/forms/country.json';
import Timezones from 'constants/forms/timezones.json';
import {Formik, Form} from 'formik';
import {useRouter} from 'next/router';
import {useMutation} from '@apollo/client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {EDIT_USER_YUP} from 'constants/yup/editusers';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const AllUsers = ({user}) => {
  const User = user?.data?.getUserForAdmin?.userData;
  const {data: session, status} = useSession();
  const {t} = useTranslation();
  const router = useRouter();
  const [updateUser] = useMutation(mutation.adminUpdateUser);

  const [initialValues, setInitialValues] = useState({
    accountType: User?.accountDetails?.accountType,
    isIndividual: User?.accountDetails?.isIndividual,
    privateAccount: User?.accountDetails?.privateAccount,
    username: User?.accountDetails?.username,
    email: User?.accountDetails?.email,
    name: User?.personalDetails.name,
    phone: User?.personalDetails?.phone,
    headline: User?.personalDetails?.headline,
    description: User?.personalDetails?.description,
    website: User?.personalDetails?.website,
    facebook: User?.personalDetails?.socials?.facebook,
    youtube: User?.personalDetails?.socials?.youtube,
    twitter: User?.personalDetails?.socials?.twitter,
    instagram: User?.personalDetails?.socials?.instagram,
    linkedin: User?.personalDetails?.socials?.linkedin,
    country: User?.locationDetails.country,
    timezone: User?.locationDetails.timezone,
    zipCode: User?.locationDetails.zipCode,
  });

  useEffect(
    () =>
      setInitialValues({
        accountType: User?.accountDetails?.accountType,
        isIndividual: User?.accountDetails?.isIndividual,
        privateAccount: User?.accountDetails?.privateAccount,
        username: User?.accountDetails?.username,
        email: User?.accountDetails?.email,
        website: User?.personalDetails?.website,
        name: User?.personalDetails.name,
        headline: User?.personalDetails?.headline,
        phone: User?.personalDetails?.phone,
        description: User?.personalDetails?.description,
        facebook: User?.personalDetails?.socials?.facebook,
        youtube: User?.personalDetails?.socials?.youtube,
        twitter: User?.personalDetails?.socials?.twitter,
        instagram: User?.personalDetails?.socials?.instagram,
        linkedin: User?.personalDetails?.socials?.linkedin,
        country: User?.locationDetails.country,
        timezone: User?.locationDetails.timezone,
        zipCode: User?.locationDetails.zipCode,
      }),
    [User]
  );

  const [descLength, setDescLength] = useState(
    User?.personalDetails?.description
      ? (User?.personalDetails?.description || '')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/&nbsp;/gi, ' ').length
      : 0
  );

  const CountriesPicker = Countries.map(countryData => (
    <option key={countryData.label}>{countryData.label}</option>
  ));

  const TimezonesPicker = Timezones.map(timezoneEl => (
    <option key={timezoneEl.value}>{timezoneEl.value}</option>
  ));

  const SelectAccountType = [
    {key: t('profile:Individual'), value: 'true'},
    {key: t('profile:Business'), value: 'false'},
  ];

  const AccountType = SelectAccountType.map(option => (
    <option key={option.value}>{option.key}</option>
  ));

  const SelectAccountLevel = [
    {key: 'provider', value: 'provider'},
    {key: 'admin', value: 'admin'},
  ];

  const AccountLevel = SelectAccountLevel.map(option => (
    <option key={option.key}>{option.value}</option>
  ));

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);

    let individualValue = values.isIndividual;
    if (individualValue === 'Individual') {
      individualValue = true;
    } else if (individualValue === 'Business') {
      individualValue = false;
    }

    await updateUser({
      variables: {
        userData: {
          accountDetails: {
            accountType: values.accountType,
            isIndividual: individualValue,
            privateAccount: values.privateAccount,
            username: values.username,
            email: values.email,
          },
          personalDetails: {
            name: values.name,
            headline: values.headline,
            website: values.website,
            phone: values.phone,
            description: values.description,
            socials: {
              facebook: values.facebook,
              youtube: values.youtube,
              twitter: values.twitter,
              instagram: values.instagram,
              linkedin: values.linkedin,
            },
          },
          locationDetails: {
            country: values.country,
            timezone: values.timezone,
            zipCode: values.zipCode,
          },
        },
        token: session?.accessToken,
        documentId: User?._id,
      },
    });
    router.reload();
  };

  if (status === 'loading') {
    return <Loader />;
  }
  return (
    <ProtectedRoute status={status}>
      <Head>
        <title>{User.personalDetails.name}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout>
        <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
          <div className='flex-1 min-w-0'>
            <nav className='flex' aria-label='Breadcrumb'>
              <ol role='list' className='flex items-center space-x-4'>
                <li>
                  <div className='flex'>
                    <a href={'/'} className='text-sm font-medium text-gray-700 hover:text-gray-800'>
                      {t('page:Home')}
                    </a>
                  </div>
                </li>
                <li>
                  <div className='flex items-center'>
                    <ChevronRightIcon
                      className='flex-shrink-0 h-5 w-5 text-gray-500'
                      aria-hidden='true'
                    />
                    <Link href='/user/allusers' passHref>
                      <a className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                        {t('common:txt_all_users')}
                      </a>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className='flex items-center'>
                    <ChevronRightIcon
                      className='flex-shrink-0 h-5 w-5 text-gray-500'
                      aria-hidden='true'
                    />
                    <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                      {User.personalDetails.name}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
              {User.personalDetails.name}
            </h2>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={EDIT_USER_YUP}
          onSubmit={(values, {setSubmitting}) => {
            submitHandler(values, setSubmitting);
          }}
          enableReinitialize={true}
        >
          {({
            isSubmitting,
            values,
            handleSubmit,
            handleChange,
            handleBlur,
            touched,
            errors,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className='bg-white rounded-lg border shadow-lg mt-5 mb-5'>
                <div className='py-6 px-4 sm:p-6 lg:pb-8'>
                  <div className='mt-6 row'>
                    <div className='grid grid-cols-6 gap-6'>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='fname' className='block text-sm font-medium text-gray-700'>
                          {t('profile:Username')}
                        </label>
                        <input
                          type='text'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.username}
                          name='username'
                          id='username'
                          className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        />
                        {touched.username && errors.username ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.username}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                          {t('profile:Full_Name')}
                        </label>
                        <input
                          type='text'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          name='name'
                          id='name'
                          className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        />
                        {touched.name && errors.name ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>{errors.name}</div>
                        ) : null}
                      </div>

                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          {t('profile:txt_phone')}
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <input
                            type='text'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                            name='phone'
                            id='phone'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        {touched.phone && errors.phone ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.phone}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                          {t('profile:Headline')}
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <input
                            type='text'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.headline}
                            name='headline'
                            id='headline'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        {touched.headline && errors.headline ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.headline}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          {t('profile:Website')}
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <input
                            type='text'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.website}
                            name='website'
                            id='website'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        {touched.website && errors.website ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.website}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6'>
                        {t('common:txt_add_note')}
                        <CKEditor
                          name={t('common:Description')}
                          setDescLength={setDescLength}
                          value={values.description}
                          onChange={data => {
                            setFieldValue('description', data);
                          }}
                        />
                        {descLength}/750
                        {touched.description && errors.description ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {t('common:desc_required')}
                          </div>
                        ) : null}
                      </div>

                      <div className='col-span-2 sm:col-span-2'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          {t('profile:country')}
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <select
                            onChange={handleChange}
                            value={values.country}
                            id='country'
                            name='country'
                            className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                          >
                            {CountriesPicker}
                          </select>
                        </div>
                      </div>

                      <div className='col-span-2 sm:col-span-2'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          {t('profile:Timezone')}
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <select
                            onChange={handleChange}
                            value={values.timezone}
                            id='timezone'
                            name='timezone'
                            className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                          >
                            {TimezonesPicker}
                          </select>
                        </div>
                      </div>
                      <div className='col-span-2 sm:col-span-2'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          {t('profile:zip_code')}
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <input
                            type='text'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.zipCode}
                            name='zipCode'
                            id='zipCode'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        {touched.zipCode && errors.zipCode ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.zipCode}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          LinkedIn
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <input
                            type='text'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.linkedin}
                            name='linkedin'
                            id='linkedin'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        {touched.linkedin && errors.linkedin ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.linkedin}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          Facebook
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <input
                            type='text'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.facebook}
                            name='facebook'
                            id='facebook'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        {touched.facebook && errors.facebook ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.facebook}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          Instagram
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <input
                            type='text'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.instagram}
                            name='instagram'
                            id='instagram'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        {touched.instagram && errors.instagram ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.instagram}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          Twitter
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <input
                            type='text'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.twitter}
                            name='twitter'
                            id='twitter'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        {touched.twitter && errors.twitter ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.twitter}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          Youtube
                        </label>
                        <div className='mt-1 rounded-md shadow-sm flex'>
                          <input
                            type='text'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.youtube}
                            name='youtube'
                            id='youtube'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                        {touched.youtube && errors.youtube ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.youtube}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          {values.isIndividual ? 'Individual' : 'Business'}
                        </label>
                        <select
                          onChange={handleChange}
                          value={values.isIndividual}
                          id='isIndividual'
                          name='isIndividual'
                          className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                        >
                          {AccountType}
                        </select>
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                          {t(`profile:Account_type`)}
                        </label>
                        <div className='rounded-md shadow-sm flex'>
                          <select
                            onChange={handleChange}
                            value={values.accountType}
                            id='accountType'
                            name='accountType'
                            className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                          >
                            {AccountLevel}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className='mt-8' />
                  <div className='py-4 flex justify-end'>
                    {isSubmitting ? (
                      <button
                        disabled={isSubmitting}
                        className='ml-2 bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      >
                        {t('common:txt_loading1')}
                      </button>
                    ) : (
                      <button
                        type='submit'
                        className='ml-2 bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      >
                        {t('common:btn_save')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Layout>
    </ProtectedRoute>
  );
};
export default AllUsers;
AllUsers.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {destination: '/', permanent: false},
    };
  }

  const {data: user} = await graphqlRequestHandler(
    userQuery.getUserForAdmin,
    {
      token: session?.accessToken,
      documentId: context.query.id,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: userData} = await graphqlRequestHandler(
    userQuery.getUserById,
    {
      token: session?.accessToken,
    },
    session?.accessToken
  );

  const isAuthorized =
    userData?.data?.getUserById?.userData?.accountDetails?.accountType === 'admin';

  if (!isAuthorized) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const isWelcome = user?.data?.getUserById?.welcomeComplete;
  if (isWelcome) {
    return {
      redirect: {destination: '/user/welcome', permanent: false},
    };
  }
  return {
    props: {
      user,
    },
  };
};
