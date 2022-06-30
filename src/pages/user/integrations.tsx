import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Integrations from 'components/PostLogin/Settings/calendars';
import queries from 'constants/GraphQL/Integrations/queries';
import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';

const Settings = ({integrations}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title> {t('common:txt_calendar_Integrations')}</title>
        </Head>
        <Integrations integrations={integrations} />
      </Layout>
    </ProtectedRoute>
  );
};

export default Settings;
Settings.auth = true;

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
  const {data: integrations} = await graphqlRequestHandler(
    queries.getCredentialsByToken,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  return {
    props: {
      integrations,
    },
  };
};
