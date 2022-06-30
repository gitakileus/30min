import Layout from 'components/Layout/PostLogin';
import {getSession, useSession} from 'next-auth/react';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/Organizations/queries';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import PendingOrganizationInvitePage from 'components/PostLogin/Organizations/PendingOrganizationInvitePage';

const PendingOrganizationInvites = ({pendingInvites}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title> {t('profile:organization_page_button')}</title>
        </Head>
        <PendingOrganizationInvitePage pendingInvites={pendingInvites} />
      </Layout>
    </ProtectedRoute>
  );
};
export default PendingOrganizationInvites;
PendingOrganizationInvites.auth = true;

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
  const {data: pendingInvites} = await graphqlRequestHandler(
    queries.getPendingInvitesByUserId,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );
  return {
    props: {
      pendingInvites,
    },
  };
};
