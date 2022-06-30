import Services from 'components/PostLogin/ServicePage/ServicePage';
import Layout from 'components/Layout/PostLogin';
import {getSession, useSession} from 'next-auth/react';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import integrationQueries from 'constants/GraphQL/Integrations/queries';

const ServicePage = integrations => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title> {t('common:Services')}</title>
        </Head>
        <Services integrations={integrations} />
      </Layout>
    </ProtectedRoute>
  );
};
export default ServicePage;
ServicePage.auth = true;

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
    integrationQueries.getCredentialsByToken,
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
