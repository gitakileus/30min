import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Layout from 'components/Layout/PostLogin';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {getSession, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {GetServerSideProps} from 'next';
import {useMutation} from '@apollo/client';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userQueries from 'constants/GraphQL/User/queries';
import organizationsQuery from 'constants/GraphQL/Organizations/queries';
import {ChangeEvent, useEffect, useState} from 'react';
import {ChevronRightIcon} from '@heroicons/react/solid';
import {Formik} from 'formik';
import {ORGANIZATION_YUP} from 'constants/yup/organization';
import Loader from 'components/shared/Loader/Loader';
import AddEditForm from 'components/PostLogin/Organizations/AddEditForm';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';

const EditOrganization = ({session, organizationData}) => {
  const Organization = organizationData?.data?.getOrganizationById?.organizationData;
  const {status} = useSession();
  const {t} = useTranslation();

  const [mutateFunction] = useMutation(singleUpload);
  const [imageError, setImageError] = useState('');
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const [initialValues, setInitialValues] = useState({
    description: Organization?.description,
    headline: Organization?.headline,
    image: Organization?.image,
    isPrivate: Organization?.isPrivate,
    location: Organization?.location,
    media: Organization?.media,
    restrictionLevel: Organization?.restrictionLevel,
    searchTags: Organization?.searchTags,
    slug: Organization?.slug,
    linkedin: Organization?.socials?.linkedin,
    facebook: Organization?.socials?.facebook,
    instagram: Organization?.socials?.instagram,
    youtube: Organization?.socials?.youtube,
    twitter: Organization?.socials?.twitter,
    type: Organization?.media?.type,
    link: Organization?.media?.link,
    supportEmail: Organization?.supportEmail,
    supportPhone: Organization?.supportPhone,
    title: Organization?.title,
    verified: Organization?.verified,
    website: Organization?.website,
    _id: Organization?._id,
  });

  useEffect(() => {
    setInitialValues({
      description: Organization?.description,
      headline: Organization?.headline,
      image: Organization?.image,
      isPrivate: Organization?.isPrivate,
      location: Organization?.location,
      media: Organization?.media,
      restrictionLevel: Organization?.restrictionLevel,
      searchTags: Organization?.searchTags,
      slug: Organization?.slug,
      facebook: Organization?.socials?.facebook,
      instagram: Organization?.socials?.instagram,
      youtube: Organization?.socials?.youtube,
      twitter: Organization?.socials?.twitter,
      linkedin: Organization?.socials?.linkedin,
      type: Organization?.media?.type,
      link: Organization?.media?.link,
      supportEmail: Organization?.supportEmail,
      supportPhone: Organization?.supportPhone,
      title: Organization?.title,
      verified: Organization?.verified,
      website: Organization?.website,
      _id: Organization?._id,
    });
  }, []);

  const [descLength, setDescLength] = useState(
    Organization?.description
      ? (Organization?.description || '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, ' ')
          .length
      : 0
  );

  // image upload
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {valid} = event.target.validity;
    const image = event.target.files![0];

    try {
      if (valid) {
        const response = await mutateFunction({
          variables: {
            uploadType: 'USER_AVATAR',
            documentId: session._id,
            file: image,
            accessToken: session?.accessToken,
          },
        });

        if ([400, 409, 413, 404].includes(response.data.singleUpload.status)) {
          setImageError('Maximum size allowed is MB');
          throw new Error(response.data.singleUpload.message);
          return;
        }

        setImageError('');
        // eslint-disable-next-line consistent-return
        return response.data.singleUpload.message;
      }
    } catch (error) {
      if ([400, 409, 413, 404].includes(error.response.status)) {
        setImageError('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', error);
    }
  };
  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);

    try {
      await graphqlRequestHandler(
        mutations.adminEditOrganization,
        {
          documentId: values._id,
          organizationData: {
            title: values.title,
            headline: values.headline,
            description: values.description,
            image: values.image,
            website: values.website,
            supportEmail: values.supportEmail,
            supportPhone: values.supportPhone,
            location: values.location,
            socials: {
              facebook: values.facebook,
              instagram: values.instagram,
              twitter: values.twitter,
              youtube: values.youtube,
              linkedin: values.linkedin,
            },
            searchTags: values.searchTags,
            media: {type: values.type, link: values.link},
            isPrivate: values.isPrivate === 'Private Organzation' ? true : false,
            verified: values.verified,
            slug: values.slug,
            restrictionLevel: values.restrictionLevel,
          },
          token: session?.accessToken,
        },
        session?.accessToken
      );
      router.reload();
    } catch (error) {
      setSubmitting(false);
      setApiError(`${error.response.message}`);
    }
  };

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <ProtectedRoute status={status}>
      <Head>
        <title>{Organization?.title}</title>
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
                    <a
                      href={`/user/allOrganizations/`}
                      className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'
                    >
                      {t('page:All Organzation')}
                    </a>
                  </div>
                </li>
                <li>
                  <div className='flex items-center'>
                    <ChevronRightIcon
                      className='flex-shrink-0 h-5 w-5 text-gray-500'
                      aria-hidden='true'
                    />
                    <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                      {Organization.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
              {Organization.title}
            </h2>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={ORGANIZATION_YUP}
          onSubmit={(values: any, {setSubmitting}: any) => {
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
            <AddEditForm
              isSubmitting={isSubmitting}
              values={values}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleImage={handleFileChange}
              touched={touched}
              errors={errors}
              setFieldValue={setFieldValue}
              descLength={descLength}
              setDescLength={setDescLength}
              imageError={imageError}
              type={'edit'}
              apiError={apiError}
            />
          )}
        </Formik>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditOrganization;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }

  const {data: userData} = await graphqlRequestHandler(
    userQueries.getUserById,
    {
      token: session?.accessToken,
    },
    session?.accessToken
  );

  // get organzation data
  const {data: organizationData} = await graphqlRequestHandler(
    organizationsQuery.getOrganizationById,
    {
      token: session?.accessToken,
      organizationId: context.query.id,
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

  return {
    props: {
      session,
      organizationData,
    },
  };
};
