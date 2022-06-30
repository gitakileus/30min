import Availability from 'components/PostLogin/AvailabilityPage/AvailabilityPage';
import Layout from 'components/Layout/PostLogin';
import {getSession, useSession} from 'next-auth/react';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import AvailabilityQueries from 'constants/GraphQL/CollectiveAvailability/queries';
import ExtensionQuery from 'constants/GraphQL/ActiveExtension/queries';
import ProductIDs from 'constants/stripeProductIDs';

const AvailabilityPage = ({session, integrations, isExtensionActivate}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title> {t('page:Collective Availability')}</title>
        </Head>
        <Availability
          session={session}
          integrations={integrations}
          isExtensionActivate={isExtensionActivate}
        />
      </Layout>
    </ProtectedRoute>
  );
};
export default AvailabilityPage;
AvailabilityPage.auth = true;

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
    AvailabilityQueries.getAllGroups,
    {},
    session?.accessToken
  );

  const {data: isExtensionActivate} = await graphqlRequestHandler(
    ExtensionQuery.checkExtensionStatus,
    {
      productId: ProductIDs.EXTENSIONS.COLLECTIVE_AVAILABILITY,
    },
    session?.accessToken
  );

  return {
    props: {
      session,
      integrations,
      isExtensionActivate: isExtensionActivate?.data?.checkExtensionStatus?.isActive,
    },
  };
};
