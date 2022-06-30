import Layout from 'components/Layout/PostLogin';
import {getSession, useSession} from 'next-auth/react';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userQuery from 'constants/GraphQL/User/queries';
import queries from 'constants/GraphQL/Organizations/queries';

import Organizations from 'components/PostLogin/Organizations';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

const OrganizationPage = ({organizations, user}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title> {t('profile:organization_page_button')}</title>
        </Head>
        <Organizations organizations={organizations} user={user} />
      </Layout>
    </ProtectedRoute>
  );
};
export default OrganizationPage;
OrganizationPage.auth = true;

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
  const {data: organizations} = await graphqlRequestHandler(
    queries.getOrganizationManagementDetails,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: user} = await graphqlRequestHandler(
    userQuery.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  return {
    props: {
      user,
      organizations,
    },
  };
};
