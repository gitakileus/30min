import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import SpreadTheWord from 'components/PostLogin/SpreadTheWord';
import {useRouter} from 'next/router';

const Spreadword = () => {
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
          <title> {t('page:Spread the Word')}</title>
        </Head>
        <SpreadTheWord />
      </Layout>
    </ProtectedRoute>
  );
};

export default Spreadword;
Spreadword.auth = true;
