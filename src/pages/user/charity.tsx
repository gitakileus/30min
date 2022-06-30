import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Charity from 'components/PostLogin/Charity/charity';
import {getSession, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';

const CharityPage = () => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title> {t('common:txt_charity_setting')}</title>
        </Head>
        <Charity />
      </Layout>
    </ProtectedRoute>
  );
};

export default CharityPage;
CharityPage.auth = true;

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
