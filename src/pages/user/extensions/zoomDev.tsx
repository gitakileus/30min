/* eslint-disable import/no-named-as-default-member */
import {useMutation} from '@apollo/client';
import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import userQueries from 'constants/GraphQL/User/queries';
import mutations from 'constants/GraphQL/Integrations/mutations';
import {ChevronRightIcon} from '@heroicons/react/solid';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Link from 'next/link';
import axios from 'axios';
import Layout from 'components/Layout/PostLogin';
import Head from 'next/head';
import stripeProductIDs from 'constants/stripeProductIDs';
import DevContainer from 'components/PostLogin/Extensions/Zoom/DevContainer';

const ZoomDev = ({integrations, errors, hasExtension}) => {
  const router = useRouter();
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {showModal, hideModal} = ModalContextProvider();
  const [zoomMutation] = useMutation(mutations.deleteZoomCredentials);

  const zoomCredentials = integrations?.data?.getCredentialsByToken?.zoomCredentials;

  const handleDeleteZoom = async email => {
    await zoomMutation({
      variables: {
        email: email,
        token: session?.accessToken,
      },
    });
    router.push('/user/extensions/zoomDev');
    hideModal();
  };

  const deleteZoom = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: itemID,
      id: itemID,
      handleDelete: handleDeleteZoom,
    });
  };

  return (
    <Layout>
      <Head>
        <title> {t('common:txt_zoom_extension')}</title>
      </Head>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
        <div className='flex-1 min-w-0'>
          <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex'>
                  <Link href='/' passHref>
                    <a className='text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                      {t('page:Home')}
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
                  <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                    {t('common:txt_zoom_extension')}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold h-10 text-mainBlue sm:text-3xl sm:truncate'>
            {t('common:txt_zoom_extension')}
          </h2>
        </div>
      </div>
      {hasExtension ? (
        <DevContainer zoomCredentials={zoomCredentials} errors={errors} deleteZoom={deleteZoom} />
      ) : (
        <div className='flex flex-col'>
          {t('common:txt_no_zoom_extension')}
          <a
            href='/user/extensions'
            className='max-w-max px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            {t('common:view_extensions_page')}
          </a>
        </div>
      )}
    </Layout>
  );
};
export default ZoomDev;

ZoomDev.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  let errors = '';

  if (context?.query?.code) {
    await axios
      .post(`${process.env.FRONT_END_URL}/api/integrations/zoom/dev/addCredential`, {
        code: context.query.code,
        token: session?.accessToken,
        email: session?.user?.email,
      })
      .catch(err => {
        errors = err.response.data.message;
      });
  }

  try {
    const {data: user} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );

    const hasExtension =
      user?.data?.getUserById?.userData?.accountDetails?.activeExtensions.includes(
        stripeProductIDs.EXTENSIONS.ZOOM
      );

    const {data: integrations} = await graphqlRequestHandler(
      integrationQueries.getCredentialsByToken,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );

    return {
      props: {
        integrations,
        errors,
        hasExtension,
      },
    };
  } catch (err) {
    return {
      props: {
        integrations: [],
        errors: 'Unknown Error',
        hasExtension: false,
      },
    };
  }
};
