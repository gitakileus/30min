import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Logging from 'components/PostLogin/Logging';
import {getSession, useSession} from 'next-auth/react';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import userQueries from 'constants/GraphQL/User/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';

const Logs = ({session}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title>{t('page:logs')}</title>
        </Head>
        <Logging session={session} />
      </Layout>
    </ProtectedRoute>
  );
};

export default Logs;
Logs.auth = true;

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
