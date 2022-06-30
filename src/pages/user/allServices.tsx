import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import AllServices from 'components/PostLogin/AllServices';
import {getSession, useSession} from 'next-auth/react';
import queries from 'constants/GraphQL/User/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

const AllServicesPage = ({session}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title>{t('page:All Services')}</title>
        </Head>
        <AllServices session={session} />
      </Layout>
    </ProtectedRoute>
  );
};

export default AllServicesPage;
AllServicesPage.auth = true;

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
    queries.getUserById,
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
