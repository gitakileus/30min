import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import {getSession, useSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import queries from 'constants/GraphQL/User/queries';
import AllMeetings from 'components/PostLogin/AllMeetings/allmeetings';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

const AllMeetingsPage = ({session}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <>
      <Head>
        <title> {t('meeting:txt_all_meeting')}</title>
      </Head>
      <ProtectedRoute status={status}>
        <Layout>
          <AllMeetings session={session} />
        </Layout>
      </ProtectedRoute>
    </>
  );
};

export default AllMeetingsPage;
AllMeetingsPage.auth = true;

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

  if (!isAuthorized) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {session},
  };
};
