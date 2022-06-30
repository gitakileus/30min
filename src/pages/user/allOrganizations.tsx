import Layout from 'components/Layout/PostLogin';
import AllOrganizations from 'components/PostLogin/AllOrganizations';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import queries from 'constants/GraphQL/User/queries';
import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';

const AllOrganizationsPage = ({session}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title>{t('page:All Organzation')}</title>
        </Head>
        <AllOrganizations session={session} />
      </Layout>
    </ProtectedRoute>
  );
};

export default AllOrganizationsPage;

AllOrganizationsPage.auth = true;

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
