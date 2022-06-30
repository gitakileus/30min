import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import ProfileHeader from 'components/PostLogin/Profile/ProfileHeader';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import queries from 'constants/GraphQL/User/queries';
import activeExtensionsQueries from 'constants/GraphQL/ActiveExtension/queries';
import serviceQueries from 'constants/GraphQL/Service/queries';
import credentialsQuery from 'constants/GraphQL/Integrations/queries';
import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';

const Profile = ({user, services, credentials, extensionsArray}) => {
  const {status} = useSession();
  const User = user?.data?.getUserById?.userData;
  return (
    <>
      <HeadSeo
        title={User?.personalDetails?.name}
        description={User?.personalDetails?.headline}
        canonicalUrl={`https://30mins.com/${User?.accountDetails?.username}`}
        ogTwitterImage={
          User?.accountDetails?.avatar
            ? User?.accountDetails?.avatar
            : 'https://30mins.com/assets/30mins-ogimage.jpg'
        }
        ogType={'website'}
      />
      <ProtectedRoute status={status}>
        <Layout>
          <ProfileHeader
            user={user}
            services={services}
            credentials={credentials}
            extensionsArray={extensionsArray}
          />
        </Layout>
      </ProtectedRoute>
    </>
  );
};

export default Profile;
Profile.auth = true;

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
  const {data: user} = await graphqlRequestHandler(
    queries.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: services} = await graphqlRequestHandler(
    serviceQueries.getServicesByUserId,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: credentials} = await graphqlRequestHandler(
    credentialsQuery.getCredentialsByToken,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const extensionsArray: any = [];

  const tempArray = user?.data?.getUserById?.userData?.accountDetails?.activeExtensions;
  if (tempArray && tempArray?.length > 0) {
    await Promise.all(
      tempArray.map(async (extensionID: any) => {
        const response = await graphqlRequestHandler(
          activeExtensionsQueries.getActiveExtensionByProductId,
          {
            token: session?.accessToken,
            productId: extensionID,
          },
          session?.accessToken
        );
        extensionsArray.push(
          response?.data?.data?.getActiveExtensionByProductId?.activeExtensionData
        );
      })
    );
  }

  const isWelcome = user?.data?.getUserById?.userData?.welcomeComplete;
  if (!isWelcome) {
    return {
      redirect: {destination: '/user/welcome', permanent: false},
    };
  }

  return {
    props: {
      user,
      services,
      credentials,
      extensionsArray,
    },
  };
};
