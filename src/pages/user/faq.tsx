import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import FAQ from 'components/PostLogin/FAQ/FAQ';
import {useSession} from 'next-auth/react';

import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import {useRouter} from 'next/router';

const FAQPage = () => {
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
          <title>{t('page:FAQ')}</title>
        </Head>
        <FAQ />
      </Layout>
    </ProtectedRoute>
  );
};

export default FAQPage;
FAQPage.auth = true;
