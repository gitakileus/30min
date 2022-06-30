import Layout from 'components/Layout/PostLogin';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import HaveAnIdea from 'components/PostLogin/HaveAnIdea';
import HeaderBar from 'components/PostLogin/HaveAnIdea/HeaderBar';

const HaveAnIdeaPage = () => {
  const {data: session, status} = useSession();
  const {t} = useTranslation();
  const router = useRouter();

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router.pathname}`,
        permanent: false,
      },
    };
  }
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title> {t('page:Have_an_idea')}</title>
        </Head>
        <HeaderBar />
        <HaveAnIdea />
      </Layout>
    </ProtectedRoute>
  );
};
export default HaveAnIdeaPage;
HaveAnIdeaPage.auth = true;
