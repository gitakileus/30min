import Layout from 'components/Layout/PreLogin';
import Login from 'components/PreLogin/Auth/Login';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import useTranslation from 'next-translate/useTranslation';

const LoginPage = () => {
  const {t} = useTranslation();
  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/auth/login/'}
        description={t('page:signin_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('common:Sign_in')} | 30mins`}
      />
      <Login />
    </Layout>
  );
};

export default LoginPage;
