import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Layout from 'components/Layout/PostLogin';
import AllExtentions from 'components/PostLogin/AllExtentions';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import {getSession, useSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userQueries from 'constants/GraphQL/User/queries';
import {GetServerSideProps} from 'next';

const AllExtentionsPage = ({session}) => {
  const {status} = useSession();
  const {t} = useTranslation();

  return (
    <ProtectedRoute status={status}>
      <Head>
        <title>{t('page:All Extensions')}</title>
      </Head>
      <Layout>
        <AllExtentions session={session} />
      </Layout>
    </ProtectedRoute>
  );
};

export default AllExtentionsPage;

AllExtentionsPage.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  const {data: userData} = await graphqlRequestHandler(
    userQueries.getUserById,
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

  return {
    props: {
      session,
    },
  };
};
