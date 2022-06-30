import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import {getSession, useSession} from 'next-auth/react';
import EditProfilePage from 'components/PostLogin/Profile/EditProfile/EditProfile';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';

const EditProfile = ({userData}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title> {t('common:txt_edit_profile')}</title>
        </Head>
        <EditProfilePage userData={userData} />
      </Layout>
    </ProtectedRoute>
  );
};

export default EditProfile;
EditProfile.auth = true;

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

  return {
    props: {
      session,
      userData,
    },
  };
};
