import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Billing from 'components/PostLogin/Billing';
import queries from 'constants/GraphQL/User/queries';
import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import HeaderBar from 'components/PostLogin/Billing/HeaderBar';

const BillingPage = ({user}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title>{t('page:Billing Address')}</title>
        </Head>
        <HeaderBar />
        <Billing userData={user} />
      </Layout>
    </ProtectedRoute>
  );
};

export default BillingPage;
BillingPage.auth = true;

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
    process.env.BACKEND_API_KEY
  );

  const user = userData?.data?.getUserById?.userData;
  return {
    props: {
      user,
    },
  };
};
