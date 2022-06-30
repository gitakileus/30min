import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Calendar from 'components/PostLogin/Mymeetings/calendar';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import {useRouter} from 'next/router';

const Mymeetings = () => {
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
          <title> {t('meeting:txt_my_meeting')}</title>
        </Head>
        <Calendar />
      </Layout>
    </ProtectedRoute>
  );
};

export default Mymeetings;
Mymeetings.auth = true;
